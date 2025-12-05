import React from 'react';
import { Card, CardBody, Container } from 'reactstrap';
import TableContainer from '../../../components/Common/Table';
import useRestrictedProvidersListing from '../hooks/useRestrictedProvidersListing';

const RestrictedProviders = () => {
	const {
		currentPage,
		setCurrentPage,
		itemsPerPage,
		columns,
		restrictedProvidersList,
		totalProvidersCount,
		restrictedProvidersLoading,
		onChangeRowsPerPage,
	} = useRestrictedProvidersListing();

	return (
		<Container fluid>
			<Card>
				<CardBody>
					<TableContainer
						columns={columns || []}
						data={restrictedProvidersList || []}
						isPagination
						customPageSize={itemsPerPage}
						tableClass="table-bordered align-middle nowrap mt-2"
						paginationDiv="justify-content-center"
						pagination="pagination justify-content-start pagination-rounded"
						totalPageCount={totalProvidersCount}
						isManualPagination
						onChangePagination={setCurrentPage}
						currentPage={currentPage}
						isLoading={restrictedProvidersLoading}
						changeRowsPerPageCallback={onChangeRowsPerPage}
					/>
				</CardBody>
			</Card>
		</Container>
	);
};

export default RestrictedProviders;
