/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useMemo } from 'react';

import {
	getInitialValues,
	staticFormFields,
	validationSchema,
} from '../formDetails';
import {
	editCountryStart,
	getLanguagesStart,
	updateCountryStatusStart,
} from '../../../store/actions';
import useForm from '../../../components/Common/Hooks/useFormModal';
import {
	CountryCode,
	CountryName,
	Language,
	Status,
} from '../CountriesListCol';
import { ICON_CLASS, TEXT_COLORS } from '../../../utils/constant';
import usePermission from '../../../components/Common/Hooks/usePermission';
import { modules } from '../../../constants/permissions';
import Actions from '../../../components/Common/Actions';

const useEditCountry = () => {
	const dispatch = useDispatch();
	const { isGranted } = usePermission();
	const {
		editCountriesLoading: isEditCountryLoading,
		editCountriesSuccess: isEditCountrySuccess,
	} = useSelector((state) => state.Countries);

	const { languageData } = useSelector((state) => state.CasinoManagementData);

	const handleEditCountry = (values) => {
		dispatch(
			editCountryStart({
				data: {
					languageId: Number(values.languageId),
					countryId: Number(values.id),
					kycMethod: Number(values.kycMethod),
				},
			})
		);
	};

	const { isOpen, setIsOpen, header, validation, formFields, setFormFields } =
		useForm({
			header: 'Edit Country Data',
			initialValues: getInitialValues(),
			validationSchema,
			staticFormFields,
			onSubmitEntry: handleEditCountry,
		});

	useEffect(() => {
		if (isEditCountrySuccess) setIsOpen(false);
	}, [isEditCountrySuccess]);

	const handleEditClick = (selectedRow) => {
		validation.setValues(selectedRow);
		setIsOpen((prev) => !prev);
	};

	const handleStatus = (row) => {
		dispatch(
			updateCountryStatusStart({
				countryId: row?.id,
			})
		);
	};

	useEffect(() => {
		if (languageData?.languages?.length) {
			const langOptions = languageData?.languages?.map((r) => ({
				id: r.id,
				optionLabel: r.name,
				value: r.id,
			}));

			setFormFields([
				...staticFormFields,
				{
					name: 'languageId',
					fieldType: 'select',
					label: 'Language',
					placeholder: 'Select Language',
					optionList: langOptions,
					isRequired: true,
				},
			]);
		}
	}, [languageData]);

	useEffect(() => {
		dispatch(getLanguagesStart());
	}, []);

	useEffect(() => {
		if (isEditCountrySuccess) setIsOpen(false);
	}, [isEditCountrySuccess]);

	const actionsList = [
		{
			actionName: 'Edit',
			actionHandler: handleEditClick,
			isHidden: !isGranted(modules.casinoManagement, 'TS'),
			icon: ICON_CLASS.edit,
			iconColor: TEXT_COLORS.primary,
		},
		{
			actionName: 'Toggle Status',
			actionHandler: handleStatus,
			isHidden: false,
			icon: ICON_CLASS.toggleStatus,
			iconColor: TEXT_COLORS.success,
		},
	];

	const columns = useMemo(
		() => [
			// {
			// 	Header: 'Id',
			// 	accessor: 'id',
			// 	notHidable: true,
			// 	// filterable: true,
			// 	Cell: ({ cell }) => <Id value={cell.value} />,
			// },
			{
				Header: 'Country Code',
				accessor: 'countryCode',
				// filterable: true,
				Cell: ({ cell }) => <CountryCode value={cell.value} />,
			},
			{
				Header: 'Name',
				accessor: 'countryName',
				// filterable: true,
				Cell: ({ cell }) => <CountryName value={cell.value} />,
			},
			{
				Header: 'Language',
				accessor: 'language',
				// filterable: true,
				Cell: ({ cell }) => <Language value={cell.value} />,
			},
			{
				Header: 'Status',
				accessor: 'isActive',
				disableSortBy: true,
				// filterable: true,
				Cell: ({ cell }) => <Status value={cell.value} />,
			},
			{
				Header: 'Actions',
				disableSortBy: true,
				accessor: 'actions',
				// filterable: true,
				Cell: ({ cell }) => <Actions actionsList={actionsList} cell={cell} />,
			},
		],
		[isGranted(modules.casinoManagement, 'TS')]
	);

	return {
		isOpen,
		setIsOpen,
		header,
		validation,
		formFields,
		setFormFields,
		isEditCountryLoading,
		handleEditClick,
		columns,
	};
};

export default useEditCountry;
