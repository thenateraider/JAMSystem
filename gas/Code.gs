const SHEET_NAME = 'Applicants';

/**
 * Handles GET requests to fetch all applicants
 */
function doGet(e) {
  return handleResponse(() => {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error("Sheet 'Applicants' not found.");

    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return { status: 'success', data: [] }; // Empty or just headers

    const headers = data[0];
    const rows = data.slice(1);
    
    // Map array to object based on headers
    const result = rows.map(row => {
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i];
      });
      return obj;
    });
    
    // Sort by created_at descending (newest first)
    result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return { status: 'success', data: result };
  });
}

/**
 * Handles POST requests (Create, Update, Delete)
 */
function doPost(e) {
  return handleResponse(() => {
    if (!e.postData || !e.postData.contents) {
      throw new Error('No POST data received');
    }

    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;
    
    if (action === 'create') {
      return createApplicant(payload.data);
    } else if (action === 'update') {
      return updateApplicant(payload.data);
    } else if (action === 'delete') {
      return deleteApplicant(payload.id);
    }
    
    throw new Error('Invalid action provided. Use create, update, or delete.');
  });
}

/**
 * Global response handler to catch errors and return JSON
 */
function handleResponse(callback) {
  try {
    const result = callback();
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Creates a new applicant in the sheet
 */
function createApplicant(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  
  // Validate for duplicates
  checkDuplicates(sheet, data);
  
  const newId = generateNextId(sheet);
  const now = new Date().toISOString();
  
  const headers = sheet.getDataRange().getValues()[0];
  
  const newRow = headers.map(header => {
    if (header === 'id') return newId;
    if (header === 'created_at' || header === 'updated_at') return now;
    if (header === 'status' && !data.status) return 'Applied';
    if (header === 'phone' && data.phone) return "'" + data.phone; // Force plain text
    return data[header] || '';
  });
  
  sheet.appendRow(newRow);
  
  return { status: 'success', data: { ...data, id: newId, created_at: now, updated_at: now, status: data.status || 'Applied' } };
}

/**
 * Updates an existing applicant in the sheet
 */
function updateApplicant(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const sheetData = sheet.getDataRange().getValues();
  const headers = sheetData[0];
  
  const idIdx = headers.indexOf('id');
  let targetRowIndex = -1;
  
  // Find the row
  for (let i = 1; i < sheetData.length; i++) {
    if (sheetData[i][idIdx] === data.id) {
      targetRowIndex = i + 1; // +1 because sheet rows are 1-indexed
      break;
    }
  }
  
  if (targetRowIndex === -1) throw new Error("Applicant not found.");
  
  // Validate duplicates ignoring self
  checkDuplicates(sheet, data, data.id);
  
  const now = new Date().toISOString();
  data.updated_at = now;
  
  // Update cells dynamically based on headers
  Object.keys(data).forEach(key => {
    if (key === 'id' || key === 'created_at') return; // Don't overwrite id or created_at
    const colIdx = headers.indexOf(key);
    if (colIdx !== -1) {
      let val = data[key];
      if (key === 'phone' && val) val = "'" + val; // Force plain text
      sheet.getRange(targetRowIndex, colIdx + 1).setValue(val);
    }
  });
  
  return { status: 'success', data: data };
}

/**
 * Deletes an applicant from the sheet
 */
function deleteApplicant(id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const sheetData = sheet.getDataRange().getValues();
  const idIdx = sheetData[0].indexOf('id');
  
  for (let i = 1; i < sheetData.length; i++) {
    if (sheetData[i][idIdx] === id) {
      sheet.deleteRow(i + 1);
      return { status: 'success', message: 'Applicant deleted successfully.' };
    }
  }
  
  throw new Error("Applicant not found.");
}

/**
 * Validates against duplicate Email, Phone, and Exact Name+Title
 */
function checkDuplicates(sheet, newApp, excludeId = null) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return; // No data yet
  
  const headers = data[0];
  const idIdx = headers.indexOf('id');
  const emailIdx = headers.indexOf('email');
  const phoneIdx = headers.indexOf('phone');
  const titleIdx = headers.indexOf('title');
  const nameIdx = headers.indexOf('name');
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (excludeId && row[idIdx] === excludeId) continue;
    
    if (emailIdx !== -1 && row[emailIdx] === newApp.email) throw new Error("This Email is already registered.");
    if (phoneIdx !== -1 && row[phoneIdx] === newApp.phone) throw new Error("This phone number is already registered.");
    
    if (titleIdx !== -1 && nameIdx !== -1) {
      const rowFullName = `${row[titleIdx]} ${row[nameIdx]}`.toLowerCase();
      const newFullName = `${newApp.title} ${newApp.name}`.toLowerCase();
      if (rowFullName === newFullName) throw new Error("This exact name and title is already registered.");
    }
  }
}

/**
 * Generates next sequential ID (e.g., A0001)
 */
function generateNextId(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return 'A0001';
  
  const idIdx = data[0].indexOf('id');
  if (idIdx === -1) throw new Error("Column 'id' not found in sheet.");
  
  let maxNum = 0;
  
  for (let i = 1; i < data.length; i++) {
    const idStr = data[i][idIdx];
    if (idStr && idStr.toString().startsWith('A')) {
      const num = parseInt(idStr.toString().substring(1), 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    }
  }
  
  return 'A' + String(maxNum + 1).padStart(4, '0');
}
