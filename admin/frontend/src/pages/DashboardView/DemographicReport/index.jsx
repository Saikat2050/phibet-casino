/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import FlatPickr from 'react-flatpickr';
import { CSVLink } from 'react-csv';
import { isEmpty } from 'lodash';
import GraphicChart from './GraphicChart';
import { dateConstants } from '../constant';
import useDemoGraphicReport from './hooks/useDemoGraphicReport';
import { modules } from '../../../constants/permissions';
import usePermission from '../../../components/Common/Hooks/usePermission';
import { DEMOGRAPHY } from '../../../constants/messages';
import { getDashboardFilterText } from '../../../utils/helpers';
import { flatPickerFormat } from '../../../constants/config';
import { MultiSelectOption } from '../../../helpers/customForms';

const DemographicReport = () => {
	const { isGranted } = usePermission();
	const {
		formattedDemoGraphicData,
		demoDateOptions: { selected, fromDate, toDate },
		setDemoDateOptions,
		isDemographicLoading,
		countries,
		setCountries,
		countrySelectOptions,
		layoutModeType,
	} = useDemoGraphicReport();

	return (
		<Col xl="12">
			<Card>
				<CardBody>
					{isGranted(modules.demography, 'R') ? (
						<>
							<Row className="mb-2 d-flex align-items-center">
								<Col xl={selected === 'custom' ? '3' : '6'}>
									<div className="d-flex align-items-center">
										<h4 className="card-title font-size-16 d-flex align-items-center">
											<span className="mdi mdi-map-marker-radius fs-1 me-3 text-success" />
											Demographic Report
										</h4>
									</div>
								</Col>
								{selected === 'custom' ? (
									<Col xl="3" className="pe-1">
										<FlatPickr
											className="form-control"
											date={[fromDate, toDate]}
											placeholder="Select Date Range"
											options={{
												mode: 'range',
												dateFormat: flatPickerFormat,
												maxDate: 'today',
											}}
											onChange={(date) => {
												setDemoDateOptions((prev) => ({
													...prev,
													fromDate: date[0],
													toDate: date[1],
												}));
											}}
										/>
									</Col>
								) : null}
								<Col xl="6">
									<div className="d-flex justify-content-between align-items-center">
										<select
											value={selected}
											className="form-select me-2"
											onChange={(e) => {
												setDemoDateOptions((prev) => ({
													...prev,
													fromDate: '',
													toDate: '',
													selected: e.target.value,
												}));
											}}
										>
											{dateConstants?.map((item) => (
												<option value={item.value} key={item.value}>
													{item.label}
												</option>
											))}
										</select>
										<MultiSelectOption
											placeholder="Select Countries"
											options={countrySelectOptions}
											value={countries}
											setOption={(sel) => {
												setCountries(sel);
											}}
										/>
										{!isEmpty(formattedDemoGraphicData) && (
											<CSVLink
												data={formattedDemoGraphicData || []}
												filename="downloaded_data.csv"
												className="btn btn-md btn-primary"
											>
												<i className="bx bx-download align-baseline" />
											</CSVLink>
										)}
									</div>
								</Col>
							</Row>
							<Row>
								<Col xl="12">
									<GraphicChart
										chartData={formattedDemoGraphicData}
										layoutModeType={layoutModeType}
										isLoading={isDemographicLoading}
									/>
								</Col>
							</Row>
							<Row>
								<div>{getDashboardFilterText(selected, fromDate, toDate)}</div>
							</Row>
						</>
					) : (
						<h6>{DEMOGRAPHY}</h6>
					)}
				</CardBody>
			</Card>
		</Col>
	);
};

export default DemographicReport;
