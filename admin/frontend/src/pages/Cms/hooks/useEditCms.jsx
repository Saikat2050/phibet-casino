import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Col } from 'reactstrap';
import CopyToClipboard from 'react-copy-to-clipboard';
import useForm from '../../../components/Common/Hooks/useFormModal';
import {
	getLanguagesStart,
	getCmsByPageId,
	updateSaCms,
	resetCmsByPageIdData,
} from '../../../store/actions';

import {
	getInitialValues,
	createCmsNewSchema,
	staticFormFields,
} from '../formDetails';

import { showToastr } from '../../../utils/helpers';

const useEditCms = () => {
	const navigate = useNavigate();
	const { cmsPageId } = useParams();
	const dispatch = useDispatch();
	const [showGallery, setShowGallery] = useState(false);

	const { languageData } = useSelector((state) => state.CasinoManagementData);
	const { imageGallery } = useSelector((state) => state.EmailTemplate);
	const [imageComponent, setImageComponent] = useState();
	const { cmsByPageId } = useSelector((state) => state.AllCms);

	const formSubmitHandler = (values) => {
		if (values?.content) {
			dispatch(
				updateSaCms({
					cmsData: { ...values, pageId: Number(cmsPageId), language: '' },
					navigate,
				})
			);
		} else {
			showToastr({
				message: 'Content Required',
				type: 'error',
			});
		}
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

	useEffect(() => () => dispatch(resetCmsByPageIdData()), []);

	const { header, validation, setHeader, formFields, setFormFields } = useForm({
		header: `Edit CMS ${cmsPageId}`,
		initialValues: getInitialValues(cmsByPageId),
		validationSchema: createCmsNewSchema(languageOptions),
		staticFormFields: staticFormFields(
			null,
			true,
			languageOptions,
			cmsByPageId
		),
		onSubmitEntry: formSubmitHandler,
	});

	useEffect(() => {
		setFormFields(staticFormFields(null, true, languageOptions, cmsByPageId));
	}, [languageOptions, cmsByPageId]);

	const handleGalleryClick = () => {
		setShowGallery(true);
	};

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
		header,
		validation,
		setHeader,
		formFields,
		setFormFields,
		languageData,
		showGallery,
		setShowGallery,
		handleGalleryClick,
		imageComponent,
		languageOptions,
	};
};

export default useEditCms;
