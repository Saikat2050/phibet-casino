/* eslint-disable react/prop-types */
import React from 'react';
import { Col, Card, CardBody } from 'reactstrap';
import ReactApexChart from 'react-apexcharts';
import DivLoader from '../../../components/Common/Loader/divLoader';
import { NoDataLoggedInContainer } from '../style';

const LoggedInPlayer = (props) => {
	const { loggedInOptions, statsDataLoading } = props;
	return (
		<Col xl="12">
			<Card className="logged-player">
				<CardBody>
					<h4 className="card-title mb-4 d-flex align-items-center">
						<span className="mdi mdi-account-multiple fs-1 me-3 text-success" />{' '}
						Logged In Players
					</h4>
					<div>
						<div id="donut-chart">
							{!statsDataLoading && loggedInOptions?.series?.length > 0 && (
								<ReactApexChart
									options={loggedInOptions}
									series={loggedInOptions.series}
									type="donut"
									height={320}
									className="apex-charts"
								/>
							)}
							{statsDataLoading && (
								<NoDataLoggedInContainer>
									<DivLoader isSmall loaderVarient="text-secondary" />
								</NoDataLoggedInContainer>
							)}
						</div>
					</div>
				</CardBody>
			</Card>
		</Col>
	);
};

export default LoggedInPlayer;
