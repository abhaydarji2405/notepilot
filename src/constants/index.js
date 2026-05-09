// Google Drive folder name for all notes
export const DRIVE_FOLDER_NAME = 'notepilot.abhaydarji.com';

// Google API scopes
export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'profile',
  'email',
].join(' ');

// Google Sheets signup tracking
export const GOOGLE_SHEET_ID = process.env.REACT_APP_GOOGLE_SHEET_ID || '';

// Auto-save interval in milliseconds (2 minutes)
export const AUTO_SAVE_INTERVAL = 2 * 60 * 1000;

// LocalStorage keys
export const LS_THEME = 'notepilot_theme';
export const LS_TABS = 'notepilot_tabs';
export const LS_ACTIVE_TAB = 'notepilot_active_tab';
export const LS_FILE_PREFIX = 'notepilot_file_';
export const LS_USER = 'notepilot_user';
export const LS_DRIVE_TOKEN = 'notepilot_drive_token';

// My website
export const MY_WEBSITE = 'https://www.abhaydarji.com';
export const SITE_URL = 'https://notepilot.abhaydarji.com';
