/* eslint-disable no-unused-vars */
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Card, CardBody } from 'reactstrap';
import { useSelector } from 'react-redux';
import { projectName } from '../../constants/config';
import TableContainer from '../../components/Common/Table';
import Breadcrumb from '../../components/Common/Breadcrumb';
import CrudSection from '../../components/Common/CrudSection';
import FormModal from '../../components/Common/FormModal';
import Filters from '../../components/Common/Filters';
import useFilters from './hooks/useFilters';
import ConfirmationModal from '../../components/Common/ConfirmationModal';
import { formPageTitle } from '../../components/Common/constants';
import useSeoColumn from './hooks/useSeoColumn';
import useCreateSeo from './hooks/useCreateSeo';
import useSeoListing from './hooks/useSeoListing';

const MetaTags = () => {
	document.title = projectName;
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);

	const {
		toggleAdvance,
		isAdvanceOpen,
		filterFields,
		actionButtons,
		filterValidation,
		isFilterChanged,
	} = useFilters();

	const {
		formattedCasinoCategoriesData,
		seoRoutesLoading,
		page,
		setPage,
		itemsPerPage,
		totalPages,
		onChangeRowsPerPage,
		onClickDelete,
		deleteRouteInprogress,
	} = useSeoListing(filterValidation.values);

	const {
		isOpen,
		formFields,
		header,
		validation,
		createRouteInprogress,
		buttonList,
		onClickEdit,
		updateRouteInprogress,
		showModal,
		setShowModal,
		toggleFormModal,
		isEdit,
		handleViewClick,
	} = useCreateSeo();

	const columns = useSeoColumn({
		onClickEdit,
		handleViewClick,
		onClickDelete,
		deleteRouteInprogress,
	});

	return (
		<div className="page-content">
			<div className="container-fluid">
				{showBreadcrumb && (
					<Breadcrumb title="Content Management" breadcrumbItem="SEO" />
				)}

				<Row>
					<Col lg="12">
						<Card>
							<CrudSection buttonList={buttonList} title="Seo Slugs" />
							<CardBody>
								<Filters
									validation={filterValidation}
									filterFields={filterFields}
									actionButtons={actionButtons}
									isAdvanceOpen={isAdvanceOpen}
									toggleAdvance={toggleAdvance}
									isFilterChanged={isFilterChanged}
								/>
								<TableContainer
									columns={columns}
									data={formattedCasinoCategoriesData}
									isLoading={seoRoutesLoading}
									isGlobalFilter
									isPagination
									customPageSize={itemsPerPage}
									tableClass="table-bordered align-middle nowrap mt-2"
									paginationDiv="justify-content-center"
									pagination="pagination justify-content-start pagination-rounded"
									totalPageCount={totalPages}
									isManualPagination
									onChangePagination={setPage}
									currentPage={page}
									changeRowsPerPageCallback={onChangeRowsPerPage}
								/>
								<FormModal
									isOpen={isOpen}
									toggle={toggleFormModal}
									header={header}
									validation={validation}
									formFields={formFields}
									submitLabel={isEdit?.open ? 'Edit Slugs' : 'Add Slugs'}
									customColClasses="col-md-12"
									isSubmitLoading={
										createRouteInprogress || updateRouteInprogress
									}
								/>
								<ConfirmationModal
									openModal={showModal}
									setOpenModal={setShowModal}
									validation={validation}
									pageType={formPageTitle.categories}
								/>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</div>
		</div>
	);
};

export default MetaTags;
