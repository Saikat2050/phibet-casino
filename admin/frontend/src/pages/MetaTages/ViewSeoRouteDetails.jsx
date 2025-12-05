import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { getASeoRouteStart } from '../../store/actions';
import { Status } from './SeoRoutesListCol';

const ViewSeoRouteDetails = () => {
	const { seoRouteDetails, seoRouteDetailsLoading } = useSelector(
		(state) => state.SeoData
	);
	const { id } = useParams();
	const dispatch = useDispatch();

	useEffect(() => {
		if (id) {
			dispatch(getASeoRouteStart({ seoPageId: id }));
		}
	}, [id]);

	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs
					showRightInfo={false}
					showBackButton
					breadcrumbItem="Back"
				/>
				<Card>
					<CardBody>
						<h6 className="mb-3 fw-semibold">Route Details</h6>
						{seoRouteDetailsLoading ? (
							<Row>
								<Col lg={12}>
									<Row>
										<Col lg={2}>Fetching...</Col>
									</Row>
								</Col>
							</Row>
						) : (
							<Row>
								<Col lg={12}>
									<Row>
										<Col lg={2}>
											<div className="mt-1">Slug: </div>
										</Col>
										<Col lg={10}>
											<div className="mt-1">
												{seoRouteDetails?.seoPage?.slug}
											</div>
										</Col>
									</Row>
									<Row>
										<Col lg={2}>
											<div className="mt-1">Meta Title: </div>
										</Col>
										<Col lg={10}>
											<div className="mt-1">
												{seoRouteDetails?.seoPage?.title}
											</div>
										</Col>
									</Row>

									<Row>
										<Col lg={2}>
											<div className="mt-1">Meta Description: </div>
										</Col>
										<Col lg={10}>
											<div className="mt-1">
												{seoRouteDetails?.seoPage?.description}
											</div>
										</Col>
									</Row>

									<Row>
										<Col lg={2}>
											<div className="mt-1">No Index: </div>
										</Col>
										<Col lg={10}>
											<div className="mt-1">
												<Status value={seoRouteDetails?.seoPage?.noIndex} />
											</div>
										</Col>
									</Row>

									<Row>
										<Col lg={2}>
											<div className="mt-1">Canonical Url: </div>
										</Col>
										<Col lg={10}>
											<div className="mt-1">
												{seoRouteDetails?.seoPage?.canonicalUrl ? (
													seoRouteDetails?.seoPage?.canonicalUrl
												) : (
													<span>-</span>
												)}
											</div>
										</Col>
									</Row>
								</Col>
							</Row>
						)}
					</CardBody>
				</Card>
			</Container>
		</div>
	);
};

export default ViewSeoRouteDetails;
