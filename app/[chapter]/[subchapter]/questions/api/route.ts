import OpenAI from 'openai';

const openai = new OpenAI();

export async function POST(request: Request) {
  const body = await request.json();

  const params: OpenAI.Chat.ChatCompletionCreateParams = {
    messages: [
      {
        role: 'system',
        content: 'Please explain this question using natural language',
      },
      { role: 'user', content: JSON.stringify(body.question) },
    ],
    model: 'gpt-3.5-turbo',
  };

  const completion = await openai.chat.completions.create(params);

  return new Response(completion.choices[0].message.content);
}
