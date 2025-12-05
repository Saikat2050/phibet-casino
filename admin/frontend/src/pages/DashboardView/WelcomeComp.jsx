/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';

import profileImg from '../../assets/images/profile-img.png';

const WelcomeComp = () => {
	const { superAdminUser } = useSelector((state) => state.PermissionDetails);
	// const name = superAdminUser.firstName || superAdminUser.adminUsername || 'A';
	return (
		<Card className="overflow-hidden">
			<div className="bg-primary-subtle">
				<Row>
					<Col xs="7">
						<div className="text-primary p-3">
							<h5 className="text-primary">Welcome Back !</h5>
						</div>
					</Col>
					<Col xs="5" className="">
						<img src={profileImg} alt="" className="img-fluid" />
					</Col>
				</Row>
			</div>
			<CardBody className="pt-0">
				<Row>
					<Col xl={3} sm="3">
						<div className="avatar-md profile-user-wid mb-4 dashboard-prof-logo">
							<p className="profile-logo-avatar">
								{
									`${
										superAdminUser?.firstName || superAdminUser?.username
									}`?.[0]
								}
							</p>
						</div>
					</Col>

					<Col xl={9} sm="9" className="align-self-end">
						<div className="pt-4">
							<Row>
								<Col xs="12" className="justify-content-end d-flex">
									<h5 className="font-size-15 text-truncate">
										{`${superAdminUser?.firstName || ''} ${
											superAdminUser?.lastName || ''
										}` ||
											superAdminUser?.username ||
											''}
									</h5>
								</Col>
								<Col xs="12 mt-3">
									<Link to="/profile" className="btn btn-primary  btn-sm">
										View Profile <i className="mdi mdi-arrow-right ms-1" />
									</Link>
								</Col>
							</Row>
						</div>
					</Col>
				</Row>
			</CardBody>
		</Card>
	);
};
export default WelcomeComp;
