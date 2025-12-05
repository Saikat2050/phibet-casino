/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from 'react-redux';
import { React, useEffect, useMemo, useState } from 'react';
// import PropTypes from 'prop-types';

import { isEqual } from 'lodash';
import {
	getInitialValues,
	initialData,
	staticFormFields,
	validationSchema,
} from '../formDetails';
import { editCurrencyStart } from '../../../store/actions';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { Code, KeyValue, Name, Type } from '../CurrencyListCol';
// import { modules } from '../../../constants/permissions';
import usePermission from '../../../components/Common/Hooks/usePermission';
import { formPageTitle } from '../../../components/Common/constants';
import { decryptCredentials } from '../../../network/storageUtils';
import { currencySymbols } from '../../../utils/constant';
// import Actions from '../../../components/Common/Actions';
import { CURRENCY_DESCRIPTION } from '../../../constants/common';

const useCreateCurrency = () => {
	const dispatch = useDispatch();
	const { permissions } = usePermission();
	const [showModal, setShowModal] = useState(false);
	const [isEdit] = useState({ open: false, selectedRow: '' });
	const { currencies, isEditCurrencyLoading } = useSelector(
		(state) => state.Currencies
	);

	const handleEditCurrency = (values) => {
		dispatch(
			editCurrencyStart({
				data: {
					...values,
					currencyId: isEdit.selectedRow.id,
				},
			})
		);
	};

	const { isOpen, setIsOpen, header, validation, formFields } = useForm({
		header: 'Add Coin',
		initialValues: getInitialValues(),
		validationSchema,
		staticFormFields: staticFormFields(),
		onSubmitEntry: handleEditCurrency,
	});

	useEffect(() => {
		setIsOpen(false);
	}, []);

	useEffect(() => {
		setIsOpen(false);
	}, [currencies?.count]);

	useEffect(() => {
		if (validation?.values?.code) {
			const symbol = Object.keys(currencySymbols)?.includes(
				validation?.values?.code
			)
				? currencySymbols[validation?.values?.code]
				: '';
			validation.setFieldValue('symbol', symbol);
		}
	}, [validation?.values?.code]);

	// const onClickEdit = (selectedRow) => {
	// 	const symbol = Object.keys(currencySymbols)?.includes(selectedRow?.code)
	// 		? currencySymbols[selectedRow.code]
	// 		: '';
	// 	setIsEdit({ open: true, selectedRow });
	// 	setFormFields(staticFormFields(true));
	// 	setHeader('Update Coin');
	// 	validation.setValues(
	// 		getInitialValues({
	// 			...selectedRow,
	// 			symbol,
	// 		})
	// 	);
	// 	setIsOpen((prev) => !prev);
	// };

	useEffect(() => {
		if (
			window.localStorage.getItem(formPageTitle.currencies) &&
			!isEdit.open &&
			isOpen
		) {
			const values = JSON.parse(
				decryptCredentials(localStorage.getItem(formPageTitle.currencies))
			);
			validation.setValues(values);
		}
	}, [isOpen]);

	const toggleFormModal = () => {
		if (!isEdit.open) {
			const isDataEqual = isEqual(validation.values, initialData);
			if (!isDataEqual) {
				setShowModal(!showModal);
			}
		}
		setIsOpen((prev) => !prev);
	};

	// const isEditDisabled = (row) => row?.isDefault;
	// const actionsList = [
	// 	{
	// 		actionName: 'Edit',
	// 		actionHandler: onClickEdit,
	// 		isHidden: !isGranted(modules.coin, 'U'),
	// 		icon: ICON_CLASS.edit,
	// 		iconColor: TEXT_COLORS.primary,
	// 		isDisabled: isEditDisabled,
	// 	},
	// ];

	const columns = useMemo(
		() => [
			{
				Header: 'NAME',
				accessor: 'name',
				Cell: ({ cell }) => <Name cell={cell} />,
			},
			{
				Header: 'Code',
				accessor: 'code',
				Cell: ({ cell }) => <Code value={cell.value} />,
			},
			{
				Header: 'Description',
				accessor: 'id',
				Cell: ({ value }) => (
					<KeyValue value={CURRENCY_DESCRIPTION?.[value] || '-'} />
				),
			},
			{
				Header: 'TYPE',
				accessor: 'type',
				Cell: ({ cell }) => <Type value={cell.value} />,
			},
			// {
			// 	Header: 'ACTION',
			// 	accessor: 'actions',
			// 	disableSortBy: true,
			// 	disableFilters: true,
			// 	Cell: ({ cell }) => <Actions actionsList={actionsList} cell={cell} />,
			// },
		],
		[permissions]
	);

	return {
		isOpen,
		header,
		validation,
		formFields,
		columns,
		isEditCurrencyLoading,
		showModal,
		setShowModal,
		toggleFormModal,
	};
};

export default useCreateCurrency;
