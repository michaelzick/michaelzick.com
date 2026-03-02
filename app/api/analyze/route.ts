import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'nodejs';

// Simple in-memory rate limiting (per instance)
const rateLimitMap = new Map<string, { count: number; lastReset: number; }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 5;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, answers, website } = body;

    // 1. Honeypot check
    if (website) {
      console.warn('Bot detected via honeypot:', { email, website });
      return NextResponse.json({ error: 'System busy. Please try again later.' }, { status: 400 });
    }

    // 2. Rate limiting by IP
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'anonymous';
    const now = Date.now();
    const userLimit = rateLimitMap.get(ip) || { count: 0, lastReset: now };

    if (now - userLimit.lastReset > RATE_LIMIT_WINDOW) {
      userLimit.count = 0;
      userLimit.lastReset = now;
    }

    if (userLimit.count >= MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json({ error: 'Too many requests. Please try again in an hour.' }, { status: 429 });
    }

    userLimit.count++;
    rateLimitMap.set(ip, userLimit);

    // 3. Validation & Character Limits
    if (!firstName || !lastName || !email || !answers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (firstName.length > 50 || lastName.length > 50 || email.length > 100) {
      return NextResponse.json({ error: 'Input exceeds character limits' }, { status: 400 });
    }

    const MAX_ANSWER_LENGTH = 1000;
    const MAX_ANSWERS_COUNT = 10;
    const answerEntries = Object.entries(answers);

    if (answerEntries.length > MAX_ANSWERS_COUNT) {
      return NextResponse.json({ error: 'Too many responses' }, { status: 400 });
    }

    const tooLong = answerEntries.some(([_, a]: any) => typeof a === 'string' && a.length > MAX_ANSWER_LENGTH);
    if (tooLong) {
      return NextResponse.json({ error: 'Response exceeds character limits' }, { status: 400 });
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
      You are Michael Zick, a Nice Guy Recovery Coach.
      You are known for your compassionate yet no-BS approach. You help high-functioning men break free from childhood enmeshment, toxic shame, covert contracts, and the "addiction to female approval."

      A potential client has filled out an intake questionnaire. Analyze their responses and provide a "Nice Guy Recovery Analysis."

      User Info:
      Name: ${firstName} ${lastName}
      Email: ${email}

      Questionnaire Responses:
      ${Object.entries(answers)
        .map(([question, answer]) => `Q: ${question}\nA: ${answer}`)
        .join('\n\n')}

      Provide a response that:
      1. Validates their struggles with approval addiction without coddling (be "no-BS").
      2. Explains how their current behaviors reflect covert contracts or a lack of displeasure tolerance.
      3. Briefly explains how you, Michael Zick, can help them build internal authority and self-led masculinity.
      4. Suggests a simple first step (action-oriented).
      5. Keep it professional, encouraging, and in Michael's voice.
      6. Limit the response to about 3-4 concise paragraphs.

      Format the response in Markdown. Do not include a signature as the UI will handle that.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini", // User requested gpt-5-mini
      messages: [
        { role: "system", content: "You are Michael Zick, a Nice Guy Recovery Coach." },
        { role: "user", content: prompt }
      ],
    }).catch(async (err) => {
      // Fallback if gpt-5-mini is not available to the key
      if (err.status === 404 || err.message.includes('model_not_found')) {
        console.warn('gpt-5-mini not found, falling back to gpt-4o-mini');
        return await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are Michael Zick, a Nice Guy Recovery Coach." },
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

        const subject = `[michaelzick.com] New Approval Addiction Result: ${firstName} ${lastName}`;
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
      }
    }

    return NextResponse.json({ analysis: analysisText });
  } catch (error: any) {
    console.error('Error in analysis API:', error);
    return NextResponse.json({
      error: 'Failed to analyze inputs',
    }, { status: 500 });
  }
}
