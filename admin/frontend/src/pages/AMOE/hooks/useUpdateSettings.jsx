/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	amoeSchema,
	amoeSettingInitialValues,
	staticFormFields,
} from '../formDetails';
import {
	editAmoeSettingsStart,
	getSiteConfigurationStart,
} from '../../../store/actions';
import useForm from '../../../components/Common/Hooks/useFormModal';

const useUpdateSettings = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { isEditAmoeLoading } = useSelector((state) => state.Amoe);
	const { siteConfigDetails, siteConfigLoading } = useSelector(
		(state) => state.ProfileData
	);

	const handleUpdateAmoeSettings = (values) => {
		dispatch(
			editAmoeSettingsStart({
				values,
				callback: () => navigate('/amoe'),
			})
		);
	};

	const { validation, formFields } = useForm({
		header: 'Settings',
		initialValues: amoeSettingInitialValues(),
		validationSchema: amoeSchema,
		onSubmitEntry: handleUpdateAmoeSettings,
		staticFormFields,
	});

	useEffect(() => {
		if (siteConfigDetails?.amoEntryAddress) {
			const amoeDefaultValue =
				typeof siteConfigDetails?.amoEntryAddress?.value === 'string'
					? JSON.parse(siteConfigDetails.amoEntryAddress.value)
					: siteConfigDetails?.amoEntryAddress?.value;
			validation.setValues(amoeSettingInitialValues(amoeDefaultValue));
		} else if (!siteConfigLoading) {
			dispatch(getSiteConfigurationStart());
		}
	}, [siteConfigDetails?.amoEntryAddress]);

	return {
		validation,
		isEditAmoeLoading,
		formFields,
	};
};

export default useUpdateSettings;
