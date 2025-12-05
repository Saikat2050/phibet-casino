/* eslint-disable eqeqeq */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import {
	filterValidationSchema,
	filterValues,
	staticFiltersFields,
} from '../formDetails';
import useForm from '../../../components/Common/Hooks/useFormModal';
import {
	// fetchCurrenciesStart,
	fetchTransactionBankingStart,
	getAllTags,
} from '../../../store/actions';
import { itemsPerPage } from '../../../constants/config';
import CustomFilters from '../../../components/Common/CustomFilters';
import SelectedFilters from '../../../components/Common/SelectedFilters';
import { modules } from '../../../constants/permissions';
import usePermission from '../../../components/Common/Hooks/usePermission';

const keyMapping = {
	status: 'Status',
	fromDate: 'From',
	toDate: 'To',
	type: 'Type',
	purpose: 'Transaction Type',
	tagIds: 'Segment',
	currencyId: 'Currency',
	searchString: 'Search',
};

const iskycStatusMapping = {
	completed: 'Completed',
	pending: 'Pending',
};

const purposeMapping = {
	Deposit: 'Deposit',
	Withdraw: 'Withdraw',
	BonusDeposit: 'Bonus Deposit',
	BonusWithdraw: 'Bonus Withdraw',
	TournamentEnroll: 'Tournament Enroll',
	TournamentWin: 'Tournament Payout',
	TournamentCancel: 'Tournament Cancel',
	TournamentRebuy: 'Tournament Rebuy',
	ReferralDeposit: 'Referral ',
};

const useFilters = (userId = '') => {
	const { isGranted } = usePermission();
	const dispatch = useDispatch();
	const { currencies } = useSelector((state) => state.Currencies);
	const { userTags } = useSelector((state) => state.UserDetails);

	const fetchData = (values) => {
		dispatch(
			fetchTransactionBankingStart({
				...values,
				userId,
				perPage: itemsPerPage,
				page: 1,
			})
		);
	};

	const handleFilter = (values) => {
		const payload = { ...values };

		if (payload.fromDate) {
			payload.fromDate = moment(payload.fromDate).format(
				'YYYY-MM-DDTHH:mm:ss.SSS[Z]'
			);
		}
		if (payload.toDate) {
			payload.toDate = moment(payload.toDate).format(
				'YYYY-MM-DDTHH:mm:ss.SSS[Z]'
			);
		}
		fetchData(payload);
	};

	const { validation, formFields, setFormFields } = useForm({
		initialValues: filterValues(),
		validationSchema: filterValidationSchema(),
		staticFormFields: staticFiltersFields(userId),
		enableReinitialize: false,
	});

	useEffect(() => {
		if (!userTags && isGranted(modules.segmentation, 'R')) {
			dispatch(getAllTags());
		}
		// if (!currencies) {
		// 	dispatch(fetchCurrenciesStart());
		// }
	}, [userTags, isGranted(modules.segmentation, 'R')]);

	useEffect(() => {
		if (currencies) {
			const tags = userTags?.tags?.map((row) => ({
				optionLabel: row?.tag,
				value: row.id,
			}));

			// const currencyOptions = currencies?.currencies?.map((currency) => ({
			// 	optionLabel: currency.code,
			// 	value: currency.id,
			// }));

			setFormFields([
				...staticFiltersFields(userId),
				{
					name: 'tagIds',
					fieldType: 'select',
					label: '',
					placeholder: 'Select Segment',
					optionList: tags,
				},
				// {
				// 	name: 'currencyId',
				// 	fieldType: 'select',
				// 	label: '',
				// 	placeholder: 'Select currency',
				// 	optionList: currencyOptions,
				// },
			]);
		}
	}, [currencies, userTags]);

	const filterFormatter = (key, value) => {
		const formattedKey = keyMapping[key] || key;

		let formattedValue = value;

		switch (key) {
			case 'status':
				formattedValue = iskycStatusMapping[value];
				break;
			case 'purpose':
				formattedValue = purposeMapping[value] || value;
				break;
			case 'toDate':
			case 'fromDate': {
				const date = new Date(value);
				formattedValue = date.toLocaleDateString('en-GB');
				break;
			}
			case 'tagIds':
				formattedValue =
					userTags?.tags?.find((tag) => tag.id == value)?.tag || '';
				break;
			case 'currencyId':
				formattedValue =
					currencies?.currencies?.find((currency) => currency.id == value)
						?.code || '';
				break;
			default:
				break;
		}

		return `${formattedKey}: ${formattedValue}`;
	};

	const handleResetCallback = () => {
		validation.resetForm({
			values: {
				...filterValues(),
				currencyId: null,
				fromDate: '',
				toDate: '',
			},
		});
	};

	const selectedFiltersComponent = (
		<SelectedFilters
			validation={validation}
			filterFormatter={filterFormatter}
			handleResetCallback={handleResetCallback}
		/>
	);

	const filterComponent = (
		<CustomFilters
			filterFields={formFields}
			validation={validation}
			handleFilter={handleFilter}
			showSearchInput={false}
		/>
	);

	return {
		filterFields: formFields,
		filterValues,
		handleFilter,
		filterValidation: validation,
		filterComponent,
		selectedFiltersComponent,
	};
};

export default useFilters;
