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
  rating:z.number(),
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

// Run the flow
async function main() {
  const anime = await animeSuggestionFlow({
	  genre: "action comedy",
  });

  console.log(anime);
}

main().catch(console.error);
