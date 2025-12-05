import React from 'react';
import { Container } from 'reactstrap';
import TableContainer from '../../components/Common/Table';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import useAdvanceFilterListing from './hooks/useAdvanceFilterListing';
import FormModal from '../../components/Common/FormModal';

const AdvanceFilterListing = () => {
	const {
		columns,
		formattedSegments,
		itemsPerPage,
		totalPlayerPages,
		setCurrentPage,
		currentPage,
		onChangeRowsPerPage,
		loading,
		actionList,
		isOpen,
		setIsOpen,
		validation,
		formFields,
		header,
		isDownloadLading,
	} = useAdvanceFilterListing();

	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs
					title="Advance Filter listing"
					breadcrumbItem="Advance Filter"
					titleLink="/advance-filter"
					leftTitle={
						<>
							<i className="fas fa-angle-left" /> Back
						</>
					}
				/>

				<TableContainer
					isLoading={loading}
					columns={columns || []}
					tableKey="advanceFilter"
					data={formattedSegments}
					isPagination
					customPageSize={itemsPerPage}
					tableClass="table-bordered align-middle nowrap mt-2"
					isShowColSettings={false}
					totalPageCount={totalPlayerPages}
					isManualPagination
					onChangePagination={setCurrentPage}
					currentPage={currentPage}
					changeRowsPerPageCallback={onChangeRowsPerPage}
					actionList={actionList}
				/>
			</Container>
			<FormModal
				isOpen={isOpen}
				toggle={() => {
					setIsOpen((prev) => !prev);
				}}
				header={header}
				validation={validation}
				formFields={formFields}
				submitLabel="Send Email"
				customColClasses="col-md-12"
				isSubmitLoading={isDownloadLading}
			/>
		</div>
	);
};

export default AdvanceFilterListing;
