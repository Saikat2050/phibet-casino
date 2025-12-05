/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-restricted-syntax */
import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import useForm from '../../../components/Common/Hooks/useFormModal';
import {
	getInitialValues,
	vipTierSchema,
	staticFormFields,
} from '../formDetails';
import { modules } from '../../../constants/permissions';
import ButtonList from '../../../components/Common/ButtonList';
import { createVipTierStart } from '../../../store/actions';

const useCreateVIPTier = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const formSubmitHandler = (values) => {
		const formattedValues = {
			...values,
			tierUpBonus: {
				gc: values.tierUpBonusGc,
				sc: values.tierUpBonusSc,
			},
		};

		// Remove unnecessary fields
		delete formattedValues.tierUpBonusGc;
		delete formattedValues.tierUpBonusSc;

		dispatch(createVipTierStart({ values: formattedValues, navigate }));
	};

	const { header, validation, setHeader, formFields, setFormFields } = useForm({
		header: 'Create VIP Tier',
		initialValues: getInitialValues(null),
		validationSchema: vipTierSchema(),
		staticFormFields: staticFormFields(),
		onSubmitEntry: formSubmitHandler,
	});

	const handleCreateClick = (e) => {
		e.preventDefault();
		navigate('create');
	};

	const buttonList = useMemo(() => [
		{
			label: 'Create',
			handleClick: handleCreateClick,
			link: '#!',
			module: modules.vip,
			operation: 'C',
		},
	]);

	const actionList = <ButtonList buttonList={buttonList} />;

	return {
		header,
		validation,
		setHeader,
		buttonList,
		formFields,
		setFormFields,
		actionList,
		navigate,
	};
};

export default useCreateVIPTier;
