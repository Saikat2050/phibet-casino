import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { Card, Col } from 'reactstrap';
import CopyToClipboard from 'react-copy-to-clipboard';
import useForm from '../../../components/Common/Hooks/useFormModal';
import {
	getLanguagesStart,
	getEmailTemplate,
	updateEmailTemplate,
	resetEmailTemplate,
	getImageGallery,
} from '../../../store/actions';

import {
	getInitialValues,
	staticFormFields,
	emailTemplateSchema,
} from '../formDetails';

import { showToastr } from '../../../utils/helpers';

const useEditEmailTemplate = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { emailTemplateId } = useParams();
	const [showGallery, setShowGallery] = useState(false);

	const { languageData } = useSelector((state) => state.CasinoManagementData);
	const { emailTemplate } = useSelector((state) => state.EmailTemplate);
	const { imageGallery } = useSelector((state) => state.EmailTemplate);
	const [imageComponent, setImageComponent] = useState();
	const [dynamicKeyData, setDynamicKeyData] = useState({})

	useEffect(() => {
		if (emailTemplateId) {
			dispatch(getEmailTemplate(emailTemplateId));
		}
	}, [emailTemplateId]);

	// resetting email template details redux state
	useEffect(() => () => dispatch(resetEmailTemplate()), []);

	const formSubmitHandler = (values) => {
		dispatch(
			updateEmailTemplate({
				data: {
					emailTemplateId,
					templateCode: values?.content,
					eventType: values?.type,
					isDefault: values?.isDefault,
					label: values?.label
				},
				navigate,
			})
		);
	};

	useEffect(() => {
		dispatch(getLanguagesStart());
		dispatch(getImageGallery());
	}, []);

	const languageOptions = useMemo(() => {
		if (languageData) {
			return languageData?.languages?.map((item) => ({
				optionLabel: item?.code,
				value: item.code,
			}));
		}
		return [];
	}, [languageData]);

	useEffect(() => {
		if (emailTemplate?.dynamicData.length) {
			const dynamicData = {}
			emailTemplate?.dynamicData?.map((data) => {
				dynamicData[data] = ''
			})
			setDynamicKeyData(dynamicData)
		}
	}, [emailTemplate])

	const { header, validation, formFields, setFormFields } = useForm({
		header: `Edit Email Template ${emailTemplateId}`,
		initialValues: getInitialValues(emailTemplate),
		validationSchema: emailTemplateSchema,
		staticFormFields: staticFormFields(true),
		onSubmitEntry: formSubmitHandler,
	});

	useEffect(() => {
		setFormFields(staticFormFields(true));
	}, [languageOptions, emailTemplateId]);

	const handleGalleryClick = () => {
		setShowGallery(true);
	};

	const galleryList = useMemo(() => [
		{
			label: 'Image Gallery',
			handleClick: handleGalleryClick,
			link: '#!',
		},
	]);

	useEffect(() => {
		if (imageGallery?.length) {
			setImageComponent(
				<div
					className="d-flex justify-content-center flex-wrap gap-3 dropzone-previews mt-3"
					id="file-previews"
				>
					{imageGallery.map((f) => (
						<Col>
							<Card className="align-items-center mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete">
								<div className="p-2">
									<CopyToClipboard
										text={f}
										onCopy={() => {
											setShowGallery(false);
											showToastr({
												message: 'Copied To ClipBoard',
												type: 'success',
											});
										}}
									>
										<img
											data-dz-thumbnail=""
											height="200"
											width="250"
											className="rounded me-2 bg-light"
											alt={f.name}
											src={f}
										/>
									</CopyToClipboard>
								</div>
							</Card>
						</Col>
					))}
				</div>
			);
		} else {
			setImageComponent(
				<div className="text-center text-danger">No Images Found</div>
			);
		}
	}, [imageGallery]);

	return {
		validation,
		galleryList,
		formFields,
		setFormFields,
		showGallery,
		setShowGallery,
		handleGalleryClick,
		emailTemplateId,
		emailTemplate,
		header,
		imageComponent,
		languageOptions,
		dynamicKeyData,
		setDynamicKeyData
	};
};

export default useEditEmailTemplate;
