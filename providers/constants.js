// Outlook
const OUTLOOK_AUTH_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize';
const OUTLOOK_CLIENT_ID = '173fe996-3a74-4d81-928c-7ac9d6f4994a';
const OUTLOOK_SCOPE = 'Mail.ReadWrite openId profile Mail.ReadWrite offline_access Contacts.ReadWrite';
const OUTLOOK_REDIRECT_URI = 'https://login.microsoftonline.com/common/oauth2/nativeclient';
const OUTLOOK_TOKEN_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
const OUTLOOK_MSG_API = 'https://graph.microsoft.com/v1.0/me/messages';
const OUTLOOK_HOST_API = 'https://graph.microsoft.com/v1.0/me/messages';
//Google
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/auth';
const GOOGLE_CLIENT_ID = '143077785142-lkn7sndletv65m5d4ohglp4qh04n5n7d.apps.googleusercontent.com';
const GOOGLE_SCOPE = 'https://mail.google.com/ https://www.googleapis.com/auth/carddav profile';
const GOOGLE_REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob';
const GOOGLE_TOKEN_URL = 'https://www.googleapis.com/oauth2/v4/token';
const GOOGLE_MSG_API = 'https://www.googleapis.com/gmail/v1/users/me/messages';
const GOOGLE_HOST_API = 'https://graph.microsoft.com/v1.0/me/messages';
const GOOGLE_CLIENT_SECRET = 'ArZNoh8ePfdQ2a3Fcrs4IwV3';

module.exports = {
	OUTLOOK_AUTH_URL,
	OUTLOOK_SCOPE,
	OUTLOOK_REDIRECT_URI,
	OUTLOOK_CLIENT_ID,
	OUTLOOK_TOKEN_URL,
	OUTLOOK_MSG_API,
	OUTLOOK_HOST_API,
	GOOGLE_AUTH_URL,
	GOOGLE_CLIENT_ID,
	GOOGLE_SCOPE,
	GOOGLE_REDIRECT_URI,
	GOOGLE_TOKEN_URL,
	GOOGLE_MSG_API,
	GOOGLE_HOST_API,
	GOOGLE_CLIENT_SECRET
}