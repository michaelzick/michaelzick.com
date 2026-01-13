import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, answers } = await req.json();

    if (!firstName || !lastName || !email || !answers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('CRITICAL: OPENAI_API_KEY is not defined in environment variables');
      return NextResponse.json({ error: 'AI Service Configuration Error' }, { status: 500 });
    }

    const password = process.env['BREVO_SMTP_PASSWORD'];
    const userName = process.env['BREVO_USER'];
    const toAddress = process.env['BREVO_TO'];
    const fromAddress = process.env['BREVO_FROM'];

    const prompt = `
      You are Michael Zick, a Reality Alignment Coach.
      You are known for your no-BS approach, your belief that "we act our way into right thinking," and your emphasis on taking ownership, stopping victimhood, and connecting with nature.

      A potential client has filled out an intake questionnaire. Analyze their responses and provide a "Reality Alignment Analysis."

      User Info:
      Name: ${firstName} ${lastName}
      Email: ${email}

      Questionnaire Responses:
      ${Object.entries(answers)
        .map(([question, answer]) => `Q: ${question}\nA: ${answer}`)
        .join('\n\n')}

      Provide a response that:
      1. Validates their struggles without coddling (be "no-BS").
      2. Explains how their current "reality" might be misaligned.
      3. Briefly explains how you, Michael Zick, can help them align with reality through action and ownership.
      4. Suggests a simple first step (action-oriented).
      5. Keep it professional, encouraging, and in Michael's voice.
      6. Limit the response to about 3-4 concise paragraphs.

      Format the response in Markdown. Do not include a signature as the UI will handle that.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini", // User requested gpt-5-mini
      messages: [
        { role: "system", content: "You are Michael Zick, a Reality Alignment Coach." },
        { role: "user", content: prompt }
      ],
    }).catch(async (err) => {
      // Fallback if gpt-5-mini is not available to the key
      if (err.status === 404 || err.message.includes('model_not_found')) {
        console.warn('gpt-5-mini not found, falling back to gpt-4o-mini');
        return await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are Michael Zick, a Reality Alignment Coach." },
            { role: "user", content: prompt }
          ],
        });
      }
      throw err;
    });

    const analysisText = completion.choices[0].message.content;

    if (!analysisText) {
      throw new Error('OpenAI failed to generate content');
    }

    // Send email notification if SMTP is configured
    if (password && userName && toAddress && fromAddress) {
      try {
        const transporter = nodemailer.createTransport({
          host: 'smtp-relay.brevo.com',
          port: 587,
          auth: {
            user: userName,
            pass: password,
          },
        });

        const subject = `[michaelzick.com] New Reality Alignment Result: ${firstName} ${lastName}`;
        const questionsAndAnswers = Object.entries(answers)
          .map(([qId, answer]) => `Q: ${qId}\nA: ${answer}`)
          .join('\n\n');

        await transporter.sendMail({
          from: fromAddress,
          to: toAddress,
          replyTo: email,
          subject: subject,
          text: `Name: ${firstName} ${lastName}\nEmail: ${email}\n\nQUEST_ANSWERS:\n${questionsAndAnswers}\n\nAI_ANALYSIS:\n${analysisText}`,
        });
      } catch (mailErr) {
        console.error('Failed to send result email:', mailErr);
        // Don't fail the request if email fails, as the user already has the result in UI
      }
    }

    return NextResponse.json({ analysis: analysisText });
  } catch (error: any) {
    console.error('Error in analysis API:', error);
    return NextResponse.json({
      error: 'Failed to analyze inputs',
      details: error.message,
      suggestion: 'Check if your OpenAI API key is correct and has access to the gpt-4o model.'
    }, { status: 500 });
  }
}
