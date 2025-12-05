import React from 'react';
import { Container } from 'reactstrap';
import TableContainer from '../../components/Common/Table';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import useSegmentationDetails from './hooks/useSegmentationDetails';
import useSegmentationDetailsFilter from './hooks/useSegmentationDetailsFilter';

const SegmentationDetails = () => {
	const { filterValidation, filterComponent, selectedFiltersComponent } =
		useSegmentationDetailsFilter();
	const {
		columns,
		formattedSegments,
		itemsPerPage,
		setCurrentPage,
		currentPage,
		onChangeRowsPerPage,
		totalPlayerPages,
		loadingSegmentationDetails,
		segmentationName,
	} = useSegmentationDetails(filterValidation.values);

	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs
					title="Segmentation"
					breadcrumbItem={`${segmentationName} Details`}
					titleLink="/segmentation"
					leftTitle={
						<>
							<i className="fas fa-angle-left" /> Back
						</>
					}
				/>

				<TableContainer
					isLoading={loadingSegmentationDetails}
					columns={columns || []}
					tableKey="segmentationDetails"
					data={formattedSegments}
					isPagination
					customPageSize={itemsPerPage}
					tableClass="table-bordered align-middle nowrap mt-2"
					isShowColSettings={false}
					totalPageCount={totalPlayerPages}
					isManualPagination={!loadingSegmentationDetails}
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

export default SegmentationDetails;
