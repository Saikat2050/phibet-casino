/* eslint-disable eqeqeq */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/prop-types */
import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import { depositSchema } from '../formDetails';
import FormModal from '../../../components/Common/FormModal';
import useForm from '../../../components/Common/Hooks/useFormModal';
import {
	depositToOther,
	fetchCurrenciesStart,
	getUserDetails,
} from '../../../store/actions';
import { showToastr } from '../../../utils/helpers';
import { defaultCurrencyId } from '../../../constants/config';

const transactionTypeOptionsList = [
	{
		optionLabel: 'Add Coin',
		value: 'AddCoin',
	},
	{
		optionLabel: 'Remove Coin',
		value: 'RemoveCoin',
	},
];

const staticFormFields = (currencySelect) => [
	// {
	// 	name: 'amountType',
	// 	fieldType: 'select',
	// 	placeholder: 'Amount type',
	// 	label: 'Select Amount Type',
	// 	optionList: [
	// 		{
	// 			optionLabel: 'Cash',
	// 			value: 'cash',
	// 		},
	// 		{
	// 			optionLabel: 'Bonus',
	// 			value: 'bonus',
	// 		},
	// 	],
	// },
	{
		name: 'transactionType',
		fieldType: 'radioGroup',
		label: 'Transaction Type',
		optionList: transactionTypeOptionsList,
		isRequired: true,
	},
	{ ...currencySelect },
	{
		name: 'addAmount',
		placeholder: '0.00',
		fieldType: 'textfieldWithAdornment',
		label: 'Amount',
		type: 'number',
		maximum: 15,
		isRequired: true,
	},
];

const ManageMoney = ({ show, toggle, playerId }) => {
	const dispatch = useDispatch();
	const { userDetails, depositToOtherLoading } = useSelector(
		(state) => state.UserDetails
	);
	const { currencies } = useSelector((state) => state.Currencies);

	const handleDepositToOther = (values) => {
		const walletId = userDetails?.wallets?.find(
			(wallet) => wallet.currencyId === values.currencyId
		)?.id;

		if (!walletId) {
			showToastr({
				message: 'Unable to find wallet, please refresh and try again!',
				type: 'error',
			});
			return;
		}

		dispatch(
			depositToOther({
				amount: parseFloat(values?.addAmount.toFixed(2)),
				purpose: values?.transactionType,
				walletId: Number(walletId),
				userId: userDetails.id,
			})
		);
	};

	const {
		isOpen,
		setIsOpen,
		validation,
		formFields,
		setFormFields,
		setHeader,
		header,
	} = useForm({
		validationSchema: depositSchema,
		initialValues: {
			amountType: 'cash',
			addAmount: '',
			currencyId: defaultCurrencyId,
			transactionType: transactionTypeOptionsList[0].value,
		},
		onSubmitEntry: (values, { resetForm }) => {
			handleDepositToOther(values);
			resetForm();
			toggle();
		},
		staticFormFields: staticFormFields(),
	});

	useEffect(() => {
		if (playerId) {
			validation.resetForm();
			dispatch(getUserDetails({ playerId }));
		}
	}, [playerId]);

	useEffect(() => {
		if (!isEmpty(userDetails)) {
			const headerName =
				userDetails?.firstName && userDetails?.lastName
					? `${userDetails?.firstName || ''} ${userDetails?.lastName || ''}`
					: userDetails?.username;
			setHeader(`Manage Money for '${headerName}'`);
		}
	}, [userDetails]);

	useEffect(() => {
		if (currencies && userDetails?.wallets) {
			setFormFields(
				staticFormFields({
					name: 'currencyId',
					fieldType: 'select',
					placeholder: 'Select currency',
					label: 'Select currency',
					optionList: currencies?.currencies
						?.filter((currency) => currency?.isActive)
						.map((currency) => ({
							optionLabel: currency.name,
							value: currency.id,
						})),
					dynamicDescription: (values) => {
						if (values?.currencyId) {
							const wallet = useMemo(
								() =>
									userDetails?.wallets?.find(
										(wal) => wal.currencyId == values.currencyId
									),
								[values.currencyId, userDetails?.wallets]
							);
							return (
								<p className="mt-2 m-0">
									<b>
										Available Balance :{' '}
										<span className="text-success">
											{values?.amountType === 'cash'
												? wallet?.amount || '0.00'
												: values?.amountType === 'bonus'
												? wallet?.bonusAmount || '0.00'
												: '0.00'}
										</span>
									</b>
								</p>
							);
						}
						return '';
					},
				})
			);
		}
	}, [currencies, userDetails]);

	useEffect(() => {
		if (!currencies) {
			dispatch(fetchCurrenciesStart());
		}
	}, []);

	useEffect(() => {
		if (show) setIsOpen(true);
		else setIsOpen(false);
	}, [show]);

	return (
		<div>
			<FormModal
				isOpen={isOpen}
				toggle={() => {
					setIsOpen((prev) => !prev);
					toggle();
				}}
				header={header}
				validation={validation}
				formFields={formFields}
				submitLabel="Submit"
				customColClasses="col-md-12"
				isSubmitLoading={depositToOtherLoading}
				// customComponent={
				// 	<PlayerWallet userDetails={userDetails} heading="Balance" />
				// }
			/>
		</div>
	);
};

export default ManageMoney;
