/* eslint-disable no-unused-expressions */
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { isEmpty } from 'lodash';
import {
	getInitialValues,
	staticFormFields,
	validationSchema,
} from '../formDetails';
import {
	createKYCLabelsStart,
	editKYCLabelsStart,
	getLanguagesStart,
} from '../../../store/actions';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { modules } from '../../../constants/permissions';
import { formPageTitle } from '../../../components/Common/constants';
import ButtonList from '../../../components/Common/ButtonList';
import { decryptCredentials } from '../../../network/storageUtils';

const useCreateKYCLabels = () => {
	const dispatch = useDispatch();
	const [langState, setLangState] = useState({ EN: '' });
	const [showModal, setShowModal] = useState(false);
	const [isEditPage, setIsEditPage] = useState({
		open: false,
		selectedRow: '',
	});
	const { languageData } = useSelector((state) => state.CasinoManagementData);
	const {
		documentLabels,
		isCreateKYCLabelsLoading,
		isEditKYCLabelsLoading,
		isEditKYCLabelsSuccess,
	} = useSelector((state) => state.SASettings);

	const handleCreateKYCLabels = (values) => {
		dispatch(
			createKYCLabelsStart({
				data: {
					...values,
					name: values?.name?.EN,
				},
			})
		);
		setLangState({ EN: '' });
	};

	const handleEditKYCLabels = (values) => {
		dispatch(
			editKYCLabelsStart({
				data: {
					...values,
					name: values?.name?.EN,
					documentLabelId: Number(isEditPage.selectedRow?.id),
				},
			})
		);
		setLangState({ EN: '' });
	};

	const {
		isOpen,
		setIsOpen,
		header,
		setHeader,
		validation,
		formFields,
		setFormFields,
	} = useForm({
		header: 'Add KYC Labels',
		initialValues: getInitialValues({ name: { EN: '' } }),
		validationSchema: validationSchema(langState),
		staticFormFields,
		onSubmitEntry: isEditPage.open
			? handleEditKYCLabels
			: handleCreateKYCLabels,
	});

	const onClickEditButton = (e, selectedRow) => {
		e.preventDefault();
		e.stopPropagation();
		setIsEditPage({ open: true, selectedRow });
		setHeader(`Edit KYC Labels : Label ${selectedRow.id}`);
		validation.setValues(
			getInitialValues({ ...selectedRow, name: { EN: selectedRow.name } })
		);
		setIsOpen((prev) => !prev);
	};

	const handleAddClick = (e) => {
		e.preventDefault();
		setIsOpen((prev) => !prev);
		validation.resetForm(getInitialValues());
		setHeader('Add KYC Labels');
		setIsEditPage({ open: false, selectedRow: '' });
	};

	useEffect(() => {
		setIsOpen(false);
	}, [documentLabels?.documentLabels?.length]);

	useEffect(() => {
		if (isEditKYCLabelsSuccess) setIsOpen(false);
	}, [isEditKYCLabelsSuccess]);

	// const onChangeLanguage = (e) => {
	// 	validation.setValues((prev) => ({
	// 		...prev,
	// 		name: { ...prev.name, [e.target.value]: '' },
	// 	}));
	// 	setLangState((prev) => ({ ...prev, [e.target.value]: '' }));
	// };

	const onRemoveLanguage = (e) => {
		validation.setValues((prev) => {
			const { name } = prev;
			const { [e]: key, ...rest } = name;
			return { ...prev, name: rest };
		});
		setLangState((prev) => {
			const { [e]: key, ...rest } = prev;
			return rest;
		});
	};

	useEffect(() => {
		if (languageData?.languages?.length) {
			// const langOptions = languageData?.languages?.map((r) => ({
			// 	id: r.id,
			// 	optionLabel: r.name,
			// 	value: r.code,
			// }));

			setFormFields([
				// {
				// 	fieldType: 'select',
				// 	label: 'Language',
				// 	placeholder: 'Select Language',
				// 	optionList: langOptions,
				// 	callBack: onChangeLanguage,
				// },
				{
					name: 'name',
					label: 'KYCLabels Name',
					fieldType: 'inputGroup',
					onDelete: onRemoveLanguage,
				},
				...staticFormFields,
			]);
		}
	}, [languageData]);

	const buttonList = useMemo(() => [
		{
			label: 'Create',
			handleClick: handleAddClick,
			link: '#!',
			module: modules.kyc,
			operation: 'C',
		},
	]);

	const actionList = <ButtonList buttonList={buttonList} />;

	useEffect(() => {
		dispatch(getLanguagesStart());
	}, []);

	useEffect(() => {
		if (
			window.localStorage.getItem(formPageTitle.kyc) &&
			!isEditPage.open &&
			isOpen
		) {
			const values = JSON.parse(
				decryptCredentials(localStorage.getItem(formPageTitle.kyc))
			);
			validation.setValues(values);
		}
	}, [isOpen]);

	const toggleFormModal = () => {
		if (!isEditPage.open) {
			const hasFilledValues = Object.values(validation.values).some(
				(value) => !isEmpty(value) && !isEmpty(value?.EN)
			);
			hasFilledValues && setShowModal(!showModal);
		}
		setIsOpen((prev) => !prev);
	};

	return {
		isOpen,
		setIsOpen,
		header,
		validation,
		formFields,
		setFormFields,
		actionList,
		isCreateKYCLabelsLoading,
		onClickEditButton,
		isEditKYCLabelsLoading,
		showModal,
		setShowModal,
		toggleFormModal,
	};
};

export default useCreateKYCLabels;
