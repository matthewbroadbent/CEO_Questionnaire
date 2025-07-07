import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

class SupabaseService {
  constructor() {
    const supabaseUrl = process.env.VITE_SUPABASE_URL
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials in environment variables')
    }

    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  async getAllResponses() {
    try {
      const { data, error } = await this.supabase
        .from('ceo_ai_responses')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      console.log(`✅ Retrieved ${data?.length || 0} responses from Supabase`)
      return data || []
    } catch (error) {
      console.error('❌ Failed to fetch responses from Supabase:', error.message)
      return []
    }
  }

  async getResponsesSince(timestamp) {
    try {
      const { data, error } = await this.supabase
        .from('ceo_ai_responses')
        .select('*')
        .gte('created_at', timestamp)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      console.log(`✅ Retrieved ${data?.length || 0} responses since ${timestamp}`)
      return data || []
    } catch (error) {
      console.error('❌ Failed to fetch recent responses:', error.message)
      return []
    }
  }

  async getResponseStats() {
    try {
      const { count, error } = await this.supabase
        .from('ceo_ai_responses')
        .select('*', { count: 'exact', head: true })

      if (error) {
        throw error
      }

      console.log(`📊 Total responses in database: ${count}`)
      return count || 0
    } catch (error) {
      console.error('❌ Failed to get response stats:', error.message)
      return 0
    }
  }
}

export default SupabaseService
