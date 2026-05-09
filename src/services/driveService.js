import { DRIVE_FOLDER_NAME, GOOGLE_SHEET_ID } from '../constants';

const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD = 'https://www.googleapis.com/upload/drive/v3';
const SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets';

/**
 * Get or create the NotePilot folder in Google Drive
 */
export const getOrCreateDriveFolder = async (token) => {
  // Search for existing folder
  const searchRes = await fetch(
    `${DRIVE_API}/files?q=name='${DRIVE_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false&fields=files(id,name)`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const searchData = await searchRes.json();

  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }

  // Create folder
  const createRes = await fetch(`${DRIVE_API}/files`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: DRIVE_FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
    }),
  });
  const createData = await createRes.json();
  return createData.id;
};

/**
 * List all files in the NotePilot folder
 */
export const listDriveFiles = async (token, folderId) => {
  const res = await fetch(
    `${DRIVE_API}/files?q='${folderId}' in parents and trashed=false&fields=files(id,name,modifiedTime)&orderBy=modifiedTime desc`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await res.json();
  return data.files || [];
};

/**
 * Read a file's content from Google Drive
 */
export const readDriveFile = async (token, fileId) => {
  const res = await fetch(`${DRIVE_API}/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.text();
};

/**
 * Create a new file in Google Drive
 */
export const createDriveFile = async (token, folderId, fileName, content) => {
  const metadata = { name: fileName.endsWith('.txt') ? fileName : `${fileName}.txt`, parents: [folderId] };
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('media', new Blob([content], { type: 'text/plain' }));

  const res = await fetch(`${DRIVE_UPLOAD}/files?uploadType=multipart&fields=id,name`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  return res.json();
};

/**
 * Update an existing file's content in Google Drive
 */
export const updateDriveFile = async (token, fileId, content) => {
  const res = await fetch(`${DRIVE_UPLOAD}/files/${fileId}?uploadType=media`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'text/plain',
    },
    body: content,
  });
  return res.json();
};

/**
 * Append a signup record to Google Sheets
 */
export const trackUserSignup = async (token, user) => {
  if (!GOOGLE_SHEET_ID) return;
  const row = [user.email, user.name, new Date().toISOString()];
  await fetch(`${SHEETS_API}/${GOOGLE_SHEET_ID}/values/Sheet1!A1:C1:append?valueInputOption=USER_ENTERED`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: [row] }),
  });
};

/**
 * Get user info from Google
 */
export const getGoogleUserInfo = async (token) => {
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};
