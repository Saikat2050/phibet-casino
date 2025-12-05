import React from 'react';
import { Container } from 'reactstrap';
import { useSelector } from 'react-redux';
import TableContainer from '../../components/Common/Table';
import Breadcrumb from '../../components/Common/Breadcrumb';
import useSegmentation from './hooks/useSegmentation';
import useFilters from './hooks/useFilter';

const Segmentation = () => {
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);
	const { filterValidation, filterComponent, selectedFiltersComponent } =
		useFilters();

	const {
		columns,
		actionList,
		formattedSegments,
		itemsPerPage,
		setCurrentPage,
		currentPage,
		onChangeRowsPerPage,
		loading,
		totalPlayerPages,
	} = useSegmentation(filterValidation.values);

	return (
		<div className="page-content">
			<Container fluid>
				{showBreadcrumb && (
					<Breadcrumb title="Segmentation" breadcrumbItem="Segmentation" />
				)}
				<TableContainer
					isLoading={loading}
					columns={columns || []}
					tableKey="segmentation"
					data={formattedSegments}
					isPagination
					customPageSize={itemsPerPage}
					tableClass="table-bordered align-middle nowrap mt-2"
					isShowColSettings
					totalPageCount={totalPlayerPages}
					isManualPagination
					onChangePagination={setCurrentPage}
					currentPage={currentPage}
					changeRowsPerPageCallback={onChangeRowsPerPage}
					actionList={actionList}
					filterComponent={filterComponent}
					selectedFiltersComponent={selectedFiltersComponent}
				/>
			</Container>
		</div>
	);
};

export default Segmentation;
