/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-script-url */
/* eslint-disable react/jsx-no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Badge, Input, Nav, NavItem, TabContent, TabPane } from 'reactstrap';
import { map } from 'lodash';
import SimpleBar from 'simplebar-react';
import PropTypes from 'prop-types';
import { DISPUTE_STATUS, DISPUTE_STATUS_COLOR } from '../constants';
import Spinners from '../../../components/Common/Spinner';

const DisputeList = ({
	disputes,
	loading,
	selectedDispute,
	setSelectedDispute,
	filters,
	setFilters,
	setPage,
	page,
}) => {
	const getUnreadContent = (unread) => {
		const num = Number(unread || 0);
		if (num > 9) return '9+';
		return num;
	};

	return (
		<div className="chat-leftsidebar me-lg-4">
			<div>
				<div className="search-box chat-search-box py-4">
					<div className="position-relative">
						<Input
							id="search-user"
							type="text"
							value={filters?.username}
							onChange={(e) =>
								setFilters((prev) => ({ ...prev, subject: e.target.value }))
							}
							className="form-control"
							placeholder="Search by Subject or User Id"
						/>
						<i className="bx bx-search-alt search-icon" />
					</div>
				</div>

				<div className="chat-leftsidebar-nav position-relative">
					<Nav pills justified role="presentation">
						{[{ value: null, label: 'All' }, ...DISPUTE_STATUS]?.map(
							({ value, label }) => (
								<NavItem>
									<NavLink
										to="javascript:void(0)"
										className={`${
											value === filters.status ? 'active' : ''
										} nav-link`}
										onClick={() => {
											setFilters((prev) => ({
												...prev,
												status: value,
											}));
										}}
									>
										<span className="d-sm-block">{label}</span>
									</NavLink>
								</NavItem>
							)
						)}
					</Nav>
					<TabContent activeTab={1} className="py-4">
						<TabPane tabId={1}>
							<div>
								<h5 className="font-size-14 mb-3">Recent</h5>
								<ul className="list-unstyled chat-list" id="recent-list">
									{loading ? (
										<Spinners />
									) : disputes?.threadTickets?.length ? (
										<SimpleBar style={{ height: '480px' }}>
											{map(
												disputes?.threadTickets,
												({ subject, id, status, unread_message_count }) => (
													<li
														key={id}
														className={selectedDispute === id ? 'active' : ''}
													>
														<Link
															to="!#"
															onClick={(e) => {
																e.preventDefault();
																setSelectedDispute(id);
															}}
														>
															<div className="d-flex">
																<div className="align-self-center me-3">
																	{Number(unread_message_count || 0) > 0 ? (
																		<Badge color="danger">
																			{getUnreadContent(unread_message_count)}
																		</Badge>
																	) : (
																		<i className="mdi mdi-circle text-success font-size-10" />
																	)}
																</div>

																<div className="flex-grow-1 overflow-hidden">
																	<h5 className="text-truncate font-size-14 mb-1">
																		{subject}
																	</h5>
																</div>
																<div className="font-size-11">
																	<Badge
																		color={
																			DISPUTE_STATUS_COLOR?.[status]?.color
																		}
																		className="ms-3"
																	>
																		{`${status?.[0]?.toUpperCase()}${status.slice(
																			1
																		)}`}
																	</Badge>
																</div>
															</div>
														</Link>
													</li>
												)
											)}
										</SimpleBar>
									) : (
										<p>No Dispute found!</p>
									)}
								</ul>
							</div>
						</TabPane>
					</TabContent>
					<div className="d-flex justify-content-end">
						<ReactPaginate
							breakLabel="..."
							nextLabel=">"
							onPageChange={(newPage) => setPage((newPage?.selected || 0) + 1)}
							pageCount={disputes?.totalPages}
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
							pageRangeDisplayed={4}
							marginPagesDisplayed={4}
							currentPage={page - 1}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DisputeList;

DisputeList.propTypes = {
	disputes: PropTypes.arrayOf({
		id: PropTypes.string,
	}),
	loading: PropTypes.bool,
	selectedDispute: PropTypes.string,
	setSelectedDispute: PropTypes.func.isRequired,
	setPage: PropTypes.func.isRequired,
	page: PropTypes.number.isRequired,
	filters: PropTypes.objectOf({
		status: PropTypes.string,
		searchString: PropTypes.string,
	}).isRequired,
	setFilters: PropTypes.func.isRequired,
};

DisputeList.defaultProps = {
	disputes: [],
	loading: false,
	selectedDispute: '',
};
