import React from 'react';
import { Container } from 'reactstrap';
import { useSelector } from 'react-redux';
import usePackagesListing from './hooks/usePackagesListing';
import Breadcrumb from '../../components/Common/Breadcrumb';
import TableContainer from '../../components/Common/Table';
import { projectName, tbodyClass } from '../../constants/config';
import useFilters from './hooks/useFilters';

const Packages = () => {
	// meta title
	document.title = projectName;
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);

	const { filterValidation, filterComponent, selectedFiltersComponent } =
		useFilters();

	const {
		totalPages,
		itemsPerPage,
		page,
		setPage,
		isPackagesLoading,
		columns,
		onChangeRowsPerPage,
		packages,
		actionList,
	} = usePackagesListing(filterValidation.values);

	return (
		<div className="page-content">
			<Container fluid>
				{showBreadcrumb && (
					<Breadcrumb title="Packages" breadcrumbItem="Packages" />
				)}
				<TableContainer
					columns={columns || []}
					data={packages?.packages || []}
					isGlobalFilter
					isPagination
					customPageSize={itemsPerPage}
					tbodyClass={tbodyClass}
					totalPageCount={totalPages}
					isManualPagination
					onChangePagination={setPage}
					currentPage={page}
					isLoading={isPackagesLoading}
					changeRowsPerPageCallback={onChangeRowsPerPage}
					filterComponent={filterComponent}
					selectedFiltersComponent={selectedFiltersComponent}
					actionList={actionList}
				/>
			</Container>
		</div>
	);
};

export default Packages;
