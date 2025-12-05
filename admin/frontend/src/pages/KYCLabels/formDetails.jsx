/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import * as Yup from 'yup';

const getInitialValues = (defaultValue) => ({
	selectedLang: defaultValue?.selectedLang || '',
	required: defaultValue?.required || false,
	name: defaultValue?.name || {},
});

const validateName = (name) => {
	const MIN_NAME_LENGTH = 3;
	const MAX_NAME_LENGTH = 50;
	const validationObject = {};
	for (const file in name) {
		validationObject[file] = Yup.string()
			.required('Label Name is Required!')
			.min(
				MIN_NAME_LENGTH,
				`Label Name must be at least ${MIN_NAME_LENGTH} characters`
			)
			.max(
				MAX_NAME_LENGTH,
				`Label Name must be at most ${MAX_NAME_LENGTH} characters`
			)
			.nullable();
	}
	return Yup.object(validationObject);
};

const validationSchema = (name) =>
	Yup.object().shape({
		name: validateName(name),
	});

const staticFormFields = [
	{
		name: 'required',
		fieldType: 'switch',
		label: 'Required',
	},
];

export { validationSchema, getInitialValues, staticFormFields };
