/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-restricted-syntax */
import React, { useMemo, useEffect, useState } from 'react';
import { Card, Col } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import CopyToClipboard from 'react-copy-to-clipboard';
import useForm from '../../../components/Common/Hooks/useFormModal';
import {
	getLanguagesStart,
	createSaCms,
	getImageGallery,
} from '../../../store/actions';

import {
	getInitialValues,
	createCmsNewSchema,
	staticFormFields,
} from '../formDetails';

import { showToastr } from '../../../utils/helpers';
import { modules } from '../../../constants/permissions';
import ButtonList from '../../../components/Common/ButtonList';

const useCreateCms = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [showGallery, setShowGallery] = useState(false);

	const { languageData } = useSelector((state) => state.CasinoManagementData);
	const { imageGallery } = useSelector((state) => state.EmailTemplate);
	const [imageComponent, setImageComponent] = useState();

	const formSubmitHandler = (values) => {
		dispatch(createSaCms({ cmsData: { ...values }, navigate }));
	};

	const onChangeRowsPerPage = (value) => {
		setItemsPerPage(value);
	};

	const languageOptions = useMemo(() => {
		if (languageData) {
			return languageData?.languages?.map((item) => ({
				optionLabel: item?.name,
				value: item.code,
			}));
		}
		return [];
	}, [languageData]);

	useEffect(() => {
		dispatch(getLanguagesStart());
		dispatch(getImageGallery());
	}, []);

	const { header, validation, setHeader, formFields, setFormFields } = useForm({
		header: 'Create CMS',
		initialValues: getInitialValues(),
		validationSchema: createCmsNewSchema(languageOptions),
		staticFormFields: staticFormFields(languageOptions),
		onSubmitEntry: formSubmitHandler,
	});

	useEffect(() => {
		setFormFields(staticFormFields(null, null, languageOptions));
	}, [languageOptions]);

	const handleCreateClick = (e) => {
		e.preventDefault();
		navigate('create');
	};

	const handleGalleryClick = (e) => {
		setShowGallery(true);
	};

	const buttonList = useMemo(() => [
		{
			label: 'Create',
			handleClick: handleCreateClick,
			link: '#!',
			module: modules.page,
			operation: 'C',
		},
	]);

	const actionList = <ButtonList buttonList={buttonList} />;

	useEffect(() => {
		if (imageGallery?.length) {
			setImageComponent(
				<div
					className="d-flex justify-content-center flex-wrap gap-3 dropzone-previews mt-3"
					id="file-previews"
				>
					{imageGallery.map((f, i) => (
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
		buttonList,
		formFields,
		setFormFields,
		languageData,
		onChangeRowsPerPage,
		showGallery,
		setShowGallery,
		handleGalleryClick,
		imageComponent,
		languageOptions,
		actionList,
	};
};

export default useCreateCms;
