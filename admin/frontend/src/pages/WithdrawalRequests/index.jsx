import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Container } from 'reactstrap';
import Breadcrumb from '../../components/Common/Breadcrumb';
import TableContainer from '../../components/Common/Table';
import { projectName } from '../../constants/config';
import useWithdrawalRequestListing from './hooks/useWithdrawalPaymentListing';
import useFilters from './hooks/useFilters';

const WithdrawalRequestDetail = () => {
	document.title = projectName;
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);
	const { filterValidation, filterComponent, selectedFiltersComponent } =
		useFilters();

	const {
		withdrawRequestsData,
		isLoading,
		itemsPerPage,
		page,
		setPage,
		onChangeRowsPerPage,
		columns,
		totalPageCount,
	} = useWithdrawalRequestListing(filterValidation.values);

	return (
		<div className="page-content">
			<Container fluid>
				{showBreadcrumb && (
					<Breadcrumb
						title="Payment Management"
						breadcrumbItem="Redeem Requests"
					/>
				)}
				<TableContainer
					columns={columns}
					data={withdrawRequestsData}
					customPageSize={itemsPerPage}
					totalPageCount={totalPageCount}
					isManualPagination
					onChangePagination={setPage}
					currentPage={page}
					isLoading={isLoading}
					changeRowsPerPageCallback={onChangeRowsPerPage}
					filterComponent={filterComponent}
					selectedFiltersComponent={selectedFiltersComponent}
				/>
			</Container>
		</div>
	);
};

WithdrawalRequestDetail.propTypes = {
	// t: PropTypes.func,
};

WithdrawalRequestDetail.defaultProps = {
	t: (string) => string,
};

export default WithdrawalRequestDetail;
