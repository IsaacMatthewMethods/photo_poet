'use server';
/**
 * @fileOverview A flow to refine the tone of a poem.
 *
 * - refinePoemTone - A function that refines the tone of a poem.
 * - RefinePoemToneInput - The input type for the refinePoemTone function.
 * - RefinePoemToneOutput - The return type for the refinePoemTone function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const RefinePoemToneInputSchema = z.object({
  poem: z.string().describe('The poem to refine.'),
  tone: z.string().describe('The desired tone of the poem (e.g., humorous, serious, romantic).'),
});
export type RefinePoemToneInput = z.infer<typeof RefinePoemToneInputSchema>;

const RefinePoemToneOutputSchema = z.object({
  refinedPoem: z.string().describe('The refined poem with the specified tone.'),
});
export type RefinePoemToneOutput = z.infer<typeof RefinePoemToneOutputSchema>;

export async function refinePoemTone(input: RefinePoemToneInput): Promise<RefinePoemToneOutput> {
  return refinePoemToneFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refinePoemTonePrompt',
  input: {
    schema: z.object({
      poem: z.string().describe('The poem to refine.'),
      tone: z.string().describe('The desired tone of the poem (e.g., humorous, serious, romantic).'),
    }),
  },
  output: {
    schema: z.object({
      refinedPoem: z.string().describe('The refined poem with the specified tone.'),
    }),
  },
  prompt: `You are a skilled poet, adept at adjusting the tone of poems.

  Please refine the following poem to be more {{{tone}}}.

  Original Poem:
  {{{poem}}}

  Refined Poem:
  `,
});

const refinePoemToneFlow = ai.defineFlow<
  typeof RefinePoemToneInputSchema,
  typeof RefinePoemToneOutputSchema
>(
  {
    name: 'refinePoemToneFlow',
    inputSchema: RefinePoemToneInputSchema,
    outputSchema: RefinePoemToneOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      refinedPoem: output!.refinedPoem,
    };
  }
);
