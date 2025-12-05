import {
	GET_ALL_TESTIMONIALS_SUCCESS,
	GET_ALL_TESTIMONIALS_FAIL,
	GET_TESTIMONIAL_BY_ID_SUCCESS,
	GET_TESTIMONIAL_BY_ID_FAIL,
	CREATE_TESTIMONIAL_SUCCESS,
	CREATE_TESTIMONIAL_FAIL,
	UPDATE_TESTIMONIAL_SUCCESS,
	UPDATE_TESTIMONIAL_FAIL,
	DELETE_TESTIMONIAL_SUCCESS,
	DELETE_TESTIMONIAL_FAIL,
	RESET_ALL_TESTIMONIALS,
	RESET_TESTIMONIAL_BY_ID,
	SET_TESTIMONIALS,
	SET_LOADING,
	CREATE_TESTIMONIAL_START,
	GET_TESTIMONIAL_BY_ID_START,
	UPDATE_TESTIMONIAL_START,
	GET_ALL_TESTIMONIALS,
} from './actionTypes';

const initialState = {
	testimonials: { data: [], total: 0 },
	categories: [],
	isLoading: false,
	error: null,
	testimonialById: null,
	testimonialByIdLoading: false,
	updateTestimonialLoading: false,
};

// eslint-disable-next-line default-param-last
const testimonialsReducer = (state = initialState, action) => {
	switch (action.type) {
		case CREATE_TESTIMONIAL_START:
			return {
				...state,
				isLoading: true,
				error: null,
			};

		case CREATE_TESTIMONIAL_SUCCESS:
			return {
				...state,
				isLoading: false,
				error: null,
			};

		case CREATE_TESTIMONIAL_FAIL:
			return {
				...state,
				error: action.payload,
				isLoading: false,
			};

		case GET_TESTIMONIAL_BY_ID_START:
			return {
				...state,
				testimonialById: action.payload,
				testimonialByIdLoading: true,
				error: null,
			};

		case GET_TESTIMONIAL_BY_ID_SUCCESS:
			return {
				...state,
				testimonialById: action.payload,
				testimonialByIdLoading: false,
				error: null,
			};

		case GET_TESTIMONIAL_BY_ID_FAIL:
			return {
				...state,
				error: action.payload,
				testimonialByIdLoading: false,
			};

		case UPDATE_TESTIMONIAL_START:
			return {
				...state,
				updateTestimonialLoading: true,
			};

		case UPDATE_TESTIMONIAL_SUCCESS:
			return {
				...state,
				updateTestimonialLoading: false,
				error: null,
			};

		case UPDATE_TESTIMONIAL_FAIL:
			return {
				...state,
				error: action.payload,
				updateTestimonialLoading: false,
			};

		case GET_ALL_TESTIMONIALS:
			return {
				...state,
				isLoading: true,
				error: null,
			};

		case GET_ALL_TESTIMONIALS_SUCCESS:
			return {
				...state,
				testimonials: action.payload,
				isLoading: false,
				error: null,
			};

		case GET_ALL_TESTIMONIALS_FAIL:
			return {
				...state,
				error: action.payload,
				isLoading: false,
			};

		case DELETE_TESTIMONIAL_SUCCESS:
			return {
				...state,
				testimonials: {
					data: {
						rows: state.testimonials.data.rows.filter(
							(item) => item.id !== action.payload
						),
						count: state.testimonials.data.count - 1,
					},
				},
				isLoading: false,
				error: null,
			};

		case DELETE_TESTIMONIAL_FAIL:
			return {
				...state,
				error: action.payload,
				isLoading: false,
			};

		case RESET_ALL_TESTIMONIALS:
			return {
				...state,
				testimonials: { data: [], total: 0 },
				error: null,
			};

		case RESET_TESTIMONIAL_BY_ID:
			return {
				...state,
				testimonialById: null,
				error: null,
			};

		case SET_TESTIMONIALS:
			return {
				...state,
				testimonials: {
					data: action.payload,
					total: action.payload.length,
				},
				isLoading: false,
				error: null,
			};

		case SET_LOADING:
			return {
				...state,
				isLoading: action.payload,
			};

		default:
			return state;
	}
};

export default testimonialsReducer;
