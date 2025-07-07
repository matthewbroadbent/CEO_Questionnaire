#!/usr/bin/env node

import GoogleSheetsService from './googleSheetsService.js'
import SupabaseService from './supabaseService.js'

async function syncToSheets() {
  console.log('🚀 Starting Supabase to Google Sheets sync...\n')

  try {
    // Initialize services
    const sheetsService = new GoogleSheetsService()
    const supabaseService = new SupabaseService()

    // Authenticate with Google Sheets
    console.log('🔐 Authenticating with Google Sheets...')
    const authenticated = await sheetsService.authenticate()
    if (!authenticated) {
      console.error('❌ Failed to authenticate with Google Sheets')
      process.exit(1)
    }

    // Get all responses from Supabase
    console.log('📥 Fetching responses from Supabase...')
    const responses = await supabaseService.getAllResponses()
    
    if (responses.length === 0) {
      console.log('ℹ️ No responses found in Supabase')
      return
    }

    // Sync to Google Sheets
    console.log('📤 Syncing responses to Google Sheets...')
    const success = await sheetsService.appendResponses(responses)
    
    if (success) {
      console.log('\n✅ Sync completed successfully!')
      console.log(`📊 Processed ${responses.length} total responses`)
    } else {
      console.error('\n❌ Sync failed')
      process.exit(1)
    }

  } catch (error) {
    console.error('\n❌ Sync error:', error.message)
    process.exit(1)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  syncToSheets()
}

export default syncToSheets
