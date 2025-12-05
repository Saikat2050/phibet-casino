import * as Yup from 'yup';

const IS_ACTIVE_TYPES = [
  { id: '1', label: 'Active', value: true },
  { id: '2', label: 'In Active', value: false },
];

const staticFiltersFields = () => [
  {
    name: 'isActive',
    fieldType: 'select',
    label: '',
    placeholder: 'Status',
    optionList: IS_ACTIVE_TYPES?.map(({ id, label, value }) => ({
      id,
      optionLabel: label,
      value,
    })),
  },
];

const filterValues = () => ({
	isActive: null,
	searchString: '',
	orderBy: '',
	order: '',
});

const filterValidationSchema = () =>
	Yup.object({
		isActive: Yup.string().nullable(),
		searchString: Yup.string().nullable(),
	});

const getInitialValues = (testimonialData) => ({
  author: testimonialData?.author || '',
  content: testimonialData?.content || testimonialData?.quote || testimonialData?.title || '',
  isActive: testimonialData ? !!testimonialData?.isActive : true,
  rating: testimonialData?.rating || ''
});

const createTestimonialSchema = () =>
  Yup.object().shape({
    author: Yup.string()
      .required('Author is required')
      .max(100, 'Author must be less than 100 characters'),
    content: Yup.string()
      .required('Content is required')
      .max(500, 'Content must be less than 500 characters'),
    rating: Yup.number()
      .max(1, 'Rating must be greater than or equal to 1')
      .max(5, 'Rating must be less than or equal to 5')
      .required('Rating is required')
  });

const staticFormFields = (isView) => [
  {
    name: 'author',
    label: 'Enter Author',
    fieldType: 'textField',
    placeholder: 'Enter Author',
    isDisabled: isView || false,
    fieldColOptions: { lg: 4 },
    containerClass: 'mt-4',
    isRequired: true,
  },
  {
    name: 'rating',
    label: 'Enter Rating',
    fieldType: 'textField',
    type: 'number',
    placeholder: 'Enter Rating',
    isDisabled: isView || false,
    fieldColOptions: { lg: 4 },
    containerClass: 'mt-4',
    isRequired: true,
  },
  {
    name: 'isActive',
    fieldType: 'toggle',
    label: 'Status',
    placeholder: 'Status',
    isDisabled: isView || false,
    fieldColOptions: { lg: 2 },
    switchSizeClass:
      'd-flex justify-content-between form-switch-md px-0 pt-2 mt-4',
  },
  {
    name: 'content',
    label: 'Enter Quote',
    fieldType: 'textField',
    placeholder: 'Enter Quote',
    isDisabled: isView || false,
    fieldColOptions: { lg: 6 },
    containerClass: 'mt-4',
    isRequired: true,
    rows: 4,
  },
];

export {
  staticFiltersFields,
  filterValues,
  filterValidationSchema,
  getInitialValues,
  createTestimonialSchema,
  staticFormFields,
};
