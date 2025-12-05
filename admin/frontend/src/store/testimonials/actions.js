import {
  CREATE_TESTIMONIAL_START,
  CREATE_TESTIMONIAL_SUCCESS,
  CREATE_TESTIMONIAL_FAIL,
  GET_TESTIMONIAL_BY_ID_START,
  GET_TESTIMONIAL_BY_ID_SUCCESS,
  GET_TESTIMONIAL_BY_ID_FAIL,
  GET_ALL_TESTIMONIALS,
  GET_ALL_TESTIMONIALS_SUCCESS,
  GET_ALL_TESTIMONIALS_FAIL,
  RESET_ALL_TESTIMONIALS,
  RESET_TESTIMONIAL_BY_ID,
  UPDATE_TESTIMONIAL_STATUS,
  UPDATE_TESTIMONIAL_STATUS_SUCCESS,
  UPDATE_TESTIMONIAL_STATUS_FAIL,
  UPDATE_TESTIMONIAL_SUCCESS,
  UPDATE_TESTIMONIAL_FAIL,
  DELETE_TESTIMONIAL,
  DELETE_TESTIMONIAL_SUCCESS,
  DELETE_TESTIMONIAL_FAIL,
  SET_TESTIMONIALS,
  SET_LOADING,
  UPDATE_TESTIMONIAL_START,
} from './actionTypes';

export const createTestimonial = (payload) => ({
  type: CREATE_TESTIMONIAL_START,
  payload,
});

export const createTestimonialSuccess = (payload) => ({
  type: CREATE_TESTIMONIAL_SUCCESS,
  payload,
});

export const createTestimonialFail = (payload) => ({
  type: CREATE_TESTIMONIAL_FAIL,
  payload,
});

export const getTestimonialById = (payload) => ({
  type: GET_TESTIMONIAL_BY_ID_START,
  payload,
});

export const getTestimonialByIdSuccess = (payload) => ({
  type: GET_TESTIMONIAL_BY_ID_SUCCESS,
  payload,
});

export const getTestimonialByIdFail = (payload) => ({
  type: GET_TESTIMONIAL_BY_ID_FAIL,
  payload,
});

export const updateTestimonial = (payload) => ({
  type: UPDATE_TESTIMONIAL_START,
  payload,
});

export const updateTestimonialSuccess = (payload) => ({
  type: UPDATE_TESTIMONIAL_SUCCESS,
  payload,
});

export const updateTestimonialFail = (payload) => ({
  type: UPDATE_TESTIMONIAL_FAIL,
  payload,
});

export const getAllTestimonials = (payload) => ({
  type: GET_ALL_TESTIMONIALS,
  payload,
});

export const getAllTestimonialsSuccess = (payload) => ({
  type: GET_ALL_TESTIMONIALS_SUCCESS,
  payload,
});

export const getAllTestimonialsFail = (payload) => ({
  type: GET_ALL_TESTIMONIALS_FAIL,
  payload,
});

export const resetAllTestimonials = () => ({
  type: RESET_ALL_TESTIMONIALS,
});

export const resetTestimonialById = () => ({
  type: RESET_TESTIMONIAL_BY_ID,
});

export const updateTestimonialStatus = (payload) => ({
  type: UPDATE_TESTIMONIAL_STATUS,
  payload,
});

export const updateTestimonialStatusSuccess = (payload) => ({
  type: UPDATE_TESTIMONIAL_STATUS_SUCCESS,
  payload,
});

export const updateTestimonialStatusFail = (payload) => ({
  type: UPDATE_TESTIMONIAL_STATUS_FAIL,
  payload,
});

export const deleteTestimonial = (payload) => ({
  type: DELETE_TESTIMONIAL,
  payload,
});

export const deleteTestimonialSuccess = (payload) => ({
  type: DELETE_TESTIMONIAL_SUCCESS,
  payload,
});

export const deleteTestimonialFail = (payload) => ({
  type: DELETE_TESTIMONIAL_FAIL,
  payload,
});

export const setTestimonials = (payload) => ({
  type: SET_TESTIMONIALS,
  payload,
});

export const setLoading = (payload) => ({
  type: SET_LOADING,
  payload,
});