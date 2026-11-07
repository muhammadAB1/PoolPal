import { withSupabase } from 'npm:@supabase/server'
import { generateText, Output } from 'npm:ai@^6'
import { openai } from 'npm:@ai-sdk/openai@^2'
import { z } from 'npm:zod@^3'

export default {
  fetch: withSupabase({ auth: 'user' }, async (req, ctx) => {
    if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 })
    const { data: p } = await ctx.supabase.from('profiles').select('membership_tier').eq('id', ctx.userClaims?.id).maybeSingle()
    if (p?.membership_tier !== 'premium') return Response.json({ error: 'Premium required' }, { status: 403 })

    const { target, imageBase64 } = await req.json()
    if (target !== 'filter' && target !== 'pump') return Response.json({ error: 'Bad target' }, { status: 400 })
    if (!imageBase64) return Response.json({ error: 'No photo' }, { status: 400 })

    const schema =
      target === 'filter'
        ? z.object({ value: z.enum(['Sand', 'Cartridge', 'DE']).nullable(), reason: z.string() })
        : z.object({ value: z.enum(['Single', 'Dual', 'Variable']).nullable(), reason: z.string() })

    const guide = target === 'filter'
      ? `Identify the pool FILTER. Match the photo to one type:
Sand: large round tank, often with a multiport valve on top or the side (Filter, Backwash, Rinse, Waste). Looks bulky, usually a pressure gauge, no clamp-lid cartridge inside.
Cartridge: taller tank with a clamp or band lid on top, no backwash valve. Inside is a removable pleated cartridge. Cleaner, simpler plumbing.
DE (diatomaceous earth): large tank similar to sand, often a backwash setting, label or sticker saying DE / diatomaceous earth, or a grid pack. Uses DE powder after cleaning.
Allowed values: Sand, Cartridge, DE.`
      : `Identify the pool PUMP. Match the photo to one type:
Single: one constant speed. No digital screen. Simple on/off switch or timer only.
Dual: two speeds (high/low). Dial, Hi/Lo switch, or small panel to pick high or low.
Variable: digital display or keypad with many speed/RPM settings. Advanced control panel on the motor.
Allowed values: Single, Dual, Variable.`

    const { output } = await generateText({
      model: openai('gpt-4o-mini'),
      output: Output.object({ schema }),
      system: `${guide}
If the photo is blurry, dark, cropped, not pool equipment, or you cannot tell the type with confidence, set value to null and set reason to a short request for a clearer, well-lit photo of the whole ${target} (tank and valves for a filter; motor and control panel for a pump).
If you can tell the type, set value to that enum and a short reason.`,
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: `Identify this pool ${target}.` },
          { type: 'image', image: `data:image/jpeg;base64,${imageBase64}` },
        ],
      }],
    })
    return Response.json({ target, ...output })
  }),
}