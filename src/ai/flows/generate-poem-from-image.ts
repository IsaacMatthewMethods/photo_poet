'use server';
/**
 * @fileOverview An AI agent that generates a poem based on an image.
 *
 * - generatePoemFromImage - A function that handles the poem generation process.
 * - GeneratePoemFromImageInput - The input type for the generatePoemFromImage function.
 * - GeneratePoemFromImageOutput - The return type for the generatePoemFromImage function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GeneratePoemFromImageInputSchema = z.object({
  imageUrl: z.string().describe('The URL of the image.'),
});
export type GeneratePoemFromImageInput = z.infer<typeof GeneratePoemFromImageInputSchema>;

const GeneratePoemFromImageOutputSchema = z.object({
  poem: z.string().describe('The generated poem.'),
});
export type GeneratePoemFromImageOutput = z.infer<typeof GeneratePoemFromImageOutputSchema>;

export async function generatePoemFromImage(input: GeneratePoemFromImageInput): Promise<GeneratePoemFromImageOutput> {
  return generatePoemFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePoemFromImagePrompt',
  input: {
    schema: z.object({
      imageUrl: z.string().describe('The URL of the image.'),
    }),
  },
  output: {
    schema: z.object({
      poem: z.string().describe('The generated poem.'),
    }),
  },
  prompt: `You are a poet who specializes in writing poems based on images.  Given the image, write a poem that captures the content and mood of the image.  The poem should be 4-8 lines long.\n\nImage: {{media url=imageUrl}}`,
});

const generatePoemFromImageFlow = ai.defineFlow<
  typeof GeneratePoemFromImageInputSchema,
  typeof GeneratePoemFromImageOutputSchema
>({
  name: 'generatePoemFromImageFlow',
  inputSchema: GeneratePoemFromImageInputSchema,
  outputSchema: GeneratePoemFromImageOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});
