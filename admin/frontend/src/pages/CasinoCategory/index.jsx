import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux';
import { projectName } from '../../constants/config';
import useCasinoCategoryColumn from './hooks/useCasinoCategoryColumn';
import TableContainer from '../../components/Common/Table';
import Breadcrumb from '../../components/Common/Breadcrumb';
import useCasinoCategoryListing from './hooks/useCasinoCategoryListing';
// import CrudSection from '../../components/Common/CrudSection';
import FormModal from '../../components/Common/FormModal';
import useCreateCategory from './hooks/useCreateCategory';
// import Filters from '../../components/Common/Filters';
import useFilters from './hooks/useFilters';
import ConfirmationModal from '../../components/Common/ConfirmationModal';
import { formPageTitle } from '../../components/Common/constants';

const GetCasinoCategoryDetails = () => {
	document.title = projectName;
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);

	const { filterValidation, filterComponent, selectedFiltersComponent } =
		useFilters();

	const {
		formattedCasinoCategoriesData,
		iscasinoCategoryDetailsLoading,
		page,
		setPage,
		itemsPerPage,
		totalPages,
		onChangeRowsPerPage,
		handleStatus,
		handleAddGameClick,
		handleDeleteClick,
	} = useCasinoCategoryListing(filterValidation.values);

	const {
		isOpen,
		formFields,
		header,
		validation,
		isCreateCategoryLoading,
		onClickEdit,
		isEditCategoryLoading,
		showModal,
		setShowModal,
		toggleFormModal,
		actionList,
	} = useCreateCategory();

	const columns = useCasinoCategoryColumn({
		handleStatus,
		onClickEdit,
		handleAddGameClick,
		handleDeleteClick,
	});

	return (
		<div className="page-content">
			<div className="container-fluid">
				{showBreadcrumb && (
					<Breadcrumb
						title="Casino Management"
						breadcrumbItem="Casino Category"
					/>
				)}
				<TableContainer
					columns={columns}
					data={formattedCasinoCategoriesData}
					isLoading={!iscasinoCategoryDetailsLoading}
					isGlobalFilter
					isPagination
					customPageSize={itemsPerPage}
					totalPageCount={totalPages}
					isManualPagination
					onChangePagination={setPage}
					currentPage={page}
					changeRowsPerPageCallback={onChangeRowsPerPage}
					filterComponent={filterComponent}
					selectedFiltersComponent={selectedFiltersComponent}
					actionList={actionList}
				/>
				<FormModal
					isOpen={isOpen}
					toggle={toggleFormModal}
					header={header}
					validation={validation}
					formFields={formFields}
					submitLabel="Submit"
					customColClasses="col-md-12"
					isSubmitLoading={isCreateCategoryLoading || isEditCategoryLoading}
				/>
				<ConfirmationModal
					openModal={showModal}
					setOpenModal={setShowModal}
					validation={validation}
					pageType={formPageTitle.categories}
				/>
			</div>
		</div>
	);
};

export default GetCasinoCategoryDetails;
