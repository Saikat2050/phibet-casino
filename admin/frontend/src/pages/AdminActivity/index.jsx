import React from 'react';
import { Container } from 'reactstrap';
import { useSelector } from 'react-redux';
import TableContainer from '../../components/Common/Table';
import Breadcrumb from '../../components/Common/Breadcrumb';
import useAdminActivity from './hooks/useAdminActivity';
import useFilters from './hooks/useFilter';

const AdminActivity = () => {
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);
	const { filterValidation, filterComponent, selectedFiltersComponent } =
		useFilters();

	const {
		columns,
		formattedAdminData,
		itemsPerPage,
		setCurrentPage,
		currentPage,
		onChangeRowsPerPage,
		loading,
		totalPlayerPages,
	} = useAdminActivity(filterValidation.values);

	return (
		<div className="page-content">
			<Container fluid>
				{showBreadcrumb && (
					<Breadcrumb title="Admin Activity" breadcrumbItem="Admin Activity" />
				)}
				<TableContainer
					isLoading={loading}
					columns={columns || []}
					tableKey="adminActivity"
					data={formattedAdminData}
					isPagination
					customPageSize={itemsPerPage}
					tableClass="table-bordered align-middle nowrap mt-2"
					isShowColSettings={false}
					totalPageCount={totalPlayerPages}
					isManualPagination
					onChangePagination={setCurrentPage}
					currentPage={currentPage}
					changeRowsPerPageCallback={onChangeRowsPerPage}
					filterComponent={filterComponent}
					selectedFiltersComponent={selectedFiltersComponent}
				/>
			</Container>
		</div>
	);
};

export default AdminActivity;
