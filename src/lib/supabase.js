import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export async function GET() {
  try {
    const { data, error } = await supabase.from('your_table').select('*')
    
    if (error) throw error
    
    return Response.json({ data })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}