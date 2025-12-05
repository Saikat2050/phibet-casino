import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
	getInitialValues,
	vipTierSchema,
	staticFormFields,
} from '../formDetails';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { getVIPTierByIdStart, editVIPTierStart } from '../../../store/actions';

const useUpdateVIPTier = () => {
	const dispatch = useDispatch();
	const { vipId } = useParams();
	const navigate = useNavigate();

	const { editVIPTierLoading, vipTiersLoading, vipTierDetails } = useSelector(
		(state) => state.VIPTiers
	);

	useEffect(() => {
		dispatch(getVIPTierByIdStart({ id: vipId }));
	}, [vipId]);

	// Transform API data to match form structure
	const transformedVIPDetails = vipTierDetails
		? {
				...vipTierDetails,
				tierUpBonusGc: vipTierDetails?.tierUpBonus?.gc || '', // Extract GC
				tierUpBonusSc: vipTierDetails?.tierUpBonus?.sc || '', // Extract SC
		  }
		: null;

	const handleSubmit = (values) => {
		const updatedValues = {
			...values,
			tierUpBonus: {
				gc: values.tierUpBonusGc,
				sc: values.tierUpBonusSc,
			},
		};

		delete updatedValues.tierUpBonusGc;
		delete updatedValues.tierUpBonusSc;

		dispatch(
			editVIPTierStart({
				values: {
					...updatedValues,
					id: vipId,
				},
				navigate,
			})
		);
	};

	const { validation, formFields } = useForm({
		header: 'Update VIP',
		initialValues: getInitialValues(transformedVIPDetails),
		validationSchema: vipTierSchema(),
		onSubmitEntry: handleSubmit,
		staticFormFields: staticFormFields(),
	});

	return {
		validation,
		formFields,
		navigate,
		editVIPTierLoading,
		vipTiersLoading,
	};
};

export default useUpdateVIPTier;
