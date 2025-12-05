import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
	getInitialValues,
	staticFormFields,
	validationSchema,
} from '../formDetails';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { editSABannersStart } from '../../../store/actions';
// import { modules } from '../../../constants/permissions';
import { formPageTitle } from '../../../components/Common/constants';
import { decryptCredentials } from '../../../network/storageUtils';
import { dataURLtoBlob } from '../../../utils/helpers';

const useCreateBanner = () => {
	const dispatch = useDispatch();
	const [showModal, setShowModal] = useState(false);
	const [validationConditions] = useState({
		minRequiredWidth: 600,
		minRequiredHeight: 300,
		maxRequiredWidth: 1600,
		maxRequiredHeight: 600,
	});
	const {
		isEditSABannersLoading: isEditBannerLoading,
		isEditSABannersSuccess,
	} = useSelector((state) => state.SASettings);

	const handleEditBanner = (values) => {
		dispatch(
			editSABannersStart({
				data: {
					...values,
					file: typeof values.file === 'string' ? '' : values?.file,
				},
			})
		);
	};

	const { isOpen, setIsOpen, header, validation, formFields, setHeader } =
		useForm({
			header: 'Edit Banner',
			initialValues: getInitialValues(),
			validationSchema: validationSchema({
				minRequiredWidth: validationConditions?.minRequiredWidth,
				minRequiredHeight: validationConditions?.minRequiredHeight,
				maxRequiredWidth: validationConditions?.maxRequiredWidth,
				maxRequiredHeight: validationConditions?.maxRequiredHeight,
			}),
			staticFormFields,
			onSubmitEntry: handleEditBanner,
		});

	const onClickEdit = (selectedRow) => {
		validation.setValues(
			getInitialValues({
				bannerId: selectedRow.id,
				file: selectedRow.imageUrl,
			})
		);
		setHeader(`Update ${selectedRow.type} banner`);
		setIsOpen((prev) => !prev);
	};

	useEffect(() => {
		if (isEditSABannersSuccess) setIsOpen();
	}, [isEditSABannersSuccess]);

	useEffect(() => {
		if (window.localStorage.getItem(formPageTitle.bannerManagement) && isOpen) {
			const storedValues = JSON.parse(
				decryptCredentials(localStorage.getItem(formPageTitle.bannerManagement))
			);

			if (storedValues?.file) {
				const base64Content = storedValues.file;
				const blob = dataURLtoBlob(base64Content);

				storedValues.file = new File([blob], storedValues.file.name, {
					type: blob.type,
				});
			}

			validation.setValues(storedValues);
		}
	}, [isOpen]);

	return {
		isOpen,
		setIsOpen,
		header,
		validation,
		formFields,
		isEditBannerLoading,
		onClickEdit,
		showModal,
		setShowModal,
	};
};

export default useCreateBanner;
