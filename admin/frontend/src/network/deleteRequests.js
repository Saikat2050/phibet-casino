import { deleteRequest } from './axios';
import { MANAGEMENT } from './networkUtils';

const { VITE_APP_API_URL } = import.meta.env;
const API_NAMESPACE = '/api/v1';

const deleteFromGallery = (data) =>
	deleteRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CONTENT}gallery`,
		data
	);

const deleteEmailTemplate = (data) =>
	deleteRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CONTENT}email-template`,
		data
	);

const deleteRestrictedItems = (data) =>
	deleteRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.COUNTRY}restricted-items`,
		data
	);

const deleteBonus = (data) =>
	deleteRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.BONUS}bonus/delete`,
		data
	);

const deleteUserComment = (data) =>
	deleteRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PLAYER}player/comment`,
		data
	);

const deleteCmsRequest = (data) =>
	deleteRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CONTENT}page`,
		data
	);

const deleteCategory = (data) =>
	deleteRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CASINO}delete-category`,
		data
	);

const deleteTags = (data) =>
	deleteRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PLAYER}tag`,
		data
	);

const deletePackage = (data) =>
	deleteRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.STORE}delete-package`,
		data
	);

const deleteBanner = (data) =>
	deleteRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CONTENT}banner`,
		data
	);

const deleteSeoRoute = (data) =>
	deleteRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}/content-management/seo/page`,
		data
	);
const deleteSegmentationRequest = (data) =>
	deleteRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PLAYER}segment`,
		data
	);

const deleteTestimonial = (data) =>
	deleteRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CONTENT}testimonial`,
		data
	);

export {
	deleteFromGallery,
	deleteEmailTemplate,
	deleteRestrictedItems,
	deleteBonus,
	deleteUserComment,
	deleteCmsRequest,
	deleteCategory,
	deleteTags,
	deletePackage,
	deleteBanner,
	deleteSeoRoute,
	deleteSegmentationRequest,
	deleteTestimonial,
};
