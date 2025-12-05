import CryptoJS from 'crypto-js';

const FE_ENCRYPTION_KEY =
	import.meta.env.VITE_APP_FE_ENCRYPTION_KEY || 'abcdef';

export const encryptCredentials = (data) => {
	if (!data) return '';
	return CryptoJS.AES.encrypt(data, FE_ENCRYPTION_KEY).toString();
};

export const decryptCredentials = (data) => {
	if (!data) return '';
	return CryptoJS.AES.decrypt(data, FE_ENCRYPTION_KEY).toString(
		CryptoJS.enc.Utf8
	);
};

export const setLoginToken = (token) =>
	window.localStorage.setItem('access-token', encryptCredentials(token));

export const getItem = (key) => window.localStorage.getItem(key);

export const setItem = (key, value) => window.localStorage.setItem(key, value);

export const removeItem = (key) => window.localStorage.removeItem(key);

export const getAccessToken = () => {
	if (window.localStorage.getItem('access-token'))
		return decryptCredentials(window.localStorage.getItem('access-token'));
	return '';
};

export const removeLoginToken = () => {
	window.localStorage.clear();
};
