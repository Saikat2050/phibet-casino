/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-nested-ternary */

import React from 'react';
import { Badge, Card, CardHeader, Col, Row } from 'reactstrap';
import PropTypes from 'prop-types';
import Parser from 'html-react-parser';

import { selectedLanguage } from '../../../constants/config';
import NoDataFound from '../../../components/Common/NoDataFound';

const GeneralDetails = ({ paymentDetails }) => (
	<Card className="p-3">
		<Row className="align-items-center">
			{/* <Col sm={4} className="text-align-center">
				{paymentDetails?.image ? (
					<img
						src={paymentDetails?.image}
						alt="Payment Provider"
						style={{ width: '20vw' }}
					/>
				) : (
					<NoDataFound height="200px" width="300px" />
				)}
			</Col> */}
			<Col sm={12}>
				<CardHeader className="mb-4">
					<Row>
						<Col>
							<h3>
								{paymentDetails?.name?.[selectedLanguage]
									? Parser(paymentDetails?.name?.[selectedLanguage])
									: '-'}
							</h3>
						</Col>
					</Row>
				</CardHeader>
			</Col>
			<Col sm={6}>
				{/* <CardHeader className="mb-4">
					<Row>
						<Col>
							<h3>
								{paymentDetails?.name?.[selectedLanguage]
									? Parser(paymentDetails?.name?.[selectedLanguage])
									: '-'}
							</h3>
						</Col>
					</Row>
				</CardHeader> */}
				<Row>
					<Col>
						<h6 className="text-nowrap">Name:</h6>
					</Col>
					<Col>
						<p>
							{paymentDetails?.name?.[selectedLanguage]
								? Parser(paymentDetails?.name?.[selectedLanguage])
								: '-'}
						</p>
					</Col>
				</Row>
				{/* <Row>
					<Col>
						<h6 className="text-nowrap">Title:</h6>
					</Col>
					<Col>
						<p>{paymentDetails?.displayName?.[selectedLanguage] || '-'}</p>
					</Col>
				</Row> */}
				{/* <Row>
					<Col>
						<h6 className="text-nowrap">Description:</h6>
					</Col>
					<Col>
						{paymentDetails?.description?.[selectedLanguage]
							? Parser(paymentDetails?.description?.[selectedLanguage])
							: '-'}
					</Col>
				</Row> */}
				<Row>
					<Col>
						<h6 className="text-nowrap">Category:</h6>
					</Col>
					<Col>
						<p>{paymentDetails?.category?.toUpperCase()}</p>
					</Col>
				</Row>

				<Row>
					<Col>
						<h6 className="text-nowrap">Aggregator:</h6>
					</Col>
					<Col>
						<p>{paymentDetails?.aggregator}</p>
					</Col>
				</Row>

				<Row>
					<Col>
						<h6 className="text-nowrap">Purchase Allowed:</h6>
					</Col>
					<Col>
						<Badge
							className={`mb-3 ${
								paymentDetails?.depositAllowed ? 'bg-success' : 'bg-danger'
							}`}
						>
							{paymentDetails?.depositAllowed ? (
								<i className="mdi mdi-check-outline"> Yes </i>
							) : (
								<i className="mdi mdi-clock-outline"> No </i>
							)}
						</Badge>
					</Col>
				</Row>
				<Row>
					<Col>
						<h6 className="text-nowrap">Redeem Allowed:</h6>
					</Col>
					<Col>
						<Badge
							className={`mb-3 ${
								paymentDetails?.depositAllowed ? 'bg-success' : 'bg-danger'
							}`}
							bg={paymentDetails?.withdrawAllowed ? 'success' : 'dark'}
						>
							{paymentDetails?.withdrawAllowed ? (
								<i className="mdi mdi-check-outline"> Yes </i>
							) : (
								<i className="mdi mdi-clock-outline"> No </i>
							)}
						</Badge>
					</Col>
				</Row>
			</Col>
			<Col sm={6}>
				<Row>
					<Col>
						<h6 className="text-nowrap">Purchase Kyc Required:</h6>
					</Col>
					<Col>
						<Badge
							className={`mb-3 ${
								paymentDetails?.depositKycRequired ? 'bg-success' : 'bg-danger'
							}`}
							bg={paymentDetails?.depositKycRequired ? 'success' : 'dark'}
						>
							{paymentDetails?.depositKycRequired ? (
								<i className="mdi mdi-check-outline"> Yes </i>
							) : (
								<i className="mdi mdi-clock-outline"> No </i>
							)}
						</Badge>
					</Col>
				</Row>

				<Row>
					<Col>
						<h6 className="text-nowrap">Redeem Kyc Required:</h6>
					</Col>
					<Col>
						<Badge
							className={`mb-3 ${
								paymentDetails?.withdrawKycRequired ? 'bg-success' : 'bg-danger'
							}`}
							bg={paymentDetails?.withdrawKycRequired ? 'success' : 'dark'}
						>
							{paymentDetails?.withdrawKycRequired ? (
								<i className="mdi mdi-check-outline"> Yes </i>
							) : (
								<i className="mdi mdi-clock-outline"> No </i>
							)}
						</Badge>
					</Col>
				</Row>

				<Row>
					<Col>
						<h6 className="text-nowrap">Purchase Phone Required:</h6>
					</Col>
					<Col>
						<Badge
							className={`mb-3 ${
								paymentDetails?.depositPhoneRequired
									? 'bg-success'
									: 'bg-danger'
							}`}
							bg={paymentDetails?.depositPhoneRequired ? 'success' : 'dark'}
						>
							{paymentDetails?.depositPhoneRequired ? (
								<i className="mdi mdi-check-outline"> Yes </i>
							) : (
								<i className="mdi mdi-clock-outline"> No </i>
							)}
						</Badge>
					</Col>
				</Row>

				<Row>
					<Col>
						<h6 className="text-nowrap">Redeem Phone Required:</h6>
					</Col>
					<Col>
						<Badge
							className={`mb-3 ${
								paymentDetails?.withdrawPhoneRequired
									? 'bg-success'
									: 'bg-danger'
							}`}
							bg={paymentDetails?.withdrawPhoneRequired ? 'success' : 'dark'}
						>
							{paymentDetails?.withdrawPhoneRequired ? (
								<i className="mdi mdi-check-outline"> Yes </i>
							) : (
								<i className="mdi mdi-clock-outline"> No </i>
							)}
						</Badge>
					</Col>
				</Row>

				<Row>
					<Col>
						<h6 className="text-nowrap">Purchase Profile Required:</h6>
					</Col>
					<Col>
						<Badge
							className={`mb-3 ${
								paymentDetails?.depositProfileRequired
									? 'bg-success'
									: 'bg-danger'
							}`}
							bg={paymentDetails?.depositProfileRequired ? 'success' : 'dark'}
						>
							{paymentDetails?.depositProfileRequired ? (
								<i className="mdi mdi-check-outline"> Yes </i>
							) : (
								<i className="mdi mdi-clock-outline"> No </i>
							)}
						</Badge>
					</Col>
				</Row>

				<Row>
					<Col>
						<h6 className="text-nowrap">Redeem Profile Required:</h6>
					</Col>
					<Col>
						<Badge
							className={`mb-3 ${
								paymentDetails?.withdrawProfileRequired
									? 'bg-success'
									: 'bg-danger'
							}`}
							bg={paymentDetails?.withdrawProfileRequired ? 'success' : 'dark'}
						>
							{paymentDetails?.withdrawProfileRequired ? (
								<i className="mdi mdi-check-outline"> Yes </i>
							) : (
								<i className="mdi mdi-clock-outline"> No </i>
							)}
						</Badge>
					</Col>
				</Row>
			</Col>

			<Col sm={12} className="mt-3">
				<Row>
					<Col sm={3}>
						<h6 className="text-nowrap">Purchase Description:</h6>
					</Col>
					<Col sm={9}>
						{paymentDetails?.depositDescription?.[selectedLanguage]
							? Parser(paymentDetails?.depositDescription?.[selectedLanguage])
							: '-'}
					</Col>
				</Row>
			</Col>

			<Col sm={12} className="mt-3">
				<Row>
					<Col sm={3}>
						<h6 className="text-nowrap">Redeem Description:</h6>
					</Col>
					<Col sm={9}>
						{paymentDetails?.withdrawDescription?.[selectedLanguage]
							? Parser(paymentDetails?.withdrawDescription?.[selectedLanguage])
							: '-'}
					</Col>
				</Row>
			</Col>

			<Col sm={12} className="mt-3">
				<Row>
					<Col sm={6}>Purchase Image:</Col>
					<Col sm={6}>Redeem Image:</Col>
				</Row>
			</Col>

			<Col sm={12} className="mt-3">
				<Row>
					<Col sm={6} className="text-align-center">
						{paymentDetails?.depositImage ? (
							<img
								src={paymentDetails?.depositImage}
								alt="Payment Provider"
								style={{ width: '200px' }}
							/>
						) : (
							<NoDataFound height="200px" width="300px" />
						)}
					</Col>

					<Col sm={6} className="text-align-center">
						{paymentDetails?.withdrawImage ? (
							<img
								src={paymentDetails?.withdrawImage}
								alt="Payment Provider"
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
	paymentDetails: {},
};

GeneralDetails.propTypes = {
	paymentDetails: PropTypes.objectOf,
};

export default GeneralDetails;
