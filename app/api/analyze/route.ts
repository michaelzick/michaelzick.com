import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, answers } = await req.json();

    if (!firstName || !lastName || !email || !answers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!apiKey) {
      console.error('CRITICAL: GEMINI_API_KEY is not defined in environment variables');
      return NextResponse.json({ error: 'AI Service Configuration Error' }, { status: 500 });
    }

    // Try multiple model IDs in order of preference
    const modelIds = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
    let lastError = null;
    let analysisText = '';

    for (const modelId of modelIds) {
      try {
        const model = genAI.getGenerativeModel({ model: modelId });
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

        const result = await model.generateContent(prompt);
        const response = await result.response;
        analysisText = response.text();

        if (analysisText) {
          console.log(`Successfully generated content using model: ${modelId}`);
          break;
        }
      } catch (err: any) {
        console.error(`Error with model ${modelId}:`, err.message);
        lastError = err;
        continue; // Try next model
      }
    }

    if (!analysisText) {
      throw lastError || new Error('All models failed to generate content');
    }

    return NextResponse.json({ analysis: analysisText });
  } catch (error: any) {
    console.error('Error in analysis API:', error);
    return NextResponse.json({
      error: 'Failed to analyze inputs',
      details: error.message,
      suggestion: 'Check if your Gemini API key is correct and has access to the models.'
    }, { status: 500 });
  }
}
