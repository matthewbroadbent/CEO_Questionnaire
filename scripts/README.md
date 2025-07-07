# Google Sheets Integration

This directory contains scripts for syncing Supabase data to Google Sheets.

## Scripts

- `setupSheets.js` - Initial setup of Google Sheets with headers and formatting
- `syncToSheets.js` - Sync all responses from Supabase to Google Sheets
- `googleSheetsService.js` - Google Sheets API service
- `supabaseService.js` - Supabase data fetching service

## Usage

1. Complete the Google setup steps (see main README)
2. Run initial setup: `pnpm run setup-sheets`
3. Sync data: `pnpm run sync-sheets`

## Environment Variables Required

```
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_SHEETS_SHEET_NAME=CEO_AI_Responses
```

## Features

- Automatic duplicate prevention
- Professional header formatting with Norivane branding
- Array data flattening (joins multiple selections with semicolons)
- Error handling and logging
- Incremental sync support
