import * as Yup from 'yup';

const SegmentSchema = Yup.object().shape({
	tag: Yup.string()
		.required('Segment is required!')
		.min(3, 'Minimum 3 Characters Required')
		.max(50, 'Maximum 50 Characters Allowed'),
});

const getSegmentInitialValues = (details) => ({
	tag: details?.tag ?? '',
	isActive: details?.isActive ?? false,
});

const staticFormFields = () => [
	{
		name: 'tag',
		fieldType: 'textField',
		label: 'Segment Name',
		placeholder: 'Enter Segment Name',
		isRequired: true,
	},
	{
		name: 'isActive',
		fieldType: 'toggle',
		label: 'is Active',
		isNewRow: true,
	},
];

export { SegmentSchema, staticFormFields, getSegmentInitialValues };
