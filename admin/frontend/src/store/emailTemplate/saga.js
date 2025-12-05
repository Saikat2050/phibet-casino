/* eslint-disable eqeqeq */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
import { put, takeLatest, all, fork, select } from 'redux-saga/effects';

// Crypto Redux States
import { cloneDeep } from 'lodash';
import {
	getAllEmailTemplatesSuccess,
	getAllEmailTemplatesFail,
	getImageGallerySuccess,
	getImageGalleryFail,
	uploadImageGallerySuccess,
	uploadImageGalleryFail,
	getImageGallery,
	deleteImageGallerySuccess,
	deleteImageGalleryFail,
	getDynamicKeysSuccess,
	getDynamicKeysFail,
	getEmailTypesSuccess,
	getEmailTypesFail,
	testEmailTemplateSuccess,
	testEmailTemplateFail,
	createEmailTemplateSuccess,
	createEmailTemplateFail,
	getEmailTemplateSuccess,
	getEmailTemplateFail,
	updateEmailTemplateSuccess,
	updateEmailTemplateFail,
	deleteEmailTemplateSuccess,
	deleteEmailTemplateFail,
	// makeEmailTemplatePrimarySuccess,
	makeEmailTemplatePrimaryFail,
	makeEmailTemplatePrimarySuccess,
} from './actions';

import {
	GET_ALL_EMAIL_TEMPLATES,
	GET_IMAGE_GALLERY,
	UPLOAD_IMAGE_GALLERY,
	DELETE_IMAGE_GALLERY,
	GET_DYNAMIC_KEYS,
	GET_EMAIL_TYPES,
	TEST_EMAIL_TEMPLATE,
	CREATE_EMAIL_TEMPLATE,
	GET_EMAIL_TEMPLATE,
	UPDATE_EMAIL_TEMPLATE,
	DELETE_EMAIL_TEMPLATE,
	MAKE_EMAIL_TEMPLATE_PRIMARY,
} from './actionTypes';

import {
	getEmailTemplates,
	getImageGalleryData,
	getEmailTypes,
	getEmailTemplate,
} from '../../network/getRequests';

import {
	testEmailTemplateEndPoint,
	createEmailTemplate,
	uploadGallery,
	primaryEmailTemplate,
} from '../../network/postRequests';

import {
	deleteFromGallery,
	deleteEmailTemplate,
} from '../../network/deleteRequests';
import { showToastr } from '../../utils/helpers';
import { objectToFormData } from '../../utils/objectToFormdata';
import { emailDynamicOptions } from '../../pages/EmailTemplate/Constant';
import { formPageTitle } from '../../components/Common/constants';
import { updateEmailTemplate } from '../../network/putRequests';

function* getAllEmailTemplatesWorker() {
	try {
		const { data } = yield getEmailTemplates();
		yield put(getAllEmailTemplatesSuccess(data?.data));
	} catch (e) {
		yield put(
			getAllEmailTemplatesFail(e?.response?.data?.errors[0]?.description)
		);
	}
}

function* getImageGalleryWorker() {
	try {
		const { data } = yield getImageGalleryData();
		const gallery =
			typeof data?.data?.gallery == 'string'
				? JSON.parse(data?.data?.gallery)
				: data?.data?.gallery;
		yield put(getImageGallerySuccess(gallery));
	} catch (e) {
		yield put(getImageGalleryFail());
	}
}

function* uploadImageGalleryWorker(action) {
	try {
		const data = action && action.payload;
		const formData = objectToFormData(data);
		yield uploadGallery(formData);
		yield put(uploadImageGallerySuccess());

		showToastr({
			message: 'Image uploaded successfully',
			type: 'success',
		});
		yield put(getImageGallery());
	} catch (e) {
		yield put(
			uploadImageGalleryFail(e?.response?.data?.errors[0]?.description)
		);
	}
}

function* deleteFromGalleryWorker(action) {
	try {
		const data = action && action.payload;
		yield deleteFromGallery(data);
		yield put(deleteImageGallerySuccess());
		showToastr({
			message: 'Image deleted successfully',
			type: 'success',
		});
		yield put(getImageGallery());
	} catch (e) {
		yield put(deleteImageGalleryFail());
	}
}

function* getDynamicKeysWorker(action) {
	try {
		const { type, emailTypes } = action && action.payload;
		const data = yield emailDynamicOptions({ type, emailTypes });
		yield put(getDynamicKeysSuccess(data));
	} catch (e) {
		yield put(getDynamicKeysFail());
	}
}

function* getEmailTypesWorker() {
	try {
		const { data } = yield getEmailTypes();
		yield put(getEmailTypesSuccess(data?.data));
	} catch (e) {
		yield put(getEmailTypesFail());
	}
}

