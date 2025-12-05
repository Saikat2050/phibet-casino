/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-nested-ternary */

import React from 'react';
import { Badge, Card, Col, Row } from 'reactstrap';
import PropTypes from 'prop-types';
import Parser from 'html-react-parser';
import {
	BONUS_TYPES,
	bonusTypes,
	checkLabels,
	daysLabels,
	wageringRequirementType,
} from '../constants';
import { selectedLanguage } from '../../../constants/config';

const GeneralDetails = ({ bonusDetails }) => (
	<>
		<Row>
			<Col sm={12}>
				<Card className="p-3 h-90">
					<Row>
						<Col sm={2}>
							<h6 className="text-nowrap font-weight-bold">Promotion Title:</h6>
						</Col>
						<Col>
							<p>{bonusDetails?.promotionTitle?.[selectedLanguage] || '-'}</p>
						</Col>
					</Row>

					{/* <Row>
						<Col>
							<h6 className="text-nowrap font-weight-bold">Segments:</h6>
						</Col>
						<Col>
							{gameBonusSegment?.length > 0 &&
								gameBonusSegment?.map((tagId) => (
									<Badge className="badge-soft-secondary me-1">
										{tagId?.tag || '-'}
									</Badge>
								))}
						</Col>
					</Row> */}

					{bonusDetails?.visibleInPromotions && (
						<Row>
							<Col sm={2}>
								<h6 className="text-nowrap font-weight-bold">Valid on Days:</h6>
							</Col>
							<Col>
								{daysLabels?.map((day, idx) => (
									<Col
										key={day}
										className="d-flex"
										style={{
											verticalAlign: 'middle',
											justifyContent: 'flex-start',
										}}
									>
										<p>{day}</p>
										{`${bonusDetails?.validOnDays}`?.[idx] && (
											<div
												className="rounded-circle mt-2 mx-2"
												style={{
													width: '10px',
													height: '10px',
													background: '#1aa509',
												}}
											/>
										)}
									</Col>
								))}
							</Col>
						</Row>
					)}

					<Row>
						<Col sm={2}>
							<h6 className="font-weight-bold text-nowrap">Bonus Type:</h6>
						</Col>
						<Col>
							<p>
								{bonusTypes?.find(
									({ value }) => value === bonusDetails?.bonusType
								)?.label || '-'}
							</p>
						</Col>
					</Row>

					{bonusDetails?.bonusType === BONUS_TYPES.FREESPINS && (
						<Row>
							<Col sm={2}>
								<h6 className="font-weight-bold text-nowrap">Quantity:</h6>
							</Col>
							<Col>
								<p>{bonusDetails?.quantity}</p>
							</Col>
						</Row>
					)}

					{bonusDetails?.bonusType === BONUS_TYPES.DEPOSIT && (
						<Row>
							<Col sm={2}>
								<h6 className="font-weight-bold text-nowrap">
									Bonus Percentage
								</h6>
							</Col>
							<Col>
								<p>{bonusDetails?.depositBonusPercent}%</p>
							</Col>
						</Row>
					)}
					{!bonusDetails?.bonusType === BONUS_TYPES.FREESPINS &&
						bonusDetails?.bonusType !== BONUS_TYPES.JOINING && (
							<>
								<Row>
									<Col sm={2}>
										<h6 className="font-weight-bold text-nowrap">
											Wagering Type:
										</h6>
									</Col>
									<Col>
										<p>
											{
												wageringRequirementType?.find(
													(val) =>
														val.value === bonusDetails?.wageringRequirementType
												)?.label
											}
										</p>
									</Col>
								</Row>
								<Row>
									<Col sm={2}>
										<h6 className="font-weight-bold text-nowrap">
											Wagering Multiplier :
										</h6>
									</Col>
									<Col>
										<p>{bonusDetails?.wageringMultiplier}</p>
									</Col>
								</Row>
							</>
						)}
					{/* <Row>
						<Col>
							<h6 className="font-weight-bold text-nowrap">Days To Clear:</h6>
						</Col>
						<Col>
							<p>{bonusDetails?.daysToClear}</p>
						</Col>
					</Row> */}
					{/* {bonusDetails?.bonusType === BONUS_TYPES.FREESPINS && (
					<Row>
						<Col>
							<h6 className="font-weight-bold text-nowrap">Bet Level:</h6>
						</Col>
						<Col>
							<p>{bonusDetails?.other?.betLevel}</p>
						</Col>
					</Row>
				)} */}
					{/* {bonusDetails?.claimedCount > 0 && (
						<Row>
							<Col>
								<h6 className="font-weight-bold text-nowrap">Claimed count:</h6>
							</Col>
							<Col>
								<p>{bonusDetails?.claimedCount}</p>
							</Col>
						</Row>
					)} */}
					{checkLabels(bonusDetails?.bonusType).map(({ label, value }) => (
						<Row key={label}>
							<Col sm={2}>
								<h6 className="font-weight-bold text-nowrap">{label}:</h6>
							</Col>
							<Col>
								{bonusDetails?.[value] ? (
									<Badge className="bg-success">Yes</Badge>
								) : (
									<Badge className="bg-danger">No</Badge>
								)}
							</Col>
						</Row>
					))}

					{/* {![BONUS_TYPES.JOINING, BONUS_TYPES.DAILY].includes(
						bonusDetails?.bonusType
					) && (
							<Row>
								<Col sm={1}>
									<h6 className="font-weight-bold text-nowrap">Show Validity:</h6>
								</Col>
								<Col>
									<Badge
										className="mb-3"
										bg={
											bonusDetails?.other?.showBonusValidity ? 'success' : 'dark'
										}
									>
										{bonusDetails?.other?.showBonusValidity ? (
											<i className="mdi mdi-check-outline" />
										) : (
											<i className="mdi mdi-clock-outline" />
										)}
									</Badge>
								</Col>
							</Row>
						)} */}
				</Card>
			</Col>

			{/* {bonusDetails?.bonusType === BONUS_TYPES.BET &&
				<Col sm={4}>
					<Card className="p-3 h-90">
						<Row>
						<Col sm={4}>
							<h6 className="font-weight-bold text-nowrap">Code:</h6>
						</Col>
						<Col>
							<p>{bonusDetails?.code}</p>
						</Col>
					</Row>
						{bonusDetails?.bonusType !== BONUS_TYPES.JOINING && (
						<Row>
							<Col sm={4}>
								<h6 className="font-weight-bold text-nowrap">Description:</h6>
							</Col>
							<Col>
								{bonusDetails?.description?.EN &&
									Parser(bonusDetails?.description?.EN)}
							</Col>
						</Row>
					)}
						{bonusDetails?.bonusType === BONUS_TYPES.BET && (
						<>
						<Row>
							<Col sm={4}>
								<h6 className="font-weight-bold text-nowrap">Valid From:</h6>
							</Col>
							<Col>
								<p>{moment(bonusDetails?.validFrom).format(YMDFormat)}</p>
							</Col>
						</Row>
						<Row>
							<Col sm={4}>
								<h6 className="font-weight-bold text-nowrap">Valid To:</h6>
							</Col>
							<Col>
								<p>{moment(bonusDetails?.validTo).format(YMDFormat)}</p>
							</Col>
						</Row>
						</>
					)}
						<Row>
						<Col>
							{bonusDetails?.imageUrl && (
								<img
									className="img-thumbnail"
									width="200px"
									src={bonusDetails.imageUrl}
									alt="img"
								/>
							)}
						</Col>
					</Row>
					</Card>
				</Col>
			} */}
		</Row>

		{bonusDetails?.description?.[selectedLanguage] ? (
			<Row>
				<Card className="p-4">
					<>
						<div>
							<h6 className="text-nowrap font-weight-bold">Description:</h6>
						</div>
						<div>{Parser(bonusDetails?.description?.[selectedLanguage])}</div>
					</>
				</Card>
			</Row>
		) : null}
		{bonusDetails?.termAndCondition?.[selectedLanguage] ? (
			<Row>
				<Card className="p-4">
					<>
						<div>
							<h6 className="text-nowrap font-weight-bold">
								Terms and Conditions:
							</h6>
						</div>
						<div>
							{Parser(bonusDetails?.termAndCondition?.[selectedLanguage])}
						</div>
					</>
				</Card>
			</Row>
		) : null}
	</>
);

GeneralDetails.defaultProps = {
	bonusDetails: {},
};

GeneralDetails.propTypes = {
	bonusDetails: PropTypes.objectOf,
};

export default GeneralDetails;
