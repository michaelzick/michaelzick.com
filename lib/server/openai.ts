import OpenAI from 'openai';

export function getServerOpenAIClient(env = process.env) {
  const apiKey = env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  return new OpenAI({ apiKey });
}
