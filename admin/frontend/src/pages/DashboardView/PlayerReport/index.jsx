/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Col, Card, CardBody, UncontrolledTooltip, Row } from 'reactstrap';
import FlatPickr from 'react-flatpickr';
import { CSVLink } from 'react-csv';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import TableContainer from '../../../components/Common/Table';
import { flatPickerFormat, tableCustomClass } from '../../../constants/config';
import { dateConstants, TIMEZONES, topPlayerOrder } from '../constant';
import { CustomSelectField } from '../../../helpers/customForms';
import usePlayerReport from './hooks/usePlayerReport';
import { PLAYER_PERFORMANCE } from '../../../constants/messages';
import { modules } from '../../../constants/permissions';
import usePermission from '../../../components/Common/Hooks/usePermission';
import { getDashboardFilterText } from '../../../utils/helpers';
// import 'flatpickr/dist/themes/material_blue.css';

const PlayerReport = () => {
	const {
		columns,
		topPlayerFormatted,
		topPlayersLoading,
		topPlayersDateOption: { selected, fromDate, toDate },
		setTopPlayersDateOption,
		// fetchTopPlayers,
		// currencyId,
		// setCurrencyId,
		orderBy,
		setOrderBy,
		tagBy,
		setTagBy,
		// currencies,
		timezone,
		setTimezone,
		handleDateOptionChange,
		handleRefresh,
		topPlayerFormattedCSV,
		playerOptions,
	} = usePlayerReport();

	const { isGranted } = usePermission();

	return (
		<Col xl="12">
			<Card>
				<CardBody>
					{isGranted(modules.reportPlayerPerformance, 'R') ? (
						<>
							<Row>
								<Col xl={6} className="d-flex align-items-center my-2">
									<h4 className="card-title font-size-18 mb-3 d-flex align-items-center">
										<span className="mdi mdi-account-tie fs-1 me-3 text-dashboard" />
										Top 5 Players
									</h4>
									<i
										role="button"
										tabIndex="0"
										className="mdi mdi-refresh mx-2 font-size-24 mb-3"
										style={{ cursor: 'pointer' }}
										id="refreshGameReport"
										onClick={handleRefresh}
										onKeyDown={(e) => {
											if (e.key === 'Enter') {
												handleRefresh();
											}
										}}
									/>
									<UncontrolledTooltip
										placement="top"
										target="refreshGameReport"
									>
										Refresh
									</UncontrolledTooltip>

									<Link
										style={{ marginTop: -13, fontSize: 15 }}
										variant="outline"
										key="view"
										to="/player-performance"
										className="text-decoration-underline"
										id="playerRedirect"
									>
										View All
									</Link>

									<UncontrolledTooltip placement="top" target="playerRedirect">
										Player Performance Report
									</UncontrolledTooltip>
								</Col>
								<Col xl={6} className="float-end my-2">
									<div className="d-flex justify-content-between align-items-center">
										<div className="game-report-dashboard-filter">
											<label
												className="game-report-dashboard-filter-label"
												htmlFor="performance"
											>
												Performance
											</label>
											<CustomSelectField
												name="playerPerformance"
												type="select"
												value={orderBy}
												className="mx-2"
												placeholder="Order By"
												key="my_unique_select_key_performance"
												onChange={(e) => {
													setOrderBy(e.target.value);
												}}
												options={topPlayerOrder?.map((item) => (
													<option value={item.value} key={item.value}>
														{item.label}
													</option>
												))}
											/>
										</div>
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
										{/* <CustomSelectField
											type="select"
											value={currencyId}
											className="mx-2"
											placeholder="Select Currency"
											key="my_unique_select_key__top_players"
											onChange={(e) => {
												setCurrencyId(e.target.value);
											}}
											options={currencies?.currencies?.map((currency) => (
												<option value={currency.id} key={currency.id}>
													{currency.name}
												</option>
											))}
										/> */}
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
													setTopPlayersDateOption((prev) => ({
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
												// onChange={(e) => {
												// 	setTopPlayersDateOption((prev) => ({
												// 		...prev,
												// 		fromDate: '',
												// 		toDate: '',
												// 		selected: e.target.value,
												// 	}));
												// }}
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
											data={topPlayerFormattedCSV || []}
											filename="downloaded_data.csv"
											className="btn btn-primary dashboard-export-btn w-80"
										>
											<i className="bx bx-download align-baseline" />
										</CSVLink>
									</div>
								</Col>
								<TableContainer
									isLoading={topPlayersLoading}
									columns={columns || []}
									data={topPlayerFormatted}
									isGlobalFilter={false}
									tableClass={`table-bordered align-middle table-striped nowrap ${tableCustomClass}`}
									isShowColSettings={false}
									tbodyHeight={topPlayersLoading ? '230px' : ''}
								/>
							</Row>
							<Row>
								<div>{getDashboardFilterText(selected, fromDate, toDate)}</div>
							</Row>
						</>
					) : (
						<h6>{PLAYER_PERFORMANCE}</h6>
					)}
				</CardBody>
			</Card>
		</Col>
	);
};

export default PlayerReport;
