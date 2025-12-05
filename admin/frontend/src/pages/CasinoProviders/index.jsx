import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Container } from 'reactstrap';
import Breadcrumb from '../../components/Common/Breadcrumb';
import TableContainer from '../../components/Common/Table';
import { projectName } from '../../constants/config';

import useCasinoProvidersListing from './hooks/useCasinoProvidersListing';
import FormModal from '../../components/Common/FormModal';
import useCreateProvider from './hooks/useCreateProvider';
// import CrudSection from '../../components/Common/CrudSection';
// import Filters from '../../components/Common/Filters';
import useFilters from './hooks/useFilters';
import ConfirmationModal from '../../components/Common/ConfirmationModal';
import { formPageTitle } from '../../components/Common/constants';

const CasinoProviders = () => {
	// meta title
	document.title = projectName;
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);

	const { filterValidation, filterComponent, selectedFiltersComponent } =
		useFilters();

	const {
		casinoProvidersData,
		isCasinoProvidersDataLoading,
		page,
		setPage,
		itemsPerPage,
		onChangeRowsPerPage,
	} = useCasinoProvidersListing(filterValidation.values);

	const {
		isOpen,
		setIsOpen,
		formFields,
		header,
		validation,
		isCreateProviderLoading,
		columns,
		isEditProviderLoading,
		isEdit,
		showModal,
		setShowModal,
		actionList,
	} = useCreateProvider();

	return (
		<div className="page-content">
			<Container fluid>
				{showBreadcrumb && (
					<Breadcrumb
						title="Casino Management"
						breadcrumbItem="Casino Providers"
					/>
				)}
				<TableContainer
					columns={columns}
					data={casinoProvidersData?.providers || []}
					isGlobalFilter
					isPagination
					customPageSize={itemsPerPage}
					totalPageCount={casinoProvidersData?.totalPages}
					isManualPagination
					onChangePagination={setPage}
					currentPage={page}
					isLoading={!isCasinoProvidersDataLoading}
					changeRowsPerPageCallback={onChangeRowsPerPage}
					filterComponent={filterComponent}
					selectedFiltersComponent={selectedFiltersComponent}
					actionList={actionList}
				/>

				<FormModal
					isOpen={isOpen}
					setIsOpen={setIsOpen}
					showConfirmationModal={showModal}
					setShowConfirmationModal={setShowModal}
					isEditOpen={isEdit?.open}
					header={header}
					validation={validation}
					formFields={formFields}
					submitLabel="Submit"
					customColClasses="col-md-12"
					isSubmitLoading={isCreateProviderLoading || isEditProviderLoading}
				/>
				<ConfirmationModal
					openModal={showModal}
					setOpenModal={setShowModal}
					validation={validation}
					pageType={formPageTitle.providers}
				/>
			</Container>
		</div>
	);
};

CasinoProviders.propTypes = {
	// t: PropTypes.func,
};

CasinoProviders.defaultProps = {
	t: (string) => string,
};

export default CasinoProviders;
