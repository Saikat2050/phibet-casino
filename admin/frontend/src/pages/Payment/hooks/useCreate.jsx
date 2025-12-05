import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import General from '../FormSections/General';
import Currencies from '../FormSections/Currency';
import Countries from '../FormSections/Countries';
import {
	createPaymentProvider,
	updatePaymentProvider,
	fetchLanguagesStart,
	getPaymentDetails,
	resetPaymentProvider,
	getPaymentAggregatorsStart,
} from '../../../store/actions';
import Languages from '../FormSections/Languages';

const useCreate = ({ isEdit }) => {
	const { paymentId } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [activeLangTab, setActiveLangTab] = useState('EN');
	const [activeTab, setActiveTab] = useState('general');
	const [blockedCountries, setBlockedCountries] = useState([]);
	const [allFields, setAllFields] = useState({});
	const [langContent, setLangContent] = useState({
		description: { EN: '' },
		name: { EN: '' },
	});

	const {
		createSuccess,
		createLoading,
		updateSuccess,
		updateLoading,
		paymentDetailsLoading,
		paymentDetails,
	} = useSelector((state) => state.Payment);

	const { languages } = useSelector((state) => state.Languages);

	const langList = useMemo(
		() =>
			languages?.languages?.map((language) => ({
				...language,
			})) || [],
		[languages]
	);

	useEffect(() => {
		if (paymentId) {
			dispatch(
				getPaymentDetails({
					providerId: paymentId,
				})
			);
		}
	}, [paymentId]);

	useEffect(() => {
		if (!isEmpty(paymentDetails)) {
			setLangContent({
				description: paymentDetails?.description,
				name: paymentDetails?.name,
			});
			setAllFields((prev) => ({
				...prev,
			}));
		}
	}, [paymentDetails]);

	useEffect(() => {
		if (isEmpty(languages)) {
			dispatch(fetchLanguagesStart());
		}
		return () => {
			dispatch(resetPaymentProvider());
		};
	}, []);

	useEffect(() => {
		if (createSuccess) {
			navigate('/payment');
		}
	}, [createSuccess]);

	useEffect(() => {
		if (updateSuccess) {
			navigate('/payment');
		}
	}, [updateSuccess]);

	useEffect(() => {
		dispatch(getPaymentAggregatorsStart());
	}, []);

	const submitPaymentProvider = (updateFields) => {
		if (isEdit) {
			const payload = {
				...allFields,
				providerId: paymentDetails?.id,
				// providerLimit: updateFields?.providerLimit || allFields.providerLimit,
				name: langContent?.name,
				// description: langContent?.description,
				minWithdraw:
					updateFields?.providerLimit?.[0]?.minWithdraw ||
					allFields.providerLimit?.[0]?.minWithdraw,
				maxWithdraw:
					updateFields?.providerLimit?.[0]?.maxWithdraw ||
					allFields.providerLimit?.[0]?.maxWithdraw,
				depositDescription: langContent?.depositDescription,
				withdrawDescription: langContent?.withdrawDescription,
				blockedCountries: updateFields?.blockedCountries,
				currencyDetails: null, // Empty extra payload
			};
			dispatch(updatePaymentProvider(payload));
		} else {
			const payload = {
				...allFields,
				// providerLimit: updateFields?.providerLimit || allFields.providerLimit,
				minWithdraw:
					updateFields?.providerLimit?.[0]?.minWithdraw ||
					allFields.providerLimit?.[0]?.minWithdraw,
				maxWithdraw:
					updateFields?.providerLimit?.[0]?.maxWithdraw ||
					allFields.providerLimit?.[0]?.maxWithdraw,
				name: langContent?.name,
				// description: langContent?.description,
				depositDescription: langContent?.depositDescription,
				withdrawDescription: langContent?.withdrawDescription,
				blockedCountries: updateFields?.blockedCountries,
				currencyDetails: null, // Empty extra payload
			};

			dispatch(createPaymentProvider(payload));
		}
	};

	const toggleTab = (tab, updateFields) => {
		if (tab === 'submit') {
			if (!updateLoading || !createLoading) {
				submitPaymentProvider(updateFields);
			}
		} else if (activeTab !== tab) {
			setActiveTab(tab);
		}
	};

	const onBackClick = () => {
		navigate('/payment');
	};

	const tabsToShow = [
		// add same condition like tabsData
		{
			id: 'general',
		},
		// {
		// 	id: 'languages',
		// },
		{
			id: 'currency',
		},
		// {
		// 	id: 'countries',
		// },
	];

	const tabData = [
		{
			id: 'general',
			title: 'General',
			component: (
				<General
					isLoading={paymentDetailsLoading}
					setActiveTab={setActiveTab}
					setAllFields={setAllFields}
					setLangContent={setLangContent}
					paymentDetails={paymentDetails}
					submitButtonLoading={createLoading || updateLoading}
					toggleTab={toggleTab}
					activeTab={activeTab}
					tabsToShow={tabsToShow}
					isEdit={isEdit}
				/>
			),
		},
		{
			id: 'languages',
			title: 'Languages',
			component: (
				<Languages
					langList={langList}
					setLangContent={setLangContent}
					langContent={langContent}
					activeLangTab={activeLangTab}
					setActiveLangTab={setActiveLangTab}
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					setAllFields={setAllFields}
					paymentDetails={paymentDetails}
					tabsToShow={tabsToShow}
					toggleTab={toggleTab}
					submitButtonLoading={createLoading || updateLoading}
				/>
			),
			isHidden: true,
		},
		{
			id: 'currency',
			title: 'Currency Limits',
			component: (
				<Currencies
					setActiveTab={setActiveTab}
					setAllFields={setAllFields}
					activeTab={activeTab}
					allFields={allFields}
					submitButtonLoading={createLoading || updateLoading}
					paymentDetails={paymentDetails}
					tabsToShow={tabsToShow}
					toggleTab={toggleTab}
				/>
			),
		},
		{
			id: 'countries',
			title: 'Blocked Countries',
			component: (
				<Countries
					setActiveTab={setActiveTab}
					setAllFields={setAllFields}
					activeTab={activeTab}
					allFields={allFields}
					submitButtonLoading={createLoading || updateLoading}
					paymentDetails={paymentDetails}
					tabsToShow={tabsToShow}
					toggleTab={toggleTab}
					blockedCountries={blockedCountries}
					setBlockedCountries={setBlockedCountries}
				/>
			),
			isHidden: true,
		},
	];

	return {
		tabData,
		activeTab,
		onBackClick,
		paymentDetails,
		paymentDetailsLoading,
	};
};

export default useCreate;