function* testEmailTemplateWorker(action) {
	try {
		const { data, setIsTestTemplateModalVisible, setTestEmail } =
			action && action.payload;

		const res = yield testEmailTemplateEndPoint(data);

		yield put(testEmailTemplateSuccess());
		setIsTestTemplateModalVisible(false);
		setTestEmail('');
		res?.data?.data?.emailSent?.success
			? showToastr({
					message: 'Email Sent Successfully',
					type: 'success',
			  })
			: showToastr({
					message: 'Email Sending Unsuccessful',
					type: 'error',
			  });
	} catch (e) {
		yield put(testEmailTemplateFail());
	}
}

function* createEmailTemplateWorker(action) {
	try {
		const { data, navigate } = action && action.payload;
		yield createEmailTemplate(data);

		showToastr({
			message: 'Template Created Successfully',
			type: 'success',
		});

		window.localStorage.removeItem(formPageTitle.crm);

		yield put(createEmailTemplateSuccess());
		if (navigate) {
			navigate('/email-templates');
		}
	} catch (e) {
		yield put(createEmailTemplateFail());
	}
}

function* getemailTemplateWorker(action) {
	try {
		const emailTemplateId = action && action.payload;

		const { data } = yield getEmailTemplate(emailTemplateId);

		yield put(getEmailTemplateSuccess(data?.data));
	} catch (e) {
		yield put(getEmailTemplateFail());
	}
}

function* updateEmailTemplateWorker(action) {
	try {
		const { data, navigate } = action && action.payload;
		yield updateEmailTemplate(data);

		showToastr({
			message: 'Template Updated Successfully',
			type: 'success',
		});

		yield put(updateEmailTemplateSuccess());

		if (navigate) {
			navigate('/email-templates');
		}
	} catch (e) {
		yield put(updateEmailTemplateFail());
	}
}

function* deleteTemplateWorker(action) {
	try {
		const data = action && action.payload;
		const { eventType } = data;
		delete data.eventType;

		yield deleteEmailTemplate(data);

		let emailTemp = yield select((state) => state.EmailTemplate.emailTemplates);

		emailTemp = {
			...emailTemp,
			[eventType]: emailTemp[eventType].filter(
				(temp) => temp.id != data.emailTemplateId
			),
		};

		yield put(makeEmailTemplatePrimarySuccess(cloneDeep(emailTemp)));

		yield put(deleteEmailTemplateSuccess());

		showToastr({
			message: 'Template Deleted Successfully',
			type: 'success',
		});
	} catch (e) {
		yield put(deleteEmailTemplateFail());
	}
}

function* primaryEmailTemplateWorker(action) {
	try {
		const { data } = action && action.payload;
		const { eventType } = data;
		delete data.eventType;
		yield primaryEmailTemplate(data);

		const emailTemp = yield select(
			(state) => state.EmailTemplate.emailTemplates
		);

		emailTemp[eventType].forEach((temp) => {
			if (temp.id == data.emailTemplateId) {
				temp.isDefault = true;
			} else {
				temp.isDefault = false;
			}
		});

		yield put(makeEmailTemplatePrimarySuccess(cloneDeep(emailTemp)));

		showToastr({
			message: 'Template Updated Successfully',
			type: 'success',
		});
	} catch (e) {
		yield put(makeEmailTemplatePrimaryFail());
	}
}

export function* getEmailTemplateWatcher() {
	yield takeLatest(GET_ALL_EMAIL_TEMPLATES, getAllEmailTemplatesWorker);
	yield takeLatest(GET_IMAGE_GALLERY, getImageGalleryWorker);
	yield takeLatest(UPLOAD_IMAGE_GALLERY, uploadImageGalleryWorker);
	yield takeLatest(DELETE_IMAGE_GALLERY, deleteFromGalleryWorker);
	yield takeLatest(GET_DYNAMIC_KEYS, getDynamicKeysWorker);
	yield takeLatest(GET_EMAIL_TYPES, getEmailTypesWorker);
	yield takeLatest(TEST_EMAIL_TEMPLATE, testEmailTemplateWorker);
	yield takeLatest(CREATE_EMAIL_TEMPLATE, createEmailTemplateWorker);
	yield takeLatest(GET_EMAIL_TEMPLATE, getemailTemplateWorker);
	yield takeLatest(UPDATE_EMAIL_TEMPLATE, updateEmailTemplateWorker);
	yield takeLatest(DELETE_EMAIL_TEMPLATE, deleteTemplateWorker);
	yield takeLatest(MAKE_EMAIL_TEMPLATE_PRIMARY, primaryEmailTemplateWorker);
}

function* EmailTemplateSaga() {
	yield all([fork(getEmailTemplateWatcher)]);
}

export default EmailTemplateSaga;
