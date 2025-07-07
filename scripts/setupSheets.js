#!/usr/bin/env node

import GoogleSheetsService from './googleSheetsService.js'

async function setupSheets() {
  console.log('🚀 Setting up Google Sheets integration...\n')

  try {
    const sheetsService = new GoogleSheetsService()
    
    console.log('📋 Creating sheet and headers...')
    const success = await sheetsService.setupSheet()
    
    if (success) {
      console.log('\n✅ Google Sheets setup completed successfully!')
      console.log(`📊 Sheet "${sheetsService.sheetName}" is ready for data`)
      console.log('\n🔄 You can now run: pnpm run sync-sheets')
    } else {
      console.error('\n❌ Setup failed')
      process.exit(1)
    }

  } catch (error) {
    console.error('\n❌ Setup error:', error.message)
    process.exit(1)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupSheets()
}

export default setupSheets
