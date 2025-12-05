import * as Yup from 'yup';
import { isEmpty } from 'lodash';
import {
	BONUS_KEY_RELATION,
	BONUS_TYPES,
	bonusTypes,
	daysOfWeek,
} from './constants';
import { IS_ACTIVE_TYPES } from '../CasinoTransactionsList/constants';

// const currentDate = moment().toDate();
// const nextDayDate = moment().add(1, 'days').toDate();

const formatBonusCurrency = (allCurrencies, bonusCurrencies) => {
	let currDetails = {};
	if (isEmpty(allCurrencies)) {
		return currDetails;
	}
	// try {
	if (bonusCurrencies?.length) {
		currDetails = bonusCurrencies?.reduce((acc, details) => {
			if (!allCurrencies[details.currencyId]?.code) return acc;
			return {
				...acc,
				[allCurrencies[details.currencyId]?.code]: {
					zeroOutThreshold: details?.zeroOutThreshold || 1,
					currencyId: details?.currencyId,
					currencyName: allCurrencies?.[details?.currencyId]?.name || '',
					amount: details?.amount || 0,
				},
			};
		}, {});
	} else {
		const { code, id, name } = Object.values(allCurrencies || {})[0];
		if (code && name && id) {
			currDetails = {
				[code]: {
					zeroOutThreshold: 1,
					currencyId: id,
					currencyName: name,
					amount: 0,
				},
			};
		}
	}
	return currDetails;
	// } catch (err) {
	// 	console.log('Error in tournament currency = ', err?.message);
	// 	return currDetails;
	// }
};

const getBonusInitialValues = (
	bonusDetails,
	SegmentInitialValue = [],
	allCurrencies = {}
) => {
	const validOnDays = bonusDetails?.validOnDays
		? daysOfWeek.map(({ value, id }) => {
				if (`${bonusDetails.validOnDays}`?.[id]) {
					return value;
				}
				return '';
		  })
		: [];

	const currencyDetails = formatBonusCurrency(
		allCurrencies,
		bonusDetails?.bonusCurrencies
	);

	const wageringTemplateId =
		bonusDetails?.[BONUS_KEY_RELATION[bonusDetails?.bonusType]]
			?.wageringTemplateId || '';
	const quantity =
		bonusDetails?.[BONUS_KEY_RELATION[bonusDetails?.bonusType]]
			?.freespinQuantity || null;
	const gameIds =
		bonusDetails?.[BONUS_KEY_RELATION[bonusDetails?.bonusType]]?.gameIds || [];
	const percentage =
		bonusDetails?.[BONUS_KEY_RELATION[bonusDetails?.bonusType]]?.percentage ||
		null;
	return {
		promotionTitle: bonusDetails?.promotionTitle?.EN || '',
		description: bonusDetails?.description?.EN || '',
		termAndCondition: bonusDetails?.termAndCondition?.EN || '',

		wageringTemplateId,
		percentage,
		// validFrom: new Date(bonusDetails?.validFrom || currentDate),
		// validTo: new Date(bonusDetails?.validTo || nextDayDate),
		bonusType: bonusDetails?.bonusType || BONUS_TYPES.JOINING,
		displayBonusType: bonusDetails?.bonusType
			? bonusTypes?.find(({ value }) => value === bonusDetails?.bonusType)
					?.label
			: 'JOINING BONUS',
		daysToClear: bonusDetails?.daysToClear || 1,
		quantity,
		isActive: bonusDetails ? !!bonusDetails?.isActive : true,
		visibleInPromotions: bonusDetails?.visibleInPromotions || false,
		validOnDays,
		// bonusImage: bonusDetails?.imageUrl || null,
		currencyDetails,
		gameIds,
		tagIds: SegmentInitialValue,
	};
};

