/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Fragment } from 'react';
import PropTypes, { oneOfType } from 'prop-types';
import {
	Table,
	Spinner,
	Col,
	Row,
	UncontrolledTooltip,
	Card,
	CardBody,
} from 'reactstrap';
import ReactPaginate from 'react-paginate';
import { CustomSelectField } from '../../../helpers/customForms';
import { defaultPageSize, rowsPerPageOptions } from '../constants';
import NoDataFound from '../NoDataFound';
import useTableCustom from './useTableCustom';

const TableContainer = ({
	columns = [],
	data = [],
	customPageSize,
	tbodyClass,
	totalPageCount,
	isManualPagination,
	onChangePagination,
	isLoading = false,
	thCustomClass = '',
	changeRowsPerPageCallback,
	hideHeader,
	tbodyHeight,
	isLongTable = false,
	currentPage,
	isShowColSettings,
	customTableInfo,
	filterComponent,
	selectedFiltersComponent,
	actionList,
	customSearchClass,
	columnType,
}) => {
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		page,
		prepareRow,
		generateSortingIndicator,
		noDataFound,
		tableHeaderClass,
		handlePagination,
		customColSetting,
	} = useTableCustom(
		data,
		columns,
		isManualPagination,
		onChangePagination,
		customPageSize,
		totalPageCount,
		isLoading,
		columnType
	);

	return (
		<>
			<div className="table-actions">
				<div id="search-input-portal" className={customSearchClass} />
				{/* Do not remove this empty div as it is used for creating portal of search input */}
				{customTableInfo}
				<div className="d-flex justify-content-end w-100 custom-btn-group">
					{actionList}
					{filterComponent}
					{isShowColSettings ? customColSetting : null}
				</div>
			</div>
			<Card>
				{selectedFiltersComponent}
				<CardBody>
					<div
						className={`table-responsive react-table ${
							isLongTable && 'scrollable'
						}`}
					>
						<Table
							{...getTableProps()}
							className="mt-2 text-nowrap"
							id="generic-table"
						>
							{!hideHeader && (
								<thead
									className={`${tableHeaderClass}`}
									id="generic-table-head"
								>
									{headerGroups?.map((headerGroup) => (
										<tr
											key={headerGroup.id}
											{...headerGroup.getHeaderGroupProps()}
											id="generic-table-tr"
										>
											{headerGroup?.headers?.map((column) => (
												<th
													key={column.id}
													className={column.isSort ? 'sorting' : thCustomClass}
												>
													<div
														{...column.getSortByToggleProps()}
														{...(column?.tableHeaderTooltipContent
															? { title: '' }
															: {})}
													>
														<span className="d-flex align-items-center gap-1">
															<span style={{ textTransform: 'uppercase' }}>
																{column.render('Header')}
															</span>
															{generateSortingIndicator(column)}
															{column?.tableHeaderTooltipContent && (
																<span
																	className="mdi mdi-information-outline"
																	style={{ fontSize: '20px' }}
																	id={`id-${column.id}`}
																/>
															)}
														</span>
														{column.subLabel && (
															<div style={{ fontSize: 12 }}>
																({column.subLabel})
															</div>
														)}
														{column?.tableHeaderTooltipContent ? (
															<UncontrolledTooltip
																placement="top"
																target={`id-${column.id}`}
															>
																{column.tableHeaderTooltipContent}
															</UncontrolledTooltip>
														) : null}
													</div>
												</th>
											))}
										</tr>
									))}
								</thead>
							)}

							<tbody
								{...getTableBodyProps({
									height: `${
										noDataFound
											? '280px'
											: tbodyHeight ||
											  (isLoading || !page?.length ? '500px' : '0')
									}`,
								})}
								id="generic-table-body"
								className={tbodyClass}
							>
								{isLoading && (
									<Spinner
										color="primary"
										className="position-absolute top-50 start-50"
									/>
								)}
								{noDataFound && (
									<tr style={{ textAlign: 'center' }}>
										<td colSpan={columns.length}>
											<NoDataFound height="200px" width="300px" />
										</td>
									</tr>
								)}
								{!isLoading &&
									!!page.length &&
									page?.map((row) => {
										prepareRow(row);
										return (
											<Fragment key={row.getRowProps().key}>
												<tr>
													{row?.cells?.map((cell) => (
														<td
															style={cell?.column?.customColumnStyle || {}}
															key={cell.id}
															{...cell.getCellProps()}
														>
															{cell.render('Cell')}
														</td>
													))}
												</tr>
											</Fragment>
										);
									})}
							</tbody>
						</Table>
					</div>

					{isManualPagination && (
						<Row className="d-flex justify-content-between align-items-center">
							<Col lg={4}>
								{!!totalPageCount && (
									<div className="text-muted">
										Showing <span className="fw-semibold">{currentPage}</span>{' '}
										of <span className="fw-semibold">{totalPageCount}</span>{' '}
										pages.
									</div>
								)}
								{/* need to remove inline styles here */}
								{!noDataFound && (
									<div
										className="d-flex align-items-center mt-10"
										style={{ marginTop: 10 }}
									>
										<div className="text-muted" style={{ marginRight: 10 }}>
											Rows per Page
										</div>
										<div>
											<CustomSelectField
												value={customPageSize}
												type="select"
												onChange={(e) =>
													changeRowsPerPageCallback(e.target.value)
												}
												options={
													<>
														<option value={null} selected disabled>
															Select
														</option>
														{rowsPerPageOptions?.map(
															({ optionLabel, value }) => (
																<option key={value} value={value}>
																	{optionLabel}
																</option>
															)
														)}
													</>
												}
											/>
										</div>
									</div>
								)}
							</Col>
							<Col lg={4} className="justify-content-center">
								<div className="d-flex justify-content-end">
									<ReactPaginate
										breakLabel="..."
										nextLabel=">"
										onPageChange={handlePagination}
										pageCount={totalPageCount}
										previousLabel="<"
										renderOnZeroPageCount={null}
										pageClassName="page-item"
										pageLinkClassName="page-link"
										previousClassName="page-item"
										previousLinkClassName="page-link"
										nextClassName="page-item"
										nextLinkClassName="page-link"
										breakClassName="page-item"
										breakLinkClassName="page-link"
										containerClassName="pagination"
										activeClassName="active"
										pageRangeDisplayed={3}
										{...(currentPage ? { forcePage: currentPage - 1 } : {})}
									/>
								</div>
							</Col>
						</Row>
					)}
				</CardBody>
			</Card>
		</>
	);
};

