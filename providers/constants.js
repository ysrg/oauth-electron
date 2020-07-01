const OUTLOOK_AUTH_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize';
const OUTLOOK_CLIENT_ID = '173fe996-3a74-4d81-928c-7ac9d6f4994a';
const OUTLOOK_SCOPE = 'Mail.ReadWrite openId profile Mail.ReadWrite offline_access Contacts.ReadWrite';
const OUTLOOK_REDIRECT_URI = 'https://login.microsoftonline.com/common/oauth2/nativeclient';
const OUTLOOK_TOKEN_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
// const OUTLOOK_CLIENT_ID = ''

module.exports = {
	OUTLOOK_AUTH_URL,
	OUTLOOK_SCOPE,
	OUTLOOK_REDIRECT_URI,
	OUTLOOK_CLIENT_ID,
	OUTLOOK_TOKEN_URL
}