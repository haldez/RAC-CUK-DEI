// Google Apps Script for storing DEI Survey Responses in Google Sheets

// Spreadsheet ID - Update this with your Google Sheet ID after deployment
const SHEET_ID = 'YOUR_SPREADSHEET_ID'; // You'll get this after creating the sheet

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Main function to process form submissions
function processFormData(payload) {
  try {
    // Open the spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName('Responses') || spreadsheet.getSheets()[0];
    
    // Create headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp',
        'Full Name',
        'Rotaract ID',
        'Quiz Q1 (DEI Task Force)',
        'Quiz Q2 (Focus Area)',
        'Project Feedback',
        'Way Forward & Wants',
        'Join Committee?',
        'Email Status'
      ];
      sheet.appendRow(headers);
    }
    
    // Get current timestamp
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi' });
    
    // Append the response row
    const row = [
      timestamp,
      payload.user.name || '',
      payload.user.id || '',
      payload.answers.q1 || '',
      payload.answers.q2 || '',
      payload.feedback || '',
      payload.wayforward || '',
      payload.join || '',
      'Recorded'
    ];
    
    sheet.appendRow(row);
    
    return { 
      status: 'success', 
      message: 'Your response has been recorded successfully!',
      timestamp: timestamp
    };
  } catch (error) {
    return { 
      status: 'error', 
      message: 'Error saving response: ' + error.toString() 
    };
  }
}

// Optional: Function to get all responses (for dashboard/analytics)
function getAllResponses() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName('Responses') || spreadsheet.getSheets()[0];
    const data = sheet.getDataRange().getValues();
    
    return {
      status: 'success',
      totalResponses: data.length - 1, // Minus header row
      data: data
    };
  } catch (error) {
    return { 
      status: 'error', 
      message: 'Error retrieving responses: ' + error.toString() 
    };
  }
}

// Function to share the sheet (run this once to give yourself access)
function setupSheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.insertSheet('Responses');
    
    // Add headers
    const headers = [
      'Timestamp',
      'Full Name',
      'Rotaract ID',
      'Quiz Q1 (DEI Task Force)',
      'Quiz Q2 (Focus Area)',
      'Project Feedback',
      'Way Forward & Wants',
      'Join Committee?',
      'Email Status'
    ];
    sheet.appendRow(headers);
    
    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#00246B');
    headerRange.setFontColor('#FFFFFF');
    headerRange.setFontWeight('bold');
    
    return { status: 'success', message: 'Sheet setup complete!' };
  } catch (error) {
    return { status: 'error', message: error.toString() };
  }
}
