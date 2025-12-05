/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { useSelector } from 'react-redux';
import { Card, CardBody, Col, Row, UncontrolledTooltip } from 'reactstrap';
import Breadcrumb from '../../../components/Common/Breadcrumb';
import CrudSection from '../../../components/Common/CrudSection';
import ReorderComponent from '../../ReorderCategories';
import {
	CustomInputField,
	CustomSelectField,
} from '../../../helpers/customForms';
import useReorderGames from '../hooks/useReorderGames';
import TableContainer from '../../../components/Common/Table';

const ReorderGames = () => {
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);

	const {
		state,
		columns,
		page,
		setPage,
		setState,
		search,
		setSearch,
		games,
		setGames,
		buttonList,
		itemsPerPage,
		totalPageCount,
		formattedState,
		selectedCategory,
		onChangeRowsPerPage,
		setSelectedCategory,
		isCasinoGamesLoading,
		casinoCategoryDetails,
	} = useReorderGames();

	return (
		<div className="page-content">
			<div className="container-fluid">
				{showBreadcrumb && (
					<Breadcrumb
						title="Casino Management"
						breadcrumbItem="Reorder Games"
						showBackButton
					/>
				)}

				<Row>
					<Card>
						<CrudSection
							buttonList={state.count ? buttonList : []}
							title="Casino Games Reorder"
						/>
						<CardBody>
							<Row lg={12}>
								<Col lg={4}>
									<CustomSelectField
										label="Category"
										name="category"
										value={selectedCategory}
										isClearable
										type="select"
										onChange={(e) => {
											setSearch('');
											setGames({ rows: [], count: 0 });
											setState({ rows: [], count: 0 });
											setSelectedCategory(e.target.value);
										}}
										key="my_unique_select_key_Category"
										options={
											<>
												<option value="">Select Category</option>
												{casinoCategoryDetails &&
													casinoCategoryDetails?.categories?.map((c) => (
														<option key={c?.id} value={c?.id}>
															{c?.name?.EN}
														</option>
													))}
											</>
										}
									/>
								</Col>
								{games && (
									<Col lg={4}>
										<label className="control-label" htmlFor="search">
											Search
										</label>
										<div className="d-flex align-items-center">
											<CustomInputField
												id="search"
												name="searchString"
												type="text"
												onChange={(e) => {
													setGames({ rows: [], count: 0 });
													setSearch(e.target.value);
												}}
												placeholder="Search Games"
												validate={{ required: { value: true } }}
												value={search}
											/>
											<i
												className="mdi mdi-refresh mx-2"
												id="refresh"
												onClick={() => setSearch('')}
												onKeyDown={(event) => {
													if (event.key === 'Enter') {
														setSearch('');
													}
												}}
												tabIndex="0"
											/>
										</div>
										<UncontrolledTooltip placement="top" target="refresh">
											Refresh
										</UncontrolledTooltip>
									</Col>
								)}
							</Row>
						</CardBody>
					</Card>
				</Row>
				<Row lg={12}>
					<Col lg={6}>
						<Card>
							<CardBody>
								<TableContainer
									columns={columns}
									data={games?.rows}
									isPagination
									customPageSize={itemsPerPage}
									tableClass="table-bordered align-middle nowrap"
									paginationDiv="justify-content-center"
									pagination="pagination justify-content-start pagination-rounded"
									totalPageCount={totalPageCount}
									isManualPagination
									onChangePagination={setPage}
									currentPage={page}
									isLoading={isCasinoGamesLoading}
									changeRowsPerPageCallback={onChangeRowsPerPage}
									isShowColSettings={false}
								/>
							</CardBody>
						</Card>
					</Col>
					<Col lg={6}>
						<Card>
							<CardBody>
								<Row className="drag-table--header">
									{['ORDER ID', 'GAME NAME (ID)', 'ACTIONS'].map((key) => (
										<Col key={key} className="drag-table--heading">
											{key}
										</Col>
									))}
									{selectedCategory ? (
										<ReorderComponent
											formattedState={formattedState}
											state={state}
											setState={setState}
										/>
									) : (
										<p className="text-center text-danger mt-3">
											{' '}
											Select Category{' '}
										</p>
									)}
								</Row>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</div>
		</div>
	);
};

export default ReorderGames;
