/* eslint-disable eqeqeq */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import {
	filterValidationSchema,
	filterValues,
	staticFiltersFields,
} from '../formDetails';

import useForm from '../../../components/Common/Hooks/useFormModal';
import { fetchCurrenciesStart, getAllTags } from '../../../store/actions';
import { itemsPerPage } from '../../../constants/config';
import { fetchPlayerPerformanceStart } from '../../../store/playerPerformance/actions';
import SelectedFilters from '../../../components/Common/SelectedFilters';
import CustomFilters from '../../../components/Common/CustomFilters';
import { convertToUTC, getDateRangeForOption } from '../../../utils/helpers';
import usePermission from '../../../components/Common/Hooks/usePermission';
import { modules } from '../../../constants/permissions';

const keyMapping = {
	searchString: 'Search',
	toDate: 'To',
	fromDate: 'From',
	dateOptions: 'Date Options',
	orderBy: 'Order By',
	currencyId: 'Currency',
	tagIds: 'Segment',
};

const gameOrderByMapping = {
	netProfit: 'Net Profit',
	scRewards: 'SC Rewards',
	scStakedAmount: 'SC Wagered Amount',
	scBetCount: 'SC Bet Count',
	scCasinoWins: 'SC Casino Wins',
	scCasinoBetRollback: 'SC Casino Bet Rollback',
	scCasinoWinRollback: 'SC Casino Win Rollback',
	scPurchases: 'SC Purchases',
	gcRewards: 'GC Rewards',
	gcPurchases: 'GC Purchases',
	gcStakedAmount: 'GC Wagered Amount',
	gcBetCount: 'GC Bet Count',
	gcCasinoWins: 'GC Casino Wins',
	gcCasinoBetRollback: 'GC Casino Bet Rollback',
	gcCasinoWinRollback: 'GC Casino Win Rollback',
	redeemCompletedAmount: 'Redeem Completed Amount',
	redeemFailedAmount: 'Redeem Failed Amount',
	redeemRejectedAmount: 'Redeem Rejected Amount',
};

const useFilters = (userId = '') => {
	const dispatch = useDispatch();
	const { currencies } = useSelector((state) => state.Currencies);
	const [timezone, setTimezone] = useState('GMT');
	const { userTags } = useSelector((state) => state.UserDetails);
	const { isGranted } = usePermission();

	const fetchData = (values) => {
		dispatch(
			fetchPlayerPerformanceStart({
				perPage: itemsPerPage,
				page: 1,
				userId,
				...values,
			})
		);
	};

	const handleFilter = (values) => {
		const payload = { ...values };

		if (payload.dateOptions) {
			const dateRange = getDateRangeForOption(payload.dateOptions, {
				fromDate: payload.fromDate,
				toDate: payload.toDate,
			});

			const dateOptionsITC = convertToUTC(
				dateRange.start.format('YYYY-MM-DD'),
				dateRange.end.format('YYYY-MM-DD'),
				payload.timezone
			);

			payload.fromDate = dateOptionsITC.startUTC;
			payload.toDate = dateOptionsITC.endUTC;
		} else {
			const startDate = payload.fromDate
				? moment(payload.fromDate).format('YYYY-MM-DD')
				: null;
			const endDate = payload.toDate
				? moment(payload.toDate).format('YYYY-MM-DD')
				: moment().format('YYYY-MM-DD');

			const customDatesUTC = convertToUTC(startDate, endDate, payload.timezone);

			payload.fromDate = customDatesUTC.startUTC;
			payload.toDate = customDatesUTC.endUTC;
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
		if (!currencies) {
			dispatch(fetchCurrenciesStart());
		}
	}, []);

	useEffect(() => {
		if (!userTags && isGranted(modules.segmentation, 'R')) {
			dispatch(getAllTags());
		}
	}, []);

	useEffect(() => {
		const tags = userTags?.tags?.map((row) => ({
			optionLabel: row?.tag,
			value: row.id,
		}));

		setFormFields([
			...staticFiltersFields(userId),
			{
				name: 'tagIds',
				fieldType: 'select',
				label: '',
				placeholder: 'Select Segment',
				optionList: tags,
			},
		]);
	}, [userTags]);

	// useEffect(() => {
	// 	if (currencies) {
	// 		const currencyOptions = currencies?.currencies?.map((currency) => ({
	// 			optionLabel: currency.code,
	// 			value: currency.id,
	// 		}));

	// 		setFormFields([
	// 			...staticFiltersFields(),
	// 			{
	// 				name: 'currencyId',
	// 				fieldType: 'select',
	// 				label: '',
	// 				placeholder: 'Select currency',
	// 				optionList: currencyOptions,
	// 			},
	// 		]);
	// 	}
	// }, [currencies]);

	const filterFormatter = (key, value) => {
		const formattedKey = keyMapping[key] || key;

		let formattedValue = value;

		switch (key) {
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
			case 'orderBy':
				formattedValue = gameOrderByMapping[value] || value;
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
			values: { ...filterValues(), currencyId: null, fromDate: '', toDate: '' },
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
			searchInputPlaceHolder="Search by username"
		/>
	);

	return {
		filterFields: formFields,
		filterValidation: validation,
		selectedFiltersComponent,
		filterComponent,
		timezone,
		setTimezone,
	};
};

export default useFilters;
