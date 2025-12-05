/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import React from 'react';
import { Card, Col, Container, Row, Spinner } from 'reactstrap';
import moment from 'moment';
import { useSelector } from 'react-redux';
import useEditLimits from './hooks/useEditLimits';
import SingleLimitCard from './components/SingleLimitCard';
import SelfExclusionCard from './components/SelfExclusionCard';
import { userLimitTypes } from '../../utils/constant';

const RSG = ({ userDetails, userId, userDetailsLoading }) => {
	const { limitLabels, userLimits } = useEditLimits({ userDetails });

	const defaultCurrency = useSelector(
		(state) => state.Currencies.defaultCurrency
	);

	const selfExclusionLimit = userLimits?.filter(
		(key) => key.key === 'self_exclusion'
	)?.[0];

	return (
		<Container fluid>
			<Card className="p-2">
				{userDetailsLoading ? (
					<Spinner
						color="primary"
						className="position-absolute top-50 start-50"
					/>
				) : (
					<Row>
						{limitLabels?.map((limit) => (
							<Col md={4}>
								<SingleLimitCard
									limit={limit}
									currencyCode={defaultCurrency?.code || 'USD'}
									userId={userId}
								/>
							</Col>
						))}
						{/* <Col>
							<LimitCard
								limit={{
									placeholder: 'Enter Days',
									label: 'Take A Break',
									name: 'Time Period',
									value: userDetails?.selfExclusion
										? Math.ceil(
												Math.abs(
													new Date(userDetails?.selfExclusion) - new Date()
												) /
													(1000 * 60 * 60 * 24)
										  )
										: '',
								}}
								userId={userId}
							/>
						</Col>
						<Col>
							<LimitCard
								limit={{
									label: 'Session Limit',
									name: 'Time Period',
									placeholder: 'Enter Hours',
									value: userLimits?.timeLimit || '',
								}}
								userId={userId}
							/>
						</Col> */}
						<Col lg={4}>
							<SelfExclusionCard
								limit={{
									label: 'Self Exclusion',
									type: 'SELF_EXCLUSION',
									key: userLimitTypes.selfExclusion,
									days:
										selfExclusionLimit?.value === 'permanent'
											? -1
											: selfExclusionLimit?.expireAt
											? Math.abs(
													Math.round(
														moment().diff(
															selfExclusionLimit?.expireAt,
															'days',
															true
														)
													)
											  )
											: 0,
									// portal: userLimits?.selfExclusionType,
								}}
								userId={userId}
								currencyCode={defaultCurrency?.code || 'USD'}
							/>
						</Col>
					</Row>
				)}
			</Card>
		</Container>
	);
};

export default RSG;
