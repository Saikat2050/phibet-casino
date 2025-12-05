/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import uuid from 'react-uuid';
import { isEmpty } from 'lodash';
import { useNavigate } from 'react-router-dom';
import {
	getInitialValues,
	staticFormFields,
	validationSchema,
} from '../formDetails';
import {
	createSeoRouteStart,
	updateSeoRouteStart,
} from '../../../store/actions';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { modules } from '../../../constants/permissions';
import { formPageTitle } from '../../../components/Common/constants';
import { decryptCredentials } from '../../../network/storageUtils';

const useCreateSeo = () => {
	const dispatch = useDispatch();
	const [langState, setLangState] = useState({ EN: '' });
	const [showModal, setShowModal] = useState(false);
	const [isEdit, setIsEdit] = useState({ open: false, selectedRow: '' });

	const navigate = useNavigate();

	const {
		updateRouteInprogress,
		createRouteInprogress,
		updateRouteSuccess,
		createRouteSuccess,
	} = useSelector((state) => state.SeoData);

	const handleCreateSeoRoute = (values) => {
		dispatch(
			createSeoRouteStart({
				payload: {
					...values,
					uniqueId: uuid(),
				},
			})
		);
	};

	const handleEditSeoRoute = (values) => {
		dispatch(
			updateSeoRouteStart({
				data: { ...values, seoPageId: isEdit.selectedRow.id },
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
		header: 'Add Slug',
		initialValues: getInitialValues({ name: { EN: '' } }),
		validationSchema: validationSchema(langState),
		staticFormFields,
		onSubmitEntry: isEdit.open ? handleEditSeoRoute : handleCreateSeoRoute,
	});

	useEffect(() => {
		if (updateRouteSuccess) setIsOpen(false);
	}, [updateRouteSuccess]);

	useEffect(() => {
		if (createRouteSuccess) setIsOpen(false);
	}, [createRouteSuccess]);

	const handleAddClick = (e) => {
		e.preventDefault();
		setIsOpen((prev) => !prev);
		validation.resetForm(getInitialValues());
		setHeader('Add Slug');
		setIsEdit({ open: false, selectedRow: '' });
	};

	const onClickEdit = (selectedRow) => {
		setIsEdit({ open: true, selectedRow });
		setHeader('Edit Slug');
		validation.setValues(getInitialValues(selectedRow));
		setIsOpen((prev) => !prev);
	};

	const buttonList = useMemo(() => [
		{
			label: 'Add Slug',
			handleClick: handleAddClick,
			link: '#!',
			module: modules.seoPage,
			operation: 'C',
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

	function handleViewClick(e, id) {
		navigate(`/seo-slug/${id}`);
	}

	return {
		isOpen,
		setIsOpen,
		header,
		validation,
		formFields,
		setFormFields,
		buttonList,
		createRouteInprogress,
		updateRouteInprogress,
		onClickEdit,
		showModal,
		setShowModal,
		toggleFormModal,
		isEdit,
		handleViewClick,
	};
};

export default useCreateSeo;
