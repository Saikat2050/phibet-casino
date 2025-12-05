import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import PropTypes from 'prop-types';

const OverView = ({ details, t }) => {
	const overViewCol = [
		{
			row: 1,
			firstCol: { name: 'firstName', label: 'First Name', icon: 'account' },
			secondCol: { name: 'lastName', label: 'Last Name', icon: 'account' },
		},
		{
			row: 2,
			firstCol: { name: 'email', label: 'Email', icon: 'email' },
			secondCol: {
				name: 'username',
				label: 'Username',
				icon: 'account-details',
			},
		},
		{
			row: 3,
			firstCol: { name: 'role', label: 'Role', icon: 'account-cog' },
			// secondCol: { name: 'group', label: 'Group', icon: 'account-group' },
		},
	];

	return (
		<Row>
			<Col lg={12}>
				<Card>
					<CardBody>
						{overViewCol.map((item) => (
							<Row key={item.row} className="list-unstyled hstack p-3">
								<Col>
									<div className="d-flex">
										<i
											className={`mdi mdi-${item.firstCol.icon} font-size-18 text-primary`}
										/>
										<div className="ms-3">
											<h6 className="mb-1 fw-semibold">
												{t(`${item.firstCol.label}`)} :{' '}
											</h6>
											<span className="text-muted">
												{item.firstCol.name !== 'role'
													? details[item.firstCol.name] || '-'
													: details?.adminRole?.name || '-'}
											</span>
										</div>
									</div>
								</Col>
								{!!item.secondCol && (
									<Col>
										<div className="d-flex">
											<i
												className={`mdi mdi-${item.secondCol.icon} font-size-18 text-primary`}
											/>
											<div className="ms-3">
												<h6 className="mb-1 fw-semibold">
													{t(`${item.secondCol.label}`)} :{' '}
												</h6>
												<span className="text-muted">
													{details[item.secondCol.name] || '-'}
												</span>
											</div>
										</div>
									</Col>
								)}
							</Row>
						))}
					</CardBody>
				</Card>
			</Col>
		</Row>
	);
};

OverView.propTypes = {
	details: PropTypes.string.isRequired,
	t: PropTypes.func.isRequired,
};

export default OverView;
