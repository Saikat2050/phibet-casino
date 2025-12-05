/* eslint-disable no-restricted-globals */
import * as Yup from 'yup';
import {
	dateTypeForValidation,
	FIELD_TYPES,
	getFieldType,
	maxFieldNum,
	operators,
} from './constants';

const isValueRequired = (operator, ...fieldTypes) =>
	fieldTypes.includes(getFieldType(operator));

const validateUniqueCombinations = (groups, context) => {
	if (!groups || groups.length === 0) return true;

	const seenCombinations = new Set();

	const hasDuplicate = groups.some((group) => {
		const uniquePairsInGroup = new Set();

		return (group.fields || []).some(({ field, operator }) => {
			const key = `${field}-${operator}`;
			if (uniquePairsInGroup.has(key)) return false;
			uniquePairsInGroup.add(key);
			if (seenCombinations.has(key)) {
				context.createError({
					path: context.path,
					message: `Duplicate field-operator combination "${field}-${operators[operator]}" across groups`,
				});
				return true;
			}
			seenCombinations.add(key);
			return false;
		});
	});

	return !hasDuplicate;
};

const fieldValidationSchema = Yup.object({
	field: Yup.string().required('Field is required'),
	operator: Yup.string()
		.required('Operator is required')
		.oneOf(Object.keys(operators), 'Invalid operator selected'),

	value1: Yup.mixed()
		.nullable()
		.test('value1-required', function (value) {
			const { operator } = this.parent;
			const isValue2Required = isValueRequired(operator, FIELD_TYPES.DOUBLE);
			const message = isValue2Required
				? 'Value1 is required'
				: 'Value is required';

			if (isValueRequired(operator, FIELD_TYPES.SINGLE, FIELD_TYPES.DOUBLE)) {
				return (
					(value !== null && value !== undefined && value !== '') ||
					this.createError({ message })
				);
			}
			return true;
		})
		.test('value1-valid', 'Invalid date or number', function (value) {
			const { field } = this.parent;
			if (field === 'kycStatus') {
				return true;
			}
			if (value === null || value === undefined || value === '') return true;

			const isDateField = dateTypeForValidation[field];
			if (isDateField) {
				const date = new Date(value);
				return !isNaN(date.getTime());
			}

			if (!isNaN(Number(value))) {
				return true;
			}

			return false;
		})
		.test('value1-no-decimals', 'Value must be a whole number', (value) => {
			if (value === null || value === undefined || value === '') return true;
			const numericValue = Number(value);
			if (isNaN(numericValue)) return true;
			return Number.isInteger(numericValue);
		})
		.test(
			`value1-less-than-${maxFieldNum}`,
			`Value must be less than or equal to ${maxFieldNum}`,
			function (value) {
				const { field } = this.parent;
				if (field === 'kycStatus') {
					return true;
				}
				if (dateTypeForValidation[field]) return true;

				const numericValue = Number(value);
				return (
					numericValue <= maxFieldNum ||
					this.createError({
						message: `Value must be less than or equal to ${maxFieldNum}`,
					})
				);
			}
		),
	value2: Yup.mixed()
		.nullable()
		.test('value2-required', 'Value2 is required', function (value) {
			const { operator } = this.parent;
			return isValueRequired(operator, FIELD_TYPES.DOUBLE) ? !!value : true;
		})
		.test(
			'value2-greater',
			'Value2 must be greater than Value1',
			function (value) {
				const { value1, field } = this.parent;

				if (value === null || value === undefined || value === '') return true;
				if (value1 === null || value1 === undefined || value1 === '')
					return true;
				const isDateField = dateTypeForValidation[field];
				if (isDateField) {
					const date1 = new Date(value1);
					const date2 = new Date(value);
					return date2 > date1;
				}

				const num1 = Number(value1);
				const num2 = Number(value);
				if (!isNaN(num1) && !isNaN(num2)) {
					return num2 > num1;
				}

				if (typeof value1 === 'string' && typeof value === 'string') {
					return value.localeCompare(value1) > 0;
				}

				if (typeof value1 === 'boolean' && typeof value === 'boolean') {
					return value1 === false && value === true;
				}

				return false;
			}
		)
		.test('value2-no-decimals', 'Value2 must be a whole number', (value) => {
			if (value === null || value === undefined || value === '') return true;
			const numericValue = Number(value);
			if (isNaN(numericValue)) return true;
			return Number.isInteger(numericValue);
		})
		.test(
			'value2-less-than-91',
			'Value2 must be less than or equal to 90',
			function (value) {
				const { field } = this.parent;
				if (dateTypeForValidation[field]) return true;

				const numericValue = Number(value);
				return (
					numericValue <= 90 ||
					this.createError({
						message: 'Value2 must be less than or equal to 90',
					})
				);
			}
		),
});

const validationSchema = Yup.object({
	name: Yup.string()
		.required('Segment name is required')
		.min(3, 'Segment Name must be at least 3 characters')
		.max(50, 'Segment cannot exceed 50 characters')
		.matches(
			/^[A-Za-z\s]+$/,
			'Segment name can only contain letters and spaces'
		)
		.test(
			'no-multiple-spaces',
			'Segment name cannot have multiple consecutive spaces',
			(value) => !/\s{2,}/.test(value)
		),

	comments: Yup.string()
		.required('Comment is required')
		.max(250, 'Comment cannot exceed 250 characters')
		.min(3, 'Comment must be at least 3 characters')
		.matches(
			/^(?=(?:.*[A-Za-z]){3,}).+$/,
			'Comment must contain at least 3 characters and can include numbers and spaces'
		)
		.test(
			'no-multiple-spaces',
			'Comment cannot have multiple consecutive spaces',
			(value) => !/\s{2,}/.test(value)
		),

	groups: Yup.array()
		.of(
			Yup.object({
				fields: Yup.array()
					.of(fieldValidationSchema)
					.min(1, 'At least one or condition is required'),
			})
		)
		.test(
			'unique-across-groups',
			'Duplicate field and operator combination across groups',
			function (groups) {
				return validateUniqueCombinations(groups, this);
			}
		)
		.min(1, 'At least one condition is required'),
});

const filterValues = () => ({
	fromDate: '',
	toDate: '',
});

const filterValidationSchema = () =>
	Yup.object({
		fromDate: Yup.string().nullable(),
		toDate: Yup.string().nullable(),
	});

const staticFiltersFields = () => [
	{
		name: 'ranges',
		fieldType: 'dateRangeSelector',
		label: '',
		placeholder: 'Date Range',
	},
];

export {
	validationSchema,
	filterValues,
	filterValidationSchema,
	staticFiltersFields,
};
