import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	getImageGallery,
	uploadImageGallery,
	deleteImageGallery,
	resetImageGallery,
} from '../../../store/actions';
import {
	validationSchema,
	getInitialValues,
	formatBytes,
} from '../formDetails';
import useForm from '../../../components/Common/Hooks/useFormModal';
import usePermission from '../../../components/Common/Hooks/usePermission';
import { modules } from '../../../constants/permissions';
import { showToastr } from '../../../utils/helpers';

const useImageGallery = () => {
	const dispatch = useDispatch();
	const { isGranted } = usePermission();
	const [showUpload, setShowUpload] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [showDeletePopup, setShowDeletePopup] = useState({
		showDelete: false,
		fileName: null,
	});
	const {
		imageGallery,
		imageGalleryLoading,
		uploadGallery: uploadGallerySuccess,
	} = useSelector((state) => state.EmailTemplate);

	useEffect(() => {
		dispatch(getImageGallery());
	}, []);

	useEffect(() => {
		if (uploadGallerySuccess) {
			setShowUpload(false);
			setIsUploading(false);
		}

		return () => {
			dispatch(resetImageGallery()); // resetting image gallery redux state
		};
	}, [uploadGallerySuccess]);

	function handleAcceptedFiles(values) {
		setIsUploading(true);
		const { initialstate } = values;
		dispatch(
			uploadImageGallery({
				file: initialstate,
			})
		);
	}

	const deleteImage = (f) => {
		const data = {
			name: f,
		};
		dispatch(deleteImageGallery(data));
	};

	const { validation } = useForm({
		initialValues: getInitialValues(),
		validationSchema,
		onSubmitEntry: handleAcceptedFiles,
	});

	const handleFileUpload = (files) => {
		if (isGranted(modules.gallery, 'U')) {
			const formattedFiles = files.map((file) =>
				Object.assign(file, {
					preview: URL.createObjectURL(file),
					formattedSize: formatBytes(file.size),
				})
			);
			validation.setFieldValue('initialstate', formattedFiles[0]);
		} else {
			showToastr({
				type: 'error',
				message: 'You do not have permission to upload image',
			});
		}
	};

	const handleClear = () => {
		validation.resetForm(getInitialValues());
	};

	const handleAddClick = () => {
		handleClear();
		setShowUpload(true);
		setIsUploading(false);
	};

	const buttonList = useMemo(() => [
		{
			label: 'Upload',
			handleClick: handleAddClick,
			module: modules.gallery,
			operation: 'C',
		},
	]);

	return {
		imageGallery,
		imageGalleryLoading,
		handleFileUpload,
		deleteImage,
		validation,
		buttonList,
		showUpload,
		setShowUpload,
		isUploading,
		handleClear,
		showDeletePopup,
		setShowDeletePopup,
	};
};

export default useImageGallery;
