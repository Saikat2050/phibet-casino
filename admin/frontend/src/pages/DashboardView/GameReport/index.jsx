/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Col, Card, CardBody, UncontrolledTooltip, Row } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { CSVLink } from 'react-csv';
import FlatPickr from 'react-flatpickr';
// import 'flatpickr/dist/themes/material_blue.css';
// import { Link } from 'react-router-dom';
import Select from 'react-select';
import TableContainer from '../../../components/Common/Table';
import {
	GAME_ORDER_BY,
	TABS,
	dateConstants,
	TOP_ITEMS_OPTIONS,
	TIMEZONES,
	CURRENCY_OPTIONS,
} from '../constant';
import { CustomSelectField } from '../../../helpers/customForms';
import TabsPage from '../../../components/Common/TabsPage';
import useGameReport from './hooks/useGameReport';
import { GAME_REPORT } from '../../../constants/messages';
import { modules } from '../../../constants/permissions';
import usePermission from '../../../components/Common/Hooks/usePermission';
import { getDashboardFilterText } from '../../../utils/helpers';
import { flatPickerFormat } from '../../../constants/config';

const GameReport = () => {
	const {
		activeGameReportTab,
		setActiveGameReportTab,
		gameReportColumn,
		gameReport,
		isGameReportLoading,
		gameReportDateOption: { selected, fromDate, toDate },
		setGameReportDateOption,
		// loadGameReport,
		currencyId,
		setCurrencyId,
		orderBy,
		setOrderBy,
		tagBy,
		setTagBy,
		// currencies,
		topGamesCount,
		setTopGamesCount,
		handleRefresh,
		timezone,
		setTimezone,
		handleDateOptionChange,
		gameReportFormatted,
		playerOptions,
	} = useGameReport();

	const { isGranted } = usePermission();

	const tabComponent = (
		<SimpleBar>
			<TableContainer
				isLoading={isGameReportLoading}
				columns={gameReportColumn || []}
				data={gameReport || []}
				isGlobalFilter={false}
				customPageSize={gameReport?.length || 300}
				isShowColSettings={false}
				tbodyHeight={isGameReportLoading ? '220px' : ''}
			/>
		</SimpleBar>
	);

	const tabData = [
		{
			id: TABS.GAME,
			title: 'GAME',
			component: tabComponent,
		},
		{
			id: TABS.PROVIDER,
			title: 'PROVIDER',
			component: tabComponent,
		},
	];

	const toggle = (tab) => {
		if (activeGameReportTab !== tab) {
			setActiveGameReportTab(tab);
		}
	};

	return (
		<Col xl="12">
			<Card>
				<CardBody>
					{isGranted(modules.gameReport, 'R') ? (
						<>
							<Row>
								<Col xl={4} className="d-flex align-items-center mb-0">
									{/* <h4 className="card-title font-size-18 mb-3 d-flex align-items-center">
										<span className="mdi mdi-soccer fs-1 me-3 text-success" />
										{`Top 5 ${activeGameReportTab}s`}
									</h4> */}
									<span className="mdi mdi-soccer fs-1 me-3 text-dashboard" />
									<CustomSelectField
										name="topItems"
										type="select"
										value={topGamesCount}
										className=""
										onChange={(e) => {
											setTopGamesCount(e.target.value);
										}}
										options={TOP_ITEMS_OPTIONS.map((item) => (
											<option value={item.value} key={item.value}>
												{item.label} {activeGameReportTab}s
											</option>
										))}
									/>
									<i
										role="button"
										tabIndex="0"
										className="mdi mdi-refresh mx-2 font-size-24"
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
									{/* <Link
										style={{ marginTop: -13, fontSize: 15 }}
										variant="outline"
										key="view"
										to="/game-report"
										className="text-decoration-underline"
										id="redirectToReport"
									>
										View All
									</Link>

									<UncontrolledTooltip
										placement="top"
										target="redirectToReport"
									>
										All Game Report
									</UncontrolledTooltip> */}
								</Col>
								<Col xl={8} className="float-end my-2">
									<div className="d-flex justify-content-between align-items-center">
										<CustomSelectField
											name="gameReport"
											type="select"
											value={orderBy}
											className="mx-2"
											placeholder="Order By"
											key="my_unique_select_key_gameReport"
											onChange={(e) => {
												setOrderBy(e.target.value);
											}}
											options={GAME_ORDER_BY?.map((item) => (
												<option value={item.value} key={item.value}>
													{item.label}
													{activeGameReportTab}
												</option>
											))}
										/>
										<div className="game-report-dashboard-filter">
											<label
												className="game-report-dashboard-filter-label"
												htmlFor="gameReportTag"
											>
												Player
											</label>
											<CustomSelectField
												name="gameReportTag"
												type="select"
												value={tagBy}
												className="mx-2"
												placeholder="Player By"
												key="my_unique_select_key_gameReport"
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
										<div className="game-report-dashboard-filter">
											<label
												className="game-report-dashboard-filter-label"
												htmlFor="currency"
											>
												Currency
											</label>
											<Select
												options={CURRENCY_OPTIONS}
												value={CURRENCY_OPTIONS.find(
													(option) => option.id === currencyId
												)}
												onChange={(selectedOption) =>
													setCurrencyId(selectedOption.id)
												}
												className="mx-2 w-100"
												placeholder="Select Currency"
											/>
										</div>
										{/* <CustomSelectField
											name="kpiSummaryDateFilter"
											type="select"
											value={currencyId}
											className="mx-2"
											placeholder="Select Currency"
											key="my_unique_select_key__currency"
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
													setGameReportDateOption((prev) => ({
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
												Date Filter
											</label>
											<CustomSelectField
												name="gameReportDateFilter"
												type="select"
												// onChange={(e) => {
												// 	setGameReportDateOption((prev) => ({
												// 		...prev,
												// 		fromDate: '',
												// 		toDate: '',
												// 		selected: e.target.value,
												// 	}));
												// }}
												onChange={handleDateOptionChange}
												value={selected}
												key="my_unique_select_key__gameReportDateFilter"
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
											data={gameReportFormatted || []}
											filename="downloaded_data.csv"
											className="btn btn-primary dashboard-export-btn w-80"
										>
											<i className="bx bx-download align-baseline" />
										</CSVLink>
									</div>
								</Col>

								<TabsPage
									activeTab={activeGameReportTab}
									tabsData={tabData}
									toggle={toggle}
									navClass="rounded p-0 mt-2"
									nonActiveClass="bg-light"
									navLinkClass="custom-border"
									tabCardClass="mb-0"
								/>
							</Row>
							<Row>
								<div>{getDashboardFilterText(selected, fromDate, toDate)}</div>
							</Row>
						</>
					) : (
						<h6>{GAME_REPORT}</h6>
					)}
				</CardBody>
			</Card>
		</Col>
	);
};

export default GameReport;
