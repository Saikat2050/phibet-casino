import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import uuid from 'react-uuid';
import { isEmpty } from 'lodash';
import { useNavigate, useLocation } from 'react-router-dom';
import {
	getInitialValues,
	staticFormFields,
	validationSchema,
} from '../formDetails';
import {
	createCasinoCategoryStart,
	editCasinoCategoryStart,
} from '../../../store/actions';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { modules } from '../../../constants/permissions';
import { formPageTitle } from '../../../components/Common/constants';
import { decryptCredentials } from '../../../network/storageUtils';
import ButtonList from '../../../components/Common/ButtonList';

const useCreateCategory = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [langState, setLangState] = useState({ EN: '' });
	const [showModal, setShowModal] = useState(false);
	const [isEdit, setIsEdit] = useState({ open: false, selectedRow: '' });
	const {
		languageData,
		isCreateCategoryLoading,
		isEditCategoryLoading,
		isEditCategorySuccess,
		isCreateCategorySuccess,
	} = useSelector((state) => state.CasinoManagementData);
	const location = useLocation()
	const [isLobby, setIsLobby] = useState(false)	

	const handleCreateCategory = (values) => {
		const { displayOption, ...payloadValues } = values;

		const payload = {
			...payloadValues,
			isSidebar: displayOption === 'sidebar',
			isLobbyPage: displayOption === 'lobby',
			uniqueId: uuid(),
		};

		dispatch(
			createCasinoCategoryStart({
				payload,
			})
		);
	};

	const handleEditCategory = (values) => {
		const { displayOption, ...payloadValues } = values;

		const payload = {
			...payloadValues,
			isSidebar: displayOption === 'sidebar',
			isLobbyPage: displayOption === 'lobby',
			categoryId: isEdit.selectedRow.id,
		};

		dispatch(
			editCasinoCategoryStart({
				data: payload,
			})
		);
	};

	const {
		isOpen,
		setIsOpen,
		header,
		validation,
		formFields,
		setFormFields,
		setHeader,
	} = useForm({
		header: 'Add Category',
		initialValues: getInitialValues({ name: { EN: '' } }),
		validationSchema: validationSchema(langState),
		staticFormFields,
		onSubmitEntry: isEdit.open ? handleEditCategory : handleCreateCategory,
	});

	useEffect(() => {
		if (isEditCategorySuccess) setIsOpen(false);
	}, [isEditCategorySuccess]);

	useEffect(() => {
		if (isCreateCategorySuccess) setIsOpen(false);
	}, [isCreateCategorySuccess]);

	const handleAddClick = (e) => {
		e.preventDefault();
		setLangState({ EN: '' });
		setIsOpen((prev) => !prev);
		validation.resetForm(getInitialValues());
		setHeader('Add Category');
		setIsEdit({ open: false, selectedRow: '' });
	};

	const onClickEdit = (selectedRow) => {
		const langSt = { EN: '' };
		Object.keys(selectedRow?.name || {})?.forEach((lang) => {
			langSt[lang] = '';
		});
		setLangState(langSt);
		setIsEdit({ open: true, selectedRow });
		setHeader('Edit Category');
		validation.setValues(getInitialValues(selectedRow));
		setIsOpen((prev) => !prev);
	};

	const handleLobbyReorder = () => {
		navigate(`/categories/reorder/lobby`);
	};


	const handleSidebarReorder = ()=>{
		navigate(`/categories/reorder/sidebar`);
	}

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
				// 	// name: 'language',
				// 	fieldType: 'select',
				// 	label: 'Language',
				// 	placeholder: 'Select Language',
				// 	optionList: langOptions,
				// 	callBack: onChangeLanguage,
				// },
				{
					name: 'name',
					label: 'Category Name',
					fieldType: 'inputGroup',
					onDelete: onRemoveLanguage,
				},
				{
					name: 'isActive',
					fieldType: 'switch',
					label: 'Active',
				},
				{
					name: 'displayOption',
					fieldType: 'radioGroup',
					label: 'Display Option',
					description: 'Choose where to display this category',
					optionList: [
						{ value: 'sidebar', optionLabel: 'Sidebar' },
						{ value: 'lobby', optionLabel: 'LobbyPage' },
					],
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
			module: modules.casinoManagement,
			operation: 'C',
		},
		{
			label: 'Reorder Lobby',
			handleClick: handleLobbyReorder,
			link: 'reorder/lobby',
			module: modules.casinoManagement,
			operation: 'U',
		}, 
		{
			label: 'Reorder Sidebar',
			handleClick: handleSidebarReorder,
			link: 'reorder/sidebar',
			module: modules.casinoManagement,
			operation: 'U',
		},
	]);

	useEffect(() => {
		if (
			window.localStorage.getItem(formPageTitle.categories) &&
			!isEdit.open &&
			isOpen
		) {
			const values = JSON.parse(
				decryptCredentials(localStorage.getItem(formPageTitle.categories))
			);
			validation.setValues(values);
		}
	}, [isOpen]);

	const toggleFormModal = () => {
		if (!isEdit.open) {
			const hasFilledValues = Object.values(validation.values).some(
				(value) => !isEmpty(value) && !isEmpty(value?.EN)
			);
			if (hasFilledValues) {
				setShowModal(!showModal);
			}
		}
		setIsOpen((prev) => !prev);
	};

	const actionList = <ButtonList buttonList={buttonList} />;

	return {
		isOpen,
		setIsOpen,
		header,
		validation,
		formFields,
		setFormFields,
		buttonList,
		isCreateCategoryLoading,
		isEditCategoryLoading,
		onClickEdit,
		showModal,
		setShowModal,
		toggleFormModal,
		actionList,
	};
};

export default useCreateCategory;
