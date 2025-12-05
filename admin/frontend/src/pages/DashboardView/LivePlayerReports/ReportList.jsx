/* eslint-disable react/prop-types */
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, CardBody, Col, Row, UncontrolledTooltip } from 'reactstrap';
import { addCommasToNumber } from '../../../utils/helpers';

const ReportList = ({ reports }) => {
	const generateChartOptions = (change) => ({
		chart: { sparkline: { enabled: true } },
		stroke: { curve: 'smooth', width: 2 },
		colors: [change < 0 ? '#ff6347' : '#28a745'],
		fill: {
			type: 'gradient',
			gradient: {
				shadeIntensity: 1,
				inverseColors: false,
				opacityFrom: 0.45,
				opacityTo: 0.05,
				stops: [25, 100, 100, 100],
			},
		},
		tooltip: {
			fixed: { enabled: false },
			x: { show: false },
			marker: { show: false },
		},
	});

	return (
		<Row>
			{reports.map((report, key) => {
				const change = report.diff();
				return (
					// eslint-disable-next-line react/no-array-index-key
					<Col sm={12} md={6} lg={6} xl={4} xxl={3} key={key}>
						<Card className="styled-card">
							<CardBody className="p-0 py-1 ps-1">
								<div className="d-flex mb-2 align-items-center">
									<p
										className="text-muted card-title mb-0"
										style={{ marginRight: '2px' }}
									>
										{report.title}
									</p>
									{report?.tooltip && report?.toolTipId && (
										<span id={`id-${report?.toolTipId}`}>
											<i className="fa fa-info-circle cursor-pointer" />
											<UncontrolledTooltip
												placement="top"
												target={`id-${report?.toolTipId}`}
											>
												{report?.tooltip}
											</UncontrolledTooltip>
										</span>
									)}
								</div>
								<Row className="align-items-center">
									<Col xs="7">
										<div className="value-container d-flex">
											<h4 className="card-value mb-0">
												{addCommasToNumber(report.value) ?? 0.0}
											</h4>
											{change && (
												<div
													className={`badge percentage-change ${
														change < 0
															? 'bg-danger-subtle text-danger'
															: 'bg-success-subtle text-success'
													} ml-5`}
												>
													{change}%
												</div>
											)}
										</div>
									</Col>
									<Col xs="5">
										<ReactApexChart
											options={generateChartOptions(change)}
											series={report.series}
											type="area"
											height={50}
											className="apex-chart"
										/>
									</Col>
								</Row>
							</CardBody>
						</Card>
					</Col>
				);
			})}
		</Row>
	);
};

export default ReportList;
