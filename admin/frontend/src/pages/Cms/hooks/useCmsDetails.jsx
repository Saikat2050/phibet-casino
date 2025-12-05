/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable radix */
import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import useForm from '../../../components/Common/Hooks/useFormModal';
import {
	getLanguagesStart,
	getCmsByPageId,
	resetCmsByPageIdData,
} from '../../../store/actions';

import {
	getInitialValues,
	createCmsNewSchema,
	staticFormFields,
} from '../formDetails';

const useCmsDetail = () => {
	const { cmsPageId } = useParams();
	const dispatch = useDispatch();
	const [customComponent, setCustomComponent] = useState();
	const [isView, setIsView] = useState(true);

	const { languageData } = useSelector((state) => state.CasinoManagementData);
	const { cmsByPageId } = useSelector((state) => state.AllCms);

	const onChangeRowsPerPage = (value) => {
		setItemsPerPage(value);
	};

	useEffect(() => {
		dispatch(getCmsByPageId({ cmsPageId }));
	}, []);

	useEffect(() => {
		dispatch(getLanguagesStart());
	}, []);

	const languageOptions = useMemo(() => {
		if (languageData) {
			return languageData?.languages?.map((item) => ({
				optionLabel: item?.name,
				value: item.code,
			}));
		}
		return [];
	}, [languageData]);

	// resetting cms details redux state
	useEffect(() => () => dispatch(resetCmsByPageIdData()), []);

	const { header, validation, setHeader, formFields, setFormFields } = useForm({
		header: `View CMS ${cmsPageId}`,
		initialValues: getInitialValues(cmsByPageId),
		validationSchema: createCmsNewSchema(languageOptions),
		staticFormFields: staticFormFields(
			isView,
			null,
			languageOptions,
			cmsByPageId
		),
	});

	useEffect(() => {
		setFormFields(staticFormFields(isView, null, languageOptions, cmsByPageId));
	}, [languageOptions, cmsByPageId]);

	return {
		header,
		setIsView,
		validation,
		setHeader,
		formFields,
		setFormFields,
		languageData,
		customComponent,
		setCustomComponent,
		onChangeRowsPerPage,
		languageOptions,
	};
};

export default useCmsDetail;
