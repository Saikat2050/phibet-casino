import { all, fork, put, takeLatest } from 'redux-saga/effects';
import {
	getAllTestimonialsSuccess,
	getAllTestimonialsFail,
	createTestimonialSuccess,
	createTestimonialFail,
	getTestimonialByIdSuccess,
	getTestimonialByIdFail,
	updateTestimonialSuccess,
	updateTestimonialFail,
	deleteTestimonialSuccess,
	deleteTestimonialFail,
	setLoading,
} from './actions';
import {
	GET_ALL_TESTIMONIALS,
	DELETE_TESTIMONIAL,
	CREATE_TESTIMONIAL_START,
	GET_TESTIMONIAL_BY_ID_START,
	UPDATE_TESTIMONIAL_START,
} from './actionTypes';
import {
	getAllTestimonials as getAllTestimonialsApi,
	getTestimonialById as getTestimonialByIdApi,
} from '../../network/getRequests';
import { createTestimonialRequest } from '../../network/postRequests';
import { updateTestimonial as updateTestimonialApi } from '../../network/putRequests';
import { deleteTestimonial as deleteTestimonialApi } from '../../network/deleteRequests';
import { showToastr } from '../../utils/helpers';

function* createTestimonialWorker(action) {
	try {
		yield put(setLoading(true));
		const { testimonialData, navigate } = action && action.payload;
		const { data } = yield createTestimonialRequest(testimonialData);
		const testimonialDataResponse =
			data?.data?.testimonial || data?.testimonial || data;
		yield put(createTestimonialSuccess(testimonialDataResponse));
		showToastr({
			message: 'Testimonial Created Successfully',
			type: 'success',
		});
		if (navigate) navigate('/testimonials');
	} catch (error) {
		yield put(
			createTestimonialFail(
				error?.response?.data?.errors[0]?.description ||
					'Error creating testimonial'
			)
		);
	}
}

function* getTestimonialByIdWorker(action) {
	try {
		const { data } = yield getTestimonialByIdApi(action.payload);
		const testimonialData = data?.data?.data || data?.data || data;
		yield put(getTestimonialByIdSuccess(testimonialData));
	} catch (error) {
		yield put(
			getTestimonialByIdFail(
				error?.response?.data?.errors[0]?.description ||
					'Error fetching testimonial'
			)
		);
	}
}

function* updateTestimonialWorker(action) {
	try {
		const { testimonialData, navigate } = action && action.payload;
		const { data } = yield updateTestimonialApi(testimonialData);
		yield put(updateTestimonialSuccess(data));
		showToastr({
			message: 'Testimonial Updated Successfully',
			type: 'success',
		});
		if (navigate) navigate('/testimonials');
	} catch (error) {
		yield put(
			updateTestimonialFail(
				error?.response?.data?.errors[0]?.description ||
					'Error updating testimonial'
			)
		);
	}
}

function* getTestimonials(action) {
	try {
		const { data } = yield getAllTestimonialsApi(action.payload);
		yield put(getAllTestimonialsSuccess(data?.data));
	} catch (error) {
		yield put(
			getAllTestimonialsFail(
				error?.response?.data?.errors?.[0]?.description ||
					'Error fetching testimonials'
			)
		);
	}
}

function* deleteTestimonialWorker(action) {
	try {
		const { testimonialId, callback } = action && action.payload;
		const { data } = yield deleteTestimonialApi({ id: testimonialId });
		yield put(deleteTestimonialSuccess(testimonialId));
		showToastr({
			message: data?.message || 'Testimonial Deleted Successfully',
			type: 'success',
		});

		if (callback) callback();
	} catch (error) {
		const errorMessage = 'Error deleting testimonial';
		yield put(deleteTestimonialFail(errorMessage));
		showToastr({
			message: errorMessage,
			type: 'error',
		});
	}
}

export function* watchTestimonialActions() {
	yield takeLatest(CREATE_TESTIMONIAL_START, createTestimonialWorker);
	yield takeLatest(GET_ALL_TESTIMONIALS, getTestimonials);
	yield takeLatest(GET_TESTIMONIAL_BY_ID_START, getTestimonialByIdWorker);
	yield takeLatest(UPDATE_TESTIMONIAL_START, updateTestimonialWorker);
	yield takeLatest(DELETE_TESTIMONIAL, deleteTestimonialWorker);
}

function* TestimonialSaga() {
	yield all([fork(watchTestimonialActions)]);
}

export default TestimonialSaga;
