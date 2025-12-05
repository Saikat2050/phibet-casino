import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
	getInitialValues,
	packageFormSchema,
	staticFormFields,
} from '../formDetails';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { createPackage } from '../../../store/actions';

const useCreate = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { createPackageLoading } = useSelector((state) => state.Packages);

	const handleSubmit = (values) => {
		dispatch(createPackage({ values, navigate }));
	};

	const { validation, formFields } = useForm({
		header: 'Add Package',
		initialValues: getInitialValues(null),
		validationSchema: packageFormSchema(),
		onSubmitEntry: handleSubmit,
		staticFormFields: staticFormFields(),
	});

	useEffect(() => {
		if (validation.values.welcomePackage) {
			validation.setFieldValue('isVisibleInStore', true);
		}
	}, [validation.values.welcomePackage]);

	return {
		validation,
		formFields,
		navigate,
		createPackageLoading,
	};
};

export default useCreate;
