import { googleAI } from '@genkit-ai/google-genai';
import { genkit, z } from 'genkit';

// Initialize Genkit with the Google AI plugin
const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model('gemini-2.5-flash', {
    temperature: 0.8,
  }),
});

// Define input schema
const AnimeInputSchema = z.object({
  genre: z.string().describe('Anime Genres'),
});

// Define output schema
const AnimeSchema = z.object({
  title: z.string(),
  description: z.string(),
  rating: z.number(),
  studio: z.string(),
  author: z.string(),
});

// Define a anime Suggestion flow
export const animeSuggestionFlow = ai.defineFlow(
  {
    name: 'animeSuggestionFlow',
    inputSchema: AnimeInputSchema,
    outputSchema: AnimeSchema,
  },
  async (input) => {
    // Create a prompt based on the input
    const prompt = `Suggest a anime with the following requirements:
      genre: ${input.genre} }`;

    // Generate structured anime data using the same schema
    const { output } = await ai.generate({
      prompt,
      output: { schema: AnimeSchema },
    });

    if (!output) throw new Error('Failed to Suggest an Anime');

    return output;
  },
);

async function getInput() {
  let input: string;
  console.log("   === Anime Suggestion ===   ");
  console.log(" Enter a comma seperated list of genres the anime should belong to: ");
  process.stdin.on("data", async (data) => {
    input = data.toString().trim().split(',').join(' ');
    const anime = await animeSuggestionFlow({
      genre: input,
    });
    if (anime) {
      console.log(anime);
      process.exit(1);
    }
  });

}

// Run the flow
async function main() {
  await getInput();
}

main().catch(console.error);
