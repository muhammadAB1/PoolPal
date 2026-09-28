import { withSupabase } from 'npm:@supabase/server'
import { generateText, Output } from 'npm:ai@^6'
import { openai } from 'npm:@ai-sdk/openai@^2'
import { z } from 'npm:zod@^3'

export default {
  fetch: withSupabase({ auth: 'user' }, async (req) => {
    if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 })

    const { target, imageBase64 } = await req.json()
    if (target !== 'filter' && target !== 'pump') return Response.json({ error: 'Bad target' }, { status: 400 })
    if (!imageBase64) return Response.json({ error: 'No photo' }, { status: 400 })

    const schema =
      target === 'filter'
        ? z.object({ value: z.enum(['Sand', 'Cartridge', 'DE']).nullable(), reason: z.string() })
        : z.object({ value: z.enum(['Single', 'Dual', 'Variable']).nullable(), reason: z.string() })

    const { output } = await generateText({
      model: openai('gpt-4o-mini'),
      output: Output.object({ schema }),
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: `Identify pool ${target}. value must be an allowed enum or null.` },
          { type: 'image', image: `data:image/jpeg;base64,${imageBase64}` },
        ],
      }],
    })
    return Response.json({ target, ...output })
  }),
}