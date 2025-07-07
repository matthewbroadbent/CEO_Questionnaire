import { google } from 'googleapis'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

class GoogleSheetsService {
  constructor() {
    this.auth = null
    this.sheets = null
    this.spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID
    this.sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || 'CEO_AI_Responses'
  }

  async authenticate() {
    try {
      const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n')
      const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL

      if (!privateKey || !clientEmail) {
        throw new Error('Missing Google Sheets credentials in environment variables')
      }

      this.auth = new google.auth.GoogleAuth({
        credentials: {
          private_key: privateKey,
          client_email: clientEmail,
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      })

      this.sheets = google.sheets({ version: 'v4', auth: this.auth })
      console.log('✅ Google Sheets authentication successful')
      return true
    } catch (error) {
      console.error('❌ Google Sheets authentication failed:', error.message)
      return false
    }
  }

  async createHeaderRow() {
    const headers = [
      'ID',
      'Timestamp',
      'Created At',
      'First Name',
      'Email',
      'AI Importance Rating',
      'AI Current Approach',
      'Initial AI Focus',
      'Initial AI Focus Other',
      'Has AI Strategy',
      'Strategy Prioritisation',
      'Strategy Prioritisation Other',
      'Hypothetical Impact',
      'Future Strategy Confidence',
      'IP Address'
    ]

    try {
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `${this.sheetName}!A1:O1`,
        valueInputOption: 'RAW',
        resource: {
          values: [headers]
        }
      })

      // Format header row
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        resource: {
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId: 0,
                  startRowIndex: 0,
                  endRowIndex: 1,
                  startColumnIndex: 0,
                  endColumnIndex: headers.length
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 0.04, green: 0.13, blue: 0.26 }, // Norivane dark blue
                    textFormat: {
                      foregroundColor: { red: 1, green: 1, blue: 1 },
                      bold: true
                    }
                  }
                },
                fields: 'userEnteredFormat(backgroundColor,textFormat)'
              }
            }
          ]
        }
      })

      console.log('✅ Header row created and formatted')
      return true
    } catch (error) {
      console.error('❌ Failed to create header row:', error.message)
      return false
    }
  }

  async getExistingIds() {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${this.sheetName}!A:A`
      })

      const values = response.data.values || []
      // Skip header row and extract IDs
      return values.slice(1).map(row => row[0]).filter(Boolean)
    } catch (error) {
      console.error('❌ Failed to get existing IDs:', error.message)
      return []
    }
  }

  formatResponseForSheets(response) {
    return [
      response.id || '',
      response.timestamp || '',
      response.created_at || '',
      response.first_name || '',
      response.email || '',
      response.ai_importance_rating || '',
      Array.isArray(response.ai_current_approach) 
        ? response.ai_current_approach.join('; ') 
        : response.ai_current_approach || '',
      Array.isArray(response.initial_ai_focus) 
        ? response.initial_ai_focus.join('; ') 
        : response.initial_ai_focus || '',
      response.initial_ai_focus_other || '',
      response.has_ai_strategy || '',
      Array.isArray(response.strategy_prioritisation) 
        ? response.strategy_prioritisation.join('; ') 
        : response.strategy_prioritisation || '',
      response.strategy_prioritisation_other || '',
      response.hypothetical_impact || '',
      response.future_strategy_confidence || '',
      response.ip_address || ''
    ]
  }

  async appendResponses(responses) {
    if (!responses || responses.length === 0) {
      console.log('ℹ️ No new responses to append')
      return true
    }

    try {
      // Get existing IDs to avoid duplicates
      const existingIds = await this.getExistingIds()
      
      // Filter out responses that already exist
      const newResponses = responses.filter(response => 
        !existingIds.includes(response.id)
      )

      if (newResponses.length === 0) {
        console.log('ℹ️ No new responses to add (all already exist)')
        return true
      }

      // Format responses for sheets
      const values = newResponses.map(response => this.formatResponseForSheets(response))

      // Append to sheet
      const result = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${this.sheetName}!A:O`,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: values
        }
      })

      console.log(`✅ Successfully added ${newResponses.length} new responses to Google Sheets`)
      console.log(`📊 Updated range: ${result.data.updates.updatedRange}`)
      return true
    } catch (error) {
      console.error('❌ Failed to append responses:', error.message)
      return false
    }
  }

  async createSheet() {
    try {
      // Check if sheet exists
      const spreadsheet = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId
      })

      const sheetExists = spreadsheet.data.sheets.some(
        sheet => sheet.properties.title === this.sheetName
      )

      if (!sheetExists) {
        // Create new sheet
        await this.sheets.spreadsheets.batchUpdate({
          spreadsheetId: this.spreadsheetId,
          resource: {
            requests: [
              {
                addSheet: {
                  properties: {
                    title: this.sheetName,
                    gridProperties: {
                      rowCount: 1000,
                      columnCount: 15
                    }
                  }
                }
              }
            ]
          }
        })
        console.log(`✅ Created new sheet: ${this.sheetName}`)
      }

      return true
    } catch (error) {
      console.error('❌ Failed to create sheet:', error.message)
      return false
    }
  }

  async setupSheet() {
    const authenticated = await this.authenticate()
    if (!authenticated) return false

    const sheetCreated = await this.createSheet()
    if (!sheetCreated) return false

    const headerCreated = await this.createHeaderRow()
    return headerCreated
  }
}

export default GoogleSheetsService
