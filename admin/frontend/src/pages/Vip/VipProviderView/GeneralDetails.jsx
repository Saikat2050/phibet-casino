/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-nested-ternary */

import React from 'react';
import { Badge, Card, Col, Row } from 'reactstrap';
import PropTypes from 'prop-types';

// import { selectedLanguage } from '../../../constants/config';
import NoDataFound from '../../../components/Common/NoDataFound';

const GeneralDetails = ({ vipTierDetails }) => (
	<Card className="p-3">
		<Row className="align-items-center">
			<Col sm={6}>
				<Row>
					<Col>
						<h6 className="text-nowrap">Level:</h6>
					</Col>
					<Col>
						<p>{vipTierDetails?.level}</p>
					</Col>
				</Row>
				<Row>
					<Col>
						<h6 className="text-nowrap">Name:</h6>
					</Col>
					<Col>
						<p>{vipTierDetails?.name}</p>
					</Col>
				</Row>
				<Row>
					<Col>
						<h6 className="text-nowrap">XP Requirement</h6>
					</Col>
					<Col>
						<p>{vipTierDetails?.xpRequirement}</p>
					</Col>
				</Row>
				<Row>
					<Col>
						<h6 className="text-nowrap">Monthly Percentage</h6>
					</Col>
					<Col>
						<p>{vipTierDetails?.monthlyPercentage}</p>
					</Col>
				</Row>
				<Row>
					<Col>
						<h6 className="text-nowrap">Weekly Percentage</h6>
					</Col>
					<Col>
						<p>{vipTierDetails?.weeklyPercentage}</p>
					</Col>
				</Row>
				{/* <Row>
						<Col>
							<h6 className="text-nowrap">Rakeback Percentage</h6>
						</Col>
						<Col>
							<p>{vipTierDetails?.rakebackPercentage}</p>
						</Col>
					</Row> */}
				<Row>
					<Col>
						<h6 className="text-nowrap">Issue Spin Wheel</h6>
					</Col>
					<Col>
						<p>{vipTierDetails?.issueSpinWheel}</p>
					</Col>
				</Row>
				<Row>
					<Col>
						<h6 className="text-nowrap">Tier Up Bonus GC</h6>
					</Col>
					<Col>
						<p>{vipTierDetails?.tierUpBonus?.gc}</p>
					</Col>
				</Row>
				<Row>
					<Col>
						<h6 className="text-nowrap">Tier Up Bonus SC</h6>
					</Col>
					<Col>
						<p>{vipTierDetails?.tierUpBonus?.sc}</p>
					</Col>
				</Row>
				<Row>
					<Col>
						<h6 className="text-nowrap">Active</h6>
					</Col>
					<Col>
						{/* <p>
							{vipTierDetails?.isActive}
						</p> */}
						{vipTierDetails?.isActive ? (
							<Badge className="bg-success">Active</Badge>
						) : (
							<Badge className="bg-danger">In Active</Badge>
						)}
					</Col>
				</Row>
			</Col>

			{/* <Col sm={12} className="mt-3">
					<Row>
						<Col sm={6}>Image:</Col>
					</Row>
						</Col> */}

			<Col sm={12} className="mt-3">
				<Row>
					<Col sm={6} className="text-align-center">
						{vipTierDetails?.icon ? (
							<img
								src={vipTierDetails?.icon}
								alt="Vip Provider"
								style={{ width: '200px' }}
							/>
						) : (
							<NoDataFound height="200px" width="300px" />
						)}
					</Col>
				</Row>
			</Col>
		</Row>
	</Card>
);

GeneralDetails.defaultProps = {
	vipTierDetails: {},
};

GeneralDetails.propTypes = {
	vipTierDetails: PropTypes.objectOf,
};

export default GeneralDetails;
