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
import { fetchCurrenciesStart, getAllTags } from '../../../store/actions';
import { itemsPerPage } from '../../../constants/config';
import { fetchGameTransactionsStart } from '../../../store/gameTransactions/actions';
import SelectedFilters from '../../../components/Common/SelectedFilters';
import CustomFilters from '../../../components/Common/CustomFilters';
import usePermission from '../../../components/Common/Hooks/usePermission';
import { modules } from '../../../constants/permissions';

const keyMapping = {
	gameName: 'Game Name',
	tab: 'Report of',
	toDate: 'To',
	fromDate: 'From',
	dateOptions: 'Date Options',
	orderBy: 'Order By',
	currencyId: 'Currency',
	tagIds: 'Segment',
};

const gameOrderByMapping = {
	totalBetAmount: 'Top wagered',
	totalPlayers: 'Most played',
	totalWinAmount: 'Top payout',
};

const tabsTypeMapping = {
	game: 'Game',
	provider: 'Provider',
};

const useFilters = (userId = '') => {
	const dispatch = useDispatch();
	const { currencies } = useSelector((state) => state.Currencies);
	const { userTags } = useSelector((state) => state.UserDetails);
	const { isGranted } = usePermission();

	const fetchData = (values) => {
		dispatch(
			fetchGameTransactionsStart({
				...values,
				perPage: itemsPerPage,
				page: 1,
				userId,
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
		// onSubmitEntry: handleFilter,
		staticFormFields: staticFiltersFields(),
		enableReinitialize: false,
	});

	useEffect(() => {
		if (!userTags && isGranted(modules.segmentation, 'R')) {
			dispatch(getAllTags());
		}
		if (!currencies) {
			dispatch(fetchCurrenciesStart());
		}
	}, []);

	useEffect(() => {
		if (userTags && currencies) {
			const tags = userTags?.tags?.map((row) => ({
				optionLabel: row?.tag,
				value: row.id,
			}));

			const currencyOptions = currencies?.currencies?.map((currency) => ({
				optionLabel: currency.code,
				value: currency.id,
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
				{
					name: 'currencyId',
					fieldType: 'select',
					label: '',
					placeholder: 'Select currency',
					optionList: currencyOptions,
				},
			]);
		}
	}, [userTags, currencies]);

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
			case 'tab':
				formattedValue = tabsTypeMapping[value] || value;
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
			values: {
				...filterValues(),
				currencyId: null,
				tab: '',
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
		filterValidation: validation,
		filterComponent,
		selectedFiltersComponent,
	};
};

export default useFilters;
