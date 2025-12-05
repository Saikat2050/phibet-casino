import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux';
import { Container } from 'reactstrap';
import TableContainer from '../../../components/Common/Table';
// import components
import Breadcrumb from '../../../components/Common/Breadcrumb';
// redux
import { projectName } from '../../../constants/config';
import useCreateAggregator from './hooks/useCreateAggregator';
import FormModal from '../../../components/Common/FormModal';
import { formPageTitle } from '../../../components/Common/constants';
import ConfirmationModal from '../../../components/Common/ConfirmationModal';
import useAggregatorListing from './hooks/useAggregatorListing';

const CasinoAggregators = () => {
	// meta title
	document.title = projectName;
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);

	const {
		isOpen,
		setIsOpen,
		showModal,
		setShowModal,
		header,
		validation,
		formFields,
		isCreateAggregatorLoading,
		handleStatus,
	} = useCreateAggregator();

	const {
		onChangeRowsPerPage,
		columns,
		aggregatorsData,
		itemsPerPage,
		setCurrentPage,
		currentPage,
		loading,
	} = useAggregatorListing(handleStatus);

	return (
		<div className="page-content">
			<Container fluid>
				{showBreadcrumb && (
					<Breadcrumb
						title="Casino Management"
						breadcrumbItem="Casino Aggregators"
					/>
				)}

				<TableContainer
					columns={columns || []}
					data={aggregatorsData?.aggregators || []}
					isGlobalFilter
					isPagination
					customPageSize={itemsPerPage}
					totalPageCount={aggregatorsData?.totalPages}
					isManualPagination
					onChangePagination={setCurrentPage}
					currentPage={currentPage}
					isLoading={loading}
					changeRowsPerPageCallback={onChangeRowsPerPage}
				/>

				<FormModal
					isOpen={isOpen}
					setIsOpen={setIsOpen}
					showConfirmationModal={showModal}
					setShowConfirmationModal={setShowModal}
					isEditOpen={false}
					header={header}
					validation={validation}
					formFields={formFields}
					submitLabel="Submit"
					customColClasses="col-md-12"
					isSubmitLoading={isCreateAggregatorLoading}
				/>
				<ConfirmationModal
					openModal={showModal}
					setOpenModal={setShowModal}
					validation={validation}
					pageType={formPageTitle.aggregators}
				/>
			</Container>
		</div>
	);
};

export default CasinoAggregators;
