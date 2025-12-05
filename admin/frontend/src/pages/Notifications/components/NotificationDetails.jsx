/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { Link, useLocation } from 'react-router-dom';
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import TableContainer from '../../../components/Common/Table';
import CrudSection from '../../../components/Common/CrudSection';

const KeyValueCell = ({ cell }) => (cell.value ? cell.value : '');
const UserName = ({ cell }) =>
	cell.value && cell?.row?.original?.id ? (
		<Link to={`/player-details/${cell?.row?.original?.id}`}>{cell.value}</Link>
	) : (
		cell.value || '-'
	);

const columns = [
	{
		Header: 'USER ID',
		disableSortBy: true,
		accessor: 'id',
		Cell: (cell) => <KeyValueCell cell={cell} />,
	},
	{
		Header: 'USERNAME',
		disableSortBy: true,
		accessor: 'username',
		Cell: (cell) => <UserName cell={cell} />,
	},
];

const NotificationDetails = () => {
	const {
		state: { details },
	} = useLocation();

	const formatted = useMemo(() => {
		if (details?.userNotifications?.length) {
			return details?.userNotifications?.map((user) => ({
				...user?.user,
			}));
		}
		return [];
	}, [details?.userNotifications]);

	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs
					title="Content Management"
					breadcrumbItem="Notification Details"
					showBackButton
					leftTitle="Back"
					isNotFormModal
				/>
				<Row>
					<Col lg="12">
						<Card>
							<CrudSection buttonList={[]} title="Notification details" />
							<CardBody>
								<Row>
									<Col xl={2} md={2}>
										<h6 className="text-nowrap font-weight-bold">Title:</h6>
									</Col>
									<Col xl={5} md={5}>
										<p>{details?.title?.EN || '-'}</p>
									</Col>
									{details?.image ? (
										<Col>
											<img
												src={details?.image}
												alt="notification"
												style={{ height: '80px', width: 'auto' }}
												height="30"
											/>
										</Col>
									) : null}
								</Row>
								{details?.url ? (
									<Row>
										<Col xl={2} md={2}>
											<h6 className="text-nowrap font-weight-bold">
												Redirection URL:
											</h6>
										</Col>
										<Col>
											<p>{details?.url || '-'}</p>
										</Col>
									</Row>
								) : null}
								<Row>
									<Col xl={2} md={2}>
										<h6 className="text-nowrap font-weight-bold">
											Description:
										</h6>
									</Col>
									<Col>
										<p>{details?.description?.EN || '-'}</p>
									</Col>
								</Row>
								<Row>
									<Col xl={2} md={2}>
										<h6 className="text-nowrap font-weight-bold">Sent To :</h6>
									</Col>
									<Col>
										<p>{!formatted?.length && 'ALL'}</p>
									</Col>
								</Row>
								{formatted?.length ? (
									<TableContainer
										columns={columns}
										data={formatted}
										tableClass="table-bordered align-middle nowrap mt-2"
										paginationDiv="justify-content-center"
										pagination="pagination justify-content-start pagination-rounded"
										isShowColSettings={false}
									/>
								) : null}
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default NotificationDetails;
