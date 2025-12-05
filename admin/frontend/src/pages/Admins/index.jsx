import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'reactstrap';
import { useSelector } from 'react-redux';
import Breadcrumb from '../../components/Common/Breadcrumb';
import TableContainer from '../../components/Common/Table';
import { projectName, tbodyClass } from '../../constants/config';

import useFilters from './hooks/useFilters';
import useAdminListing from './hooks/useAdminListing';

const Admins = () => {
	// meta title
	document.title = projectName;
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);

	const { filterValidation, filterComponent, selectedFiltersComponent } =
		useFilters();

	const {
		isLoading,
		totalPages,
		page,
		setPage,
		itemsPerPage,
		columns,
		formattedAdminDetails,
		actionList,
		onChangeRowsPerPage,
	} = useAdminListing(false, filterValidation.values);

	return (
		<div className="page-content">
			<Container fluid>
				{showBreadcrumb && (
					<Breadcrumb title="Staff Management" breadcrumbItem="Staff" />
				)}
				<TableContainer
					columns={columns || []}
					data={formattedAdminDetails}
					isGlobalFilter
					isPagination
					customPageSize={itemsPerPage}
					tbodyClass={tbodyClass}
					totalPageCount={totalPages}
					isManualPagination
					onChangePagination={setPage}
					currentPage={page}
					isLoading={!isLoading}
					changeRowsPerPageCallback={onChangeRowsPerPage}
					filterComponent={filterComponent}
					selectedFiltersComponent={selectedFiltersComponent}
					actionList={actionList}
				/>
			</Container>
		</div>
	);
};

Admins.propTypes = {
	// t: PropTypes.func,
};

Admins.defaultProps = {
	// t: (string) => string,
};

export default Admins;
