import * as Yup from 'yup';

const getInitialValues = (columns) => {
	const initialCols = {};
	columns.forEach((col) => {
		initialCols[col.accessor] = true;
	});
	return initialCols;
};

const staticFormFields = (columns) =>
	columns
		.filter(({ Header }) => typeof Header === 'string')
		.map((col) => ({
			name: col.accessor,
			fieldType: 'switch',
			label: col.Header,
			isDisabled: col?.notHidable,
		}));

const validationSchema = () => Yup.object({});

export { getInitialValues, staticFormFields, validationSchema };
