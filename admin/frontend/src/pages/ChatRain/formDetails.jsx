import * as Yup from 'yup';

const generalStepInitialValues = ({ chatRainDetails }) => ({
	name: chatRainDetails?.name || '',
	prizeMoney: chatRainDetails?.prizeMoney || '',
	currency: chatRainDetails?.currency?.code || '',
	chatGroupId: chatRainDetails?.chatGroupId || null,
});

const generalStaticFormFields = () => [
	{
		name: 'name',
		fieldType: 'textField',
		type: '',
		label: 'Chat Rain Title',
		placeholder: 'Chat Rain Title',
	},
	{
		name: 'prizeMoney',
		fieldType: 'textField',
		type: '',
		label: 'Prize Money',
		placeholder: 'Prize Money',
	},
	{
		name: 'currency',
		fieldType: 'textField',
		type: 'text',
		label: 'Currency',
		placeholder: '         ',
	},
];

// Filters
const staticFiltersFields = () => [
	{
		name: 'search',
		fieldType: 'textField',
		type: 'search',
		label: '',
		placeholder: 'Search by title',
	},
];

const filterValues = () => ({
	search: '',
});

const filterValidationSchema = () =>
	Yup.object({
		search: Yup.string().nullable(),
	});

export {
	staticFiltersFields,
	filterValues,
	filterValidationSchema,
	generalStaticFormFields,
	generalStepInitialValues,
};
