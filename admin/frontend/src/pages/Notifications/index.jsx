/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useSelector } from 'react-redux';
import { Container } from 'reactstrap';
// import PropTypes from 'prop-types';
import Breadcrumb from '../../components/Common/Breadcrumb';
import TableContainer from '../../components/Common/Table';
import useNotificationListing from './hooks/useNotificationListing';
import { projectName } from '../../constants/config';

const Notifications = () => {
	document.title = projectName;
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);

	const {
		currentPage,
		setCurrentPage,
		totalNotificationCount,
		isNotificationLoading,
		formattedNotifications,
		itemsPerPage,
		onChangeRowsPerPage,
		columns,
		buttonActionList,
	} = useNotificationListing();

	return (
		<div className="page-content">
			<Container fluid>
				{showBreadcrumb && (
					<Breadcrumb title="CRM" breadcrumbItem="Notifications" />
				)}

				<TableContainer
					isLoading={isNotificationLoading}
					columns={columns}
					data={formattedNotifications}
					isPagination
					customPageSize={itemsPerPage}
					tableClass="table-bordered align-middle nowrap mt-2"
					paginationDiv="justify-content-center"
					pagination="pagination justify-content-start pagination-rounded"
					totalPageCount={totalNotificationCount}
					isManualPagination
					onChangePagination={setCurrentPage}
					currentPage={currentPage}
					changeRowsPerPageCallback={onChangeRowsPerPage}
					actionList={buttonActionList}
				/>
			</Container>
		</div>
	);
};

Notifications.propTypes = {
	// t: PropTypes.func,
};

Notifications.defaultProps = {
	t: (string) => string,
};

export default Notifications;
