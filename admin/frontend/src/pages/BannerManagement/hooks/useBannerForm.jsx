import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { staticFormFields, validationSchema } from '../formDetails';
import useForm from '../../../components/Common/Hooks/useFormModal';
import {
	deleteSABannersStart,
	editSABannersStart,
	getSABanners,
} from '../../../store/actions';
import { showToastr } from '../../../utils/helpers';

const useBannerForm = () => {
	const { bannerId } = useParams();
	const dispatch = useDispatch();
	const {
		isEditSABannersLoading,
		isEditSABannersSuccess,
		isDeleteSABannersLoading,
		isDeleteSABannersSuccess,
		SABanners,
		SABannersloading,
	} = useSelector((state) => state.SASettings);
	const [banners, setBanners] = useState({
		desktopBanner: [],
		mobileBanner: [],
	});

	const fetchData = () => {
		dispatch(getSABanners({}));
	};

	useEffect(
		() => fetchData(),
		[isEditSABannersSuccess, isDeleteSABannersSuccess]
	);

	const handleEditBanner = (values) => {
		if (!values.desktopImage && !values.mobileImage) {
			showToastr({
				message: 'Upload atleast one banner image.',
				type: 'error',
			});
		} else {
			dispatch(
				editSABannersStart({
					data: {
						bannerId,
						imageUrl: values.desktopImage,
						mobileImageUrl: values.mobileImage,
					},
				})
			);
		}
	};

	const { validation, formFields } = useForm({
		initialValues: { desktopImage: null, mobileImage: null },
		validationSchema: validationSchema(),
		onSubmitEntry: handleEditBanner,
		staticFormFields,
	});

	useEffect(() => {
		const selectedBanner = SABanners?.filter((val) => val.id === bannerId);

		const desktopBanner = [];
		const mobileBanner = [];

		if (
			selectedBanner?.[0]?.imageUrl?.length ||
			selectedBanner?.[0]?.mobileImageUrl?.length
		) {
			selectedBanner?.[0].imageUrl?.map((url) => {
				desktopBanner.push(url);
				return null;
			});
			selectedBanner?.[0].mobileImageUrl?.map((url) => {
				mobileBanner.push(url);
				return null;
			});
		}

		setBanners((prev) => ({ ...prev, desktopBanner, mobileBanner }));
	}, [SABanners]);

	useEffect(() => {
		validation.resetForm({ values: { desktopImage: null, mobileImage: null } });
	}, [isEditSABannersSuccess]);

	const handleDelete = (index) => {
		const deletedBanner = banners.filter((_, i) => i === index);
		if (deletedBanner.length) {
			dispatch(
				deleteSABannersStart({
					data: {
						bannerId,
						imageUrl: deletedBanner[0].desktopUrl,
						mobileImageUrl: deletedBanner[0].mobileUrl,
					},
				})
			);
		}
	};

	const handleDesktopDelete = (data) => {
		dispatch(deleteSABannersStart({ data: { bannerId, imageUrl: data.f } }));
	};

	const handleMobileDelete = (data) => {
		dispatch(
			deleteSABannersStart({ data: { bannerId, mobileImageUrl: data?.f } })
		);
	};

	return {
		validation,
		formFields,
		isEditSABannersLoading,
		banners,
		setBanners,
		handleDelete,
		isDeleteSABannersLoading,
		handleDesktopDelete,
		handleMobileDelete,
		bannerName: SABanners?.filter((val) => val.id === bannerId)?.[0]?.type,
		SABannersloading,
	};
};

export default useBannerForm;
