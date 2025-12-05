import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
	getInitialValues,
	packageFormSchema,
	staticFormFields,
} from '../formDetails';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { getPackage, updatePackage } from '../../../store/actions';

const useUpdate = () => {
	const dispatch = useDispatch();
	const { packageId } = useParams();
	const navigate = useNavigate();

	const { updatePackageLoading, packageInfo, isPackageInfoLoading } =
		useSelector((state) => state.Packages);

	useEffect(() => {
		dispatch(getPackage({ id: packageId }));
	}, [packageId]);

	const handleSubmit = (values) => {
		dispatch(
			updatePackage({
				values: {
					...values,
					id: packageId,
				},
				navigate,
			})
		);
	};

	const { validation, formFields } = useForm({
		header: 'Update Package',
		initialValues: getInitialValues(packageInfo),
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
		isPackageInfoLoading,
		updatePackageLoading,
	};
};

export default useUpdate;