const commonFields = (
	bonusDetails,
	handleBonusTypeChange = () => {},
	otherFields = []
) => [
	{
		name: 'promotionTitle',
		fieldType: 'textField',
		type: 'text',
		label: 'Bonus Title',
		placeholder: 'Bonus Title',
		isRequired: true,
		defaultValue: bonusDetails?.promotionTitle?.EN,
	},
	// {
	// 	name: 'bonusType',
	// 	fieldType: 'textField',
	// 	label: 'Bonus Type',
	// 	placeholder: 'Select Bonus type',
	// 	// optionList: bonusTypes.map(({ label, value, id }) => ({
	// 	// 	optionLabel: label,
	// 	// 	value,
	// 	// 	id,
	// 	// })),
	// 	isDisabled: bonusDetails?.bonusType,
	// 	callBack: handleBonusTypeChange,
	// 	isRequired: true,
	// },
	{
		name: 'displayBonusType',
		fieldType: 'textField',
		label: 'Bonus Type',
		// placeholder: 'Select Bonus type',
		// optionList: bonusTypes.map(({ label, value, id }) => ({
		// 	optionLabel: label,
		// 	value,
		// 	id,
		// })),
		isDisabled: true,
		callBack: handleBonusTypeChange,
		isRequired: true,
	},
	{
		name: 'percentage',
		fieldType: 'textField',
		type: 'number',
		label: 'Bonus Percentage',
		placeholder: 'Bonus Percentage',
		isRequired: true,
		isHidable: (form) =>
			form.bonusType === BONUS_TYPES.JOINING ||
			form.bonusType === BONUS_TYPES.AMOE_CODE ||
			form.bonusType === BONUS_TYPES.REFERRAL ||
			form.bonusType === BONUS_TYPES.DAILY,
	},
	// {
	// 	name: 'validFrom',
	// 	fieldType: 'dateRangeSelector',
	// 	label: 'Bonus Validity',
	// 	placeholder: 'Select Range',
	// 	minDate: new Date(),
	// 	maxDate: '',
	// 	rangeKeys: ['validFrom', 'validTo'],
	// 	isRequired: true,
	// 	isHidable: (form) =>
	// 		form.bonusType === BONUS_TYPES.JOINING ||
	// 		form.bonusType === BONUS_TYPES.REFERRAL ||
	// 		form.bonusType === BONUS_TYPES.POSTAL_CODE ||
	// 		form.bonusType === BONUS_TYPES.DAILY,
	// },
	...otherFields,
	{
		name: 'daysToClear',
		fieldType: 'textField',
		type: 'number',
		label: 'Days to Clear',
		placeholder: 'Days to Clear',
		isHidable: (form) =>
			form.bonusType === BONUS_TYPES.JOINING ||
			form.bonusType === BONUS_TYPES.REFERRAL ||
			form.bonusType === BONUS_TYPES.AMOE_CODE ||
			form.bonusType === BONUS_TYPES.DAILY,
	},
	{
		name: 'quantity',
		fieldType: 'textField',
		type: 'number',
		label: 'Quantity',
		placeholder: 'Enter quantity',
		isRequired: true,
		isHidable: (form) =>
			form.bonusType === BONUS_TYPES.JOINING ||
			form.bonusType === BONUS_TYPES.REFERRAL ||
			form.bonusType === BONUS_TYPES.AMOE_CODE ||
			form.bonusType === BONUS_TYPES.DAILY,
	},
	{
		name: 'isActive',
		fieldType: 'toggle',
		label: 'Active',
		isNewRow: true,
		tooltipAlignment: 'left',
		tooltipContent: 'If True Status is Active else Inactive',
		isHidable: (form) => form.bonusType === BONUS_TYPES.JOINING,
	},
	// {
	// 	name: 'visibleInPromotions',
	// 	fieldType: 'toggle',
	// 	label: 'Visible in Promotions',
	// 	tooltipAlignment: 'left',
	// 	tooltipContent: 'If true visible in promotions else not',
	// 	isHidable: (form) => form.bonusType === BONUS_TYPES.JOINING,
	// },
	// {
	// 	name: 'validOnDays',
	// 	fieldType: 'radioGroupMulti',
	// 	label: 'Valid On Days',
	// 	optionList: daysOfWeek.map(({ label, value, id }) => ({
	// 		optionLabel: label,
	// 		value,
	// 		id,
	// 	})),
	// 	dependsOn: 'visibleInPromotions',
	// 	fieldColOptions: { lg: 12 },
	// 	isNewRow: true,
	// 	isHidable: (form) => form.bonusType === BONUS_TYPES.JOINING,
	// 	isRequired: true,
	// },
	{
		name: 'description',
		fieldType: 'textEditor',
		type: '',
		label: 'Description',
		placeholder: 'Enter Description',
		isNewRow: true,
		fieldColOptions: { lg: 12 },
		defaultValue: bonusDetails?.description?.EN,
		// isRequired: true
	},
	{
		name: 'termAndCondition',
		fieldType: 'textEditor',
		type: '',
		label: 'Terms and Conditions',
		placeholder: 'Enter Terms and Conditions',
		isNewRow: true,
		fieldColOptions: { lg: 12 },
		defaultValue: bonusDetails?.termAndCondition?.EN,
		// isRequired: true
	},
	// {
	// 	name: 'bonusImage',
	// 	fieldType: 'file',
	// 	type: '',
	// 	label: 'Bonus Image',
	// 	placeholder: 'Select bonus image',
	// 	isNewRow: true,
	// 	showThumbnail: true,
	// 	isRequired: true,
	// },
];

// Filters
const staticFiltersFields = () => [
	{
		name: 'bonusType',
		fieldType: 'select',
		label: '',
		placeholder: 'Bonus type',
		optionList: bonusTypes.map(({ label, value, id }) => ({
			optionLabel: label,
			value,
			id,
		})),
	},
	// {
	// 	name: 'search',
	// 	fieldType: 'textField',
	// 	type: 'search',
	// 	label: '',
	// 	placeholder: 'Search by title and description',
	// },
	{
		name: 'isActive',
		fieldType: 'select',
		label: '',
		placeholder: 'Status',
		optionList: IS_ACTIVE_TYPES.map(({ id, label, value }) => ({
			id,
			optionLabel: label,
			value,
		})),
	},
];

const filterValues = () => ({
	isActive: null,
	search: '',
	bonusType: null,
});

const filterValidationSchema = () =>
	Yup.object({
		isActive: Yup.string().nullable(),
		search: Yup.string().nullable(),
		bonusType: Yup.string().nullable(),
	});

export {
	staticFiltersFields,
	filterValues,
	filterValidationSchema,
	getBonusInitialValues,
	commonFields,
	formatBonusCurrency,
};
