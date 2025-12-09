/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Col, Card, CardBody, UncontrolledTooltip, Row } from 'reactstrap';
import FlatPickr from 'react-flatpickr';
import { CSVLink } from 'react-csv';
import Select from 'react-select';
import TableContainer from '../../../components/Common/Table';
import { flatPickerFormat, tableCustomClass } from '../../../constants/config';
import { dateConstants, TIMEZONES } from '../constant';
import { CustomSelectField } from '../../../helpers/customForms';
import { BONUS_REPORT } from '../../../constants/messages';
import { modules } from '../../../constants/permissions';
import usePermission from '../../../components/Common/Hooks/usePermission';
import { getDashboardFilterText } from '../../../utils/helpers';
import useBonusReport from './hooks/useBonusReport';

const BonusReport = () => {
	const {
		columns,
		bonusReportFormatted,
		bonusReportLoading,
		bonusReportDateOption: { selected, fromDate, toDate },
		setBonusReportDateOption,
		tagBy,
		setTagBy,
		timezone,
		setTimezone,
		handleDateOptionChange,
		handleRefresh,
		bonusReportFormattedCSV,
		playerOptions,
	} = useBonusReport();
	const { isGranted } = usePermission();

	return (
		<Col xl="12">
			<Card>
				<CardBody>
					{isGranted(modules.bonusReport, 'R') ? (
						<>
							<Row>
								<Col xl={6} className="d-flex align-items-center my-2">
									<h4 className="card-title font-size-18 mb-3 d-flex align-items-center">
										<span className="mdi mdi-account-tie fs-1 me-3 text-dashboard" />
										All Bonuses Report
									</h4>
									<i
										role="button"
										tabIndex="0"
										className="mdi mdi-refresh mx-2 font-size-24 mb-3"
										style={{ cursor: 'pointer' }}
										id="refreshBonusReport"
										onClick={handleRefresh}
										onKeyDown={(e) => {
											if (e.key === 'Enter') {
												handleRefresh();
											}
										}}
									/>
									<UncontrolledTooltip placement="top" target="refreshBonusReport">	Refresh</UncontrolledTooltip>
								</Col>
								<Col xl={6} className="float-end my-2">
									<div className="d-flex justify-content-between align-items-center">
										<div className="game-report-dashboard-filter">
											<label
												className="game-report-dashboard-filter-label"
												htmlFor="playerTag"
											>
												Player
											</label>
											<CustomSelectField
												name="playerPerformanceTag"
												type="select"
												value={tagBy}
												className="mx-2"
												placeholder="Player By"
												key="my_unique_select_key_tag"
												onChange={(e) => {
													setTagBy(e.target.value);
												}}
												options={playerOptions?.map((item) => (
													<option value={item.value} key={item.value}>
														{item.label}
													</option>
												))}
											/>
										</div>

										{selected === 'custom' ? (
											<FlatPickr
												className="form-control mx-2 px-3"
												date={[fromDate, toDate]}
												placeholder="Select Date Range"
												options={{
													mode: 'range',
													dateFormat: flatPickerFormat,
													maxDate: 'today',
												}}
												onChange={(date) => {
													setBonusReportDateOption((prev) => ({
														...prev,
														fromDate: date[0],
														toDate: date[1],
													}));
												}}
											/>
										) : null}
										<div className="game-report-dashboard-filter">
											<label
												style={{ marginLeft: '1px' }}
												className="game-report-dashboard-filter-label"
												htmlFor="gameReportDateFilter"
											>
												Date filter
											</label>
											<CustomSelectField
												name="playerReportDateFilter"
												type="select"
												onChange={handleDateOptionChange}
												value={selected}
												key="my_unique_select_key__playerReportDateFilter"
												options={dateConstants?.map((item) => (
													<option value={item.value} key={item.value}>
														{item.label}
													</option>
												))}
											/>
										</div>
										<div className="game-report-dashboard-filter">
											<label
												className="game-report-dashboard-filter-label"
												htmlFor="timezone"
											>
												Timezone
											</label>
											<Select
												options={TIMEZONES}
												value={TIMEZONES.find((tz) => tz.code === timezone)}
												onChange={(selectedOption) =>
													setTimezone(selectedOption.code)
												}
												formatOptionLabel={(option) =>
													`${option.label} (${option.code}) ${option.value}`
												}
												isSearchable={false}
												className="mx-2 w-100"
											/>
										</div>
										<CSVLink
											data={bonusReportFormattedCSV || []}
											filename="downloaded_data.csv"
											className="btn btn-primary dashboard-export-btn w-80"
										>
											<i className="bx bx-download align-baseline" />
										</CSVLink>
									</div>
								</Col>
								{/* <TableContainer
									isLoading={bonusReportLoading}
									columns={columns || []}
									data={bonusReportFormatted}
									isGlobalFilter={false}
									tableClass={`table-bordered align-middle table-striped nowrap ${tableCustomClass}`}
									isShowColSettings={false}
									tbodyHeight={bonusReportLoading ? '230px' : ''}
								/> */}
							</Row>
							<Row>
								<div>{getDashboardFilterText(selected, fromDate, toDate)}</div>
							</Row>
						</>
					) : (
						<h6>{BONUS_REPORT}</h6>
					)}
				</CardBody>
			</Card>
		</Col>
	);
};

export default BonusReport;
