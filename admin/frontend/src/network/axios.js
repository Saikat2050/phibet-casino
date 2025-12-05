import axios from 'axios';
import { redirect } from 'react-router-dom';
import { getAccessToken, removeLoginToken } from './storageUtils';
import { MESSAGES, METHODS, filterEmptyPayload } from './networkUtils';
import { showToastr } from '../utils/helpers';

const axiosInstance = axios.create();

export const setupInterceptors = () => {
	// const role = getItem('role')

	axiosInstance.interceptors.response.use(
		(res) => res,
		(error) => {
			const { status } = error.response;
			if (status === 401 || status === 403) {
				removeLoginToken();
				redirect('/login');
			}
			if (status === 500) {
				return Promise.reject(error);
			}
			const errorCode =
				error.response?.data?.errors[0]?.fields?.description ||
				error.response?.data?.errors[0]?.description ||
				error.response?.data?.errors[0]?.name ||
				error.response?.data?.errors[0]?.description?.name;
			if (typeof errorCode === 'string') {
				showToastr({
					message: MESSAGES[errorCode] ? MESSAGES[errorCode] : errorCode,
					type: 'error',
				});
			}
			return Promise.reject(error);
		}
	);
};

const makeRequest = async (
	url,
	method,
	data = {},
	config = {},
	params = {}
) => {
	const headers = {
		'Content-Type': 'application/json',
		...config,
	};

	if (getAccessToken()) {
		headers.Authorization = `Bearer ${getAccessToken()}`;
	}

	return axiosInstance({
		url,
		method,
		data: filterEmptyPayload(data),
		headers,
		params: filterEmptyPayload(params),
	});
};

const getRequest = (url, params) =>
	makeRequest(url, METHODS.get, {}, {}, params);

const postRequest = (url, data, config) =>
	makeRequest(url, METHODS.post, data, config);

const putRequest = (url, data, config) =>
	makeRequest(url, METHODS.put, data, config);

const deleteRequest = (url, data) => makeRequest(url, METHODS.delete, data);

export { getRequest, postRequest, putRequest, deleteRequest };
