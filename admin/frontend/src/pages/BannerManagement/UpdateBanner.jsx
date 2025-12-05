import React from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import useBannerForm from './hooks/useBannerForm';
import FormPage from '../../components/Common/FormPage';
import Spinners from '../../components/Common/Spinner';
import ImageBannerGrid from '../../components/Common/ImageBannerGrid';
import usePermission from '../../components/Common/Hooks/usePermission';
import { modules } from '../../constants/permissions';
import Breadcrumb from '../../components/Common/Breadcrumb';

// eslint-disable-next-line react/prop-types
const UpdateBanner = ({ isView = false }) => {
	const {
		validation,
		formFields,
		isEditSABannersLoading,
		banners,
		handleDesktopDelete,
		handleMobileDelete,
		bannerName,
		SABannersloading,
	} = useBannerForm();
	const { isGranted } = usePermission();

	const hasEditPermission = isGranted(modules.banner, 'U');

	return (
		<Container className="mt-5">
			<Breadcrumb
				title="Banner Management"
				breadcrumbItem={bannerName ? bannerName?.toUpperCase() : ''}
				titleLink="/banner-management"
				leftTitle={
					<>
						<i className="fas fa-angle-left" /> Back
					</>
				}
			/>
			{hasEditPermission &&
				!isView &&
				(SABannersloading ? (
					<Spinners
						color="primary"
						className="position-absolute top-0 start-50"
					/>
				) : (
					<FormPage
						validation={validation}
						responsiveFormFields={formFields}
						customColClasses=""
						colOptions={{ xs: 12, sm: 4, md: 4, lg: 4, xl: 4, xxl: 4 }}
						isSubmitLoading={isEditSABannersLoading}
					/>
				))}

			<Row>
				<Col>
					<Card>
						<CardBody>
							<CardTitle>Desktop Banners</CardTitle>
							<div
								className="d-flex justify-content-start flex-wrap gap-3 dropzone-previews mt-3"
								id="file-previews"
							>
								<Row className="justify-content-start w-100">
									{SABannersloading ? (
										<Spinners
											color="primary"
											className="position-absolute top-0 start-50"
										/>
									) : (
										<ImageBannerGrid
											handleDelete={handleDesktopDelete}
											bannersList={banners?.desktopBanner || []}
											isGranted={isGranted}
											imageColClass="col-sm-4 col-md-3 col-lg-2 p-0 mb-4"
											isView={isView}
										/>
									)}
								</Row>
							</div>
						</CardBody>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col>
					<Card>
						<CardBody>
							<CardTitle>Mobile Banners</CardTitle>
							<div
								className="d-flex justify-content-start flex-wrap gap-3 dropzone-previews mt-3"
								id="file-previews"
							>
								<Row className="justify-content-start w-100">
									{SABannersloading ? (
										<Spinners
											color="primary"
											className="position-absolute top-0 start-50"
										/>
									) : (
										<ImageBannerGrid
											handleDelete={handleMobileDelete}
											bannersList={banners?.mobileBanner || []}
											isGranted={isGranted}
											imageColClass="col-sm-4 col-md-3 col-lg-2 p-0 mb-4"
											isView={isView}
										/>
									)}
								</Row>
							</div>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default React.memo(UpdateBanner);
