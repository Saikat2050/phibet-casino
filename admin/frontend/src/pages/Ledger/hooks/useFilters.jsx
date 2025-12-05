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
import { getLedgerDetailsStart, getAllTags } from '../../../store/actions';
import { itemsPerPage } from '../../../constants/config';
import CustomFilters from '../../../components/Common/CustomFilters';
import SelectedFilters from '../../../components/Common/SelectedFilters';
import usePermission from '../../../components/Common/Hooks/usePermission';
import { modules } from '../../../constants/permissions';

const keyMapping = {
	fromDate: 'From',
	toDate: 'To',
	purpose: 'Transaction Type',
	searchString: 'Search',
	dateOptions: 'Date Options',
	tagIds: 'Segment',
};

const ledgerPurposeMapping = {
	Deposit: 'Deposit',
	Withdraw: 'Withdraw',
	Winnings: 'Winnings',
	Purchase: 'Purchase',
	Redeem: 'Redeem',
	Commission: 'Commission',
	CasinoBet: 'Casino Wagered',
	CasinoWin: 'Casino Payout',
	CasinoRefund: 'Casino Refund',
	SportsbookBet: 'Sportsbook Bet',
	SportsbookWin: 'Sportsbook Win',
	SportsbookRefund: 'Sportsbook Refund',
	SportsbookCashout: 'Sportsbook Cashout',
	SportsbookExchangeBet: 'Sportsbook Exchange Bet',
	SportsbookExchangeWin: 'Sportsbook Exchange Win',
	SportsbookExchangeRefund: 'Sportsbook Exchange Refund',
	SportsbookExchangeCashout: 'Sportsbook Exchange Cashout',
	ResettlementLostToRefund: 'Resettlement Lost To Refund', // credit
	ResettlementLostToWin: 'Resettlement Lost To Win', // credit
	ResettlementOpenToWin: 'Resettlement Open To Win', // credit
	ResettlementWinToOpen: 'Resettlement Win To Open', // debit
	ResettlementWinToLost: 'Resettlement Won To Lost', // debit
	ResettlementRefundToLost: 'Resettlement Refund To Lost', // debit
	ResettlementRefundToOpen: 'Resettlement Refund To Open', // debit
	ResettlementOpenToRefund: 'Resettlement Open To Refund', // credit
	// TournamentEnroll: 'Tournament Enroll', // debit
	// TournamentWin: 'Tournament Win', // credit
	// TournamentCancel: 'Tournament Cancel', // credit
	// TournamentRebuy: 'Tournament Rebuy', // credit
	ReferralDeposit: 'Referral', // credit
};

const useFilters = (userId = '') => {
	const dispatch = useDispatch();
	const { userTags } = useSelector((state) => state.UserDetails);
	// const { ledgerDetail, ledgerDetailLoading } = useSelector((state) => state.TransactionBanking);
	const { isGranted } = usePermission();

	const fetchData = (values) => {
		dispatch(
			getLedgerDetailsStart({
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
		staticFormFields: staticFiltersFields(userId),
		enableReinitialize: false,
	});

	useEffect(() => {
		// if (!userTags && !ledgerDetailLoading && isGranted(modules.segmentation, 'R')) {
		//     dispatch(getAllTags());
		// }
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

	const filterFormatter = (key, value) => {
		const formattedKey = keyMapping[key] || key;

		let formattedValue = value;

		switch (key) {
			case 'purpose':
				formattedValue = ledgerPurposeMapping[value] || value;
				break;
			case 'tagIds':
				formattedValue =
					userTags?.tags?.find((tag) => tag.id == value)?.tag || '';
				break;
			case 'toDate':
			case 'fromDate': {
				const date = new Date(value);
				formattedValue = date.toLocaleDateString('en-GB');
				break;
			}
			default:
				break;
		}

		return `${formattedKey}: ${formattedValue}`;
	};

	const handleResetCallback = () => {
		validation.resetForm({
			values: {
				...filterValues(),
				// currencyId: null,
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
			showSearchInput
			searchInputPlaceHolder="Search by username"
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
