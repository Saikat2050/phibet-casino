import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Container } from 'reactstrap';
import Breadcrumb from '../../components/Common/Breadcrumb';
import TableContainer from '../../components/Common/Table';
import useCmsListing from './hooks/useCmsListing';

import { projectName } from '../../constants/config';
import useFilters from './hooks/useFilters';
import useCreateCms from './hooks/useCreateCms';

const Cms = () => {
	// Set meta title
	document.title = projectName;
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);

	const { filterValidation, filterComponent, selectedFiltersComponent } =
		useFilters();

	const {
		formattedCmsDetails,
		isLoading,
		page,
		setPage,
		itemsPerPage,
		totalCmsCount,
		onChangeRowsPerPage,
		columns,
	} = useCmsListing(filterValidation.values);

	const { actionList } = useCreateCms();

	return (
		<div className="page-content">
			<Container fluid>
				{showBreadcrumb && (
					<Breadcrumb title="Content Management" breadcrumbItem="Cms" />
				)}
				<TableContainer
					columns={columns}
					data={formattedCmsDetails}
					isAddOptions={false}
					isPagination
					customPageSize={itemsPerPage}
					totalPageCount={totalCmsCount}
					isManualPagination
					onChangePagination={setPage}
					currentPage={page}
					isLoading={!isLoading}
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

Cms.propTypes = {
	// t: PropTypes.func,
};

Cms.defaultProps = {
	t: (string) => string,
};

export default Cms;
