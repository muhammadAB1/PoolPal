import { withSupabase } from '@supabase/server'
import { generateText, Output } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

const schema = {
  filter: z.object({ value: z.enum(['Sand', 'Cartridge', 'DE']).nullable(), reason: z.string() }),
  pump: z.object({ value: z.enum(['Single', 'Dual', 'Variable']).nullable(), reason: z.string() }),
}

export default {
  fetch: withSupabase({ auth: 'user' }, async (req, ctx) => {
    console.log('[identify-equipment] started')
    const { target, imageBase64 } = await req.json()
    console.log(target, imageBase64 ? 'has image' : 'no image')
    if ((target !== 'filter' && target !== 'pump') || !imageBase64) {
      return Response.json({ error: 'Bad request' }, { status: 400 })
    }

    const { data: profile } = await ctx.supabase.from('profiles').select('membership_tier').eq('id', ctx.userClaims?.id).maybeSingle()
    if (profile?.membership_tier !== 'premium'){
      console.log('premium required')
      return Response.json({ error: 'Premium required' }, { status: 403 })
    }

      console.log('sending request to openai')
    try {
      const { output } = await generateText({
        model: openai('gpt-5.2'),
        providerOptions: { openai: { reasoningEffort: 'none' } },
        output: Output.object({ schema: schema[target] }),
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: `Identify this pool ${target}. If the photo is unclear, set value to null and give a short reason.` },
            { type: 'image', image: `data:image/jpeg;base64,${imageBase64}` },
          ],
        }],
      })
      console.log('[identify-equipment] output', JSON.stringify(output))
      return Response.json({ target, ...output })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error('[identify-equipment]', message)
      return Response.json({ error: message }, { status: 500 })
    }
  }),
}
