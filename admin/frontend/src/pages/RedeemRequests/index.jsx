import React from 'react';
import { Container } from 'reactstrap';
import { useSelector } from 'react-redux';
import TableContainer from '../../components/Common/Table';
import Breadcrumb from '../../components/Common/Breadcrumb';
import useRedeemRequests from './hooks/useRedeemRequests';
import FormModal from '../../components/Common/FormModal';

const RedeemRequests = () => {
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);

	const {
		columns,
		formattedRedeem,
		itemsPerPage,
		setCurrentPage,
		currentPage,
		onChangeRowsPerPage,
		isOpen,
		toggleFormModal,
		header,
		validation,
		formFields,
		userTagsLoading,
		totalPlayerPages,
	} = useRedeemRequests();

	return (
		<div className="page-content">
			<Container fluid>
				{showBreadcrumb && (
					<Breadcrumb title="Reports" breadcrumbItem="Redeem Requests" />
				)}
				<TableContainer
					isLoading={userTagsLoading}
					columns={columns || []}
					data={formattedRedeem}
					isPagination
					customPageSize={itemsPerPage}
					tableClass="table-bordered align-middle nowrap mt-2"
					isShowColSettings
					totalPageCount={totalPlayerPages}
					isManualPagination
					onChangePagination={setCurrentPage}
					currentPage={currentPage}
					changeRowsPerPageCallback={onChangeRowsPerPage}
				/>
				<FormModal
					isOpen={isOpen}
					toggle={toggleFormModal}
					header={header}
					validation={validation}
					submitLabel="Create"
					customColClasses="col-md-12"
					formFields={formFields}
				/>
			</Container>
		</div>
	);
};

export default RedeemRequests;
