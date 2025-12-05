/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'reactstrap';
import { useSelector } from 'react-redux';
import Breadcrumb from '../../components/Common/Breadcrumb';
import { projectName } from '../../constants/config';
import useFilters from './hooks/useFilters';
import usePaymentListing from './hooks/usePaymentListing';
import TableContainer from '../../components/Common/Table';

const PaymentProviders = () => {
	document.title = projectName;
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);

	const { filterValidation, filterComponent, selectedFiltersComponent } =
		useFilters();

	const {
		isLoading,
		page,
		paymentListing,
		actionList,
		columns,
		itemsPerPage,
		onChangeRowsPerPage,
		setPage,
	} = usePaymentListing(false, filterValidation.values);

	return (
		<div className="page-content">
			<Container fluid>
				{showBreadcrumb && (
					<Breadcrumb title="Payment Management" breadcrumbItem="Payment" />
				)}
				<TableContainer
					columns={columns}
					data={paymentListing?.paymentProviders || []}
					isAddOptions={false}
					isPagination
					customPageSize={itemsPerPage}
					totalPageCount={paymentListing?.totalPages || 1}
					isManualPagination
					onChangePagination={setPage}
					currentPage={page}
					isLoading={isLoading}
					isGlobalFilter
					changeRowsPerPageCallback={onChangeRowsPerPage}
					filterComponent={filterComponent}
					selectedFiltersComponent={selectedFiltersComponent}
					actionList={actionList}
				/>
			</Container>
		</div>
	);
};

PaymentProviders.propTypes = {
	// t: PropTypes.func,
};

PaymentProviders.defaultProps = {
	// t: (string) => string,
};

export default PaymentProviders;
