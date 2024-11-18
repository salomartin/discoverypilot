import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const META_PROMPT = await Bun.file('./content/ai/audio_generate_metaprompt.md').text();
const TASK_PROMPT = await Bun.file('./content/interview_guide_input.md').text();
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const OUTPUT_FILE = Bun.file(`./content/outputs/output-${timestamp}.md`);

export async function generatePrompt(): Promise<string> {
  console.log('Starting prompt generation...');
  
  const writer = OUTPUT_FILE.writer();
  
  const stream = await client.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system", 
        content: META_PROMPT,
      },
      {
        role: "user",
        content: `Task, Goal, or Current Prompt:\n${TASK_PROMPT}`,
      },
    ],
    stream: true,
  });

  let fullContent = '';
  
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    if (content) {
      writer.write(content);
      fullContent += content;
      process.stdout.write(content);
    }
  }

  writer.flush();
  writer.end();

  console.log('\nFinished generating prompt');
  return fullContent;
}

await generatePrompt();