TableContainer.defaultProps = {
	hideHeader: false,
	customPaginationC: '',
	tbodyClass: '',
	isManualPagination: false,
	onChangePagination: () => {},
	thCustomClass: '',
	changeRowsPerPageCallback: () => {},
	tbodyHeight: '',
	cellPadding: '',
	isLongTable: false,
	totalPageCount: 1,
	currentPage: 1,
	customPageSize: defaultPageSize,
	isShowColSettings: true,
	customTableInfo: null,
	filterComponent: null,
	customSearchInput: null,
	selectedFiltersComponent: null,
	actionList: null,
	customSearchClass: 'search-input-width',
	columnType: 'tableColumnDropdownOpen',
};

TableContainer.propTypes = {
	hideHeader: PropTypes.bool,
	columns: PropTypes.arrayOf(
		PropTypes.shape({
			Header: PropTypes.string,
			accessor: oneOfType([
				PropTypes.string,
				PropTypes.element,
				PropTypes.func,
			]),
			filterable: PropTypes.bool,
			Cell: PropTypes.func,
		})
	).isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	data: PropTypes.arrayOf(PropTypes.object).isRequired,
	customPageSize: PropTypes.number,
	customPaginationC: PropTypes.string,
	tbodyClass: PropTypes.string,
	totalPageCount: PropTypes.number,
	isManualPagination: PropTypes.bool,
	onChangePagination: PropTypes.func,
	isLoading: PropTypes.bool.isRequired,
	thCustomClass: PropTypes.string,
	changeRowsPerPageCallback: PropTypes.func,
	tbodyHeight: PropTypes.string,
	cellPadding: PropTypes.string,
	isLongTable: PropTypes.bool,
	currentPage: PropTypes.number,
	isShowColSettings: PropTypes.bool,
	customTableInfo: PropTypes.element,
	filterComponent: PropTypes.element,
	customSearchInput: PropTypes.element,
	selectedFiltersComponent: PropTypes.element,
	actionList: PropTypes.element,
	customSearchClass: PropTypes.string,
	columnType: PropTypes.string,
};

export default TableContainer;
