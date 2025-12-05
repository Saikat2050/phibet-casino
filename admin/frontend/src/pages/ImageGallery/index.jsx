import React from 'react';

import { Row, Col, Card, CardBody, Container } from 'reactstrap';

// Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import Spinners from '../../components/Common/Spinner';
import { projectName } from '../../constants/config';

import useImageGallery from './hooks/useImageGallery';
import usePermission from '../../components/Common/Hooks/usePermission';
import { modules } from '../../constants/permissions';
import CrudSection from '../../components/Common/CrudSection';
import ModalView from '../../components/Common/Modal';
import ImageUploader from '../../components/Common/ImageUploader';
import ImageGalleryGrid from '../../components/Common/ImageGalleryGrid';

const ImageGallery = () => {
	// meta title
	document.title = projectName;
	const { isGranted } = usePermission();
	const {
		imageGallery,
		imageGalleryLoading,
		handleFileUpload,
		validation,
		buttonList,
		showUpload,
		setShowUpload,
		isUploading,
		handleClear,
		deleteImage,
		showDeletePopup,
		setShowDeletePopup,
	} = useImageGallery();
	return (
		<div className="page-content">
			{isGranted(modules.gallery, 'R') && (
				<Container fluid>
					<Breadcrumbs title="Content Management" breadcrumbItem="Gallery" />
					<Row>
						<Col>
							<Card>
								<CrudSection buttonList={buttonList} title="Images" />
								<CardBody>
									<div
										className="d-flex justify-content-start flex-wrap gap-3 dropzone-previews mt-3"
										id="file-previews"
									>
										<Row className="justify-content-start w-100">
											{imageGalleryLoading ? (
												<Spinners
													color="primary"
													className="position-absolute top-0 start-50"
												/>
											) : (
												<ImageGalleryGrid
													imageGalleryList={imageGallery}
													isGranted={isGranted}
													setShowDeletePopup={setShowDeletePopup}
													imageColClass="col-sm-4 col-md-3 col-lg-2 p-0 mb-4"
												/>
											)}
										</Row>
									</div>
								</CardBody>
							</Card>
						</Col>
					</Row>
					<ModalView
						openModal={showUpload}
						toggleModal={() => setShowUpload((prev) => !prev)}
						headerTitle="Upload an Image"
						secondBtnName="Upload"
						className="modal-dialog modal-lg"
						hideFooter
					>
						<ImageUploader
							validateImage={handleFileUpload}
							handleSubmit={validation.handleSubmit}
							error={
								validation.touched.initialstate &&
								validation.errors.initialstate
							}
							uploadedFile={validation.values.initialstate}
							isUploading={isUploading}
							handleClear={handleClear}
						/>
					</ModalView>

					<ModalView
						openModal={showDeletePopup?.showDelete}
						toggleModal={() =>
							setShowDeletePopup({ showDelete: false, fileName: null })
						}
						firstBtnName="Cancel"
						secondBtnClass="btn-danger ms-2"
						handleClick={() => {
							deleteImage(showDeletePopup?.fileName);
							setShowDeletePopup({ showDelete: false });
						}}
						secondBtnName="Delete"
						headerTitle="Images Delete Confirmation"
					>
						<h5>Are you sure you want to delete Images?</h5>
					</ModalView>
				</Container>
			)}
		</div>
	);
};

export default ImageGallery;
