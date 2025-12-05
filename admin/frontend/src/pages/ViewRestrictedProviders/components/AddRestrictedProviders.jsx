import React from 'react';
import { Container, Row, Col, Card, CardBody, Button } from 'reactstrap';
import TableContainer from '../../../components/Common/Table';
import useAddRestrictedProviders from '../hooks/useAddRestrictedProviders';

const AddRestrictedProviders = () => {
	const {
		currentPage,
		setCurrentPage,
		itemsPerPage,
		addProvidersCurrentPage,
		setAddProvidersCurrentPage,
		addProvidersItemsPerPage,
		unrestrictedProviderscolumns,
		addProviderscolumns,
		selectedProviders,
		unrestrictedProvidersList,
		totalProvidersCount,
		unrestrictedProvidersLoading,
		onChangeRowsPerPage,
		onChangeAddProvidersRowsPerPage,
		addRestrictedProvider,
	} = useAddRestrictedProviders();

	return (
		<Container fluid>
			<Row>
				<Col lg="12">
					{selectedProviders?.length ? (
						<Card>
							<div className="mx-4 pt-3 d-flex justify-content-between">
								<h5>Selected Providers</h5>
								<Button
									type="button"
									className="btn btn-sm btn-success font-size-14"
									onClick={addRestrictedProvider}
								>
									Submit
								</Button>
							</div>
							<CardBody>
								<TableContainer
									columns={addProviderscolumns}
									data={selectedProviders || []}
									isPagination
									customPageSize={addProvidersItemsPerPage}
									tableClass="table-bordered align-middle nowrap"
									paginationDiv="justify-content-center"
									pagination="pagination justify-content-start pagination-rounded"
									totalPageCount={selectedProviders?.length || 0}
									isManualPagination
									onChangePagination={setAddProvidersCurrentPage}
									currentPage={addProvidersCurrentPage}
									isLoading={false}
									changeRowsPerPageCallback={onChangeAddProvidersRowsPerPage}
								/>
							</CardBody>
						</Card>
					) : (
						<Card>
							<h4 className="text-center text-primary p-5">
								Providers you add will appear here.
							</h4>
						</Card>
					)}
					<Card>
						<div className="mx-4 pt-3">
							<h5>Unrestricted Providers</h5>
						</div>
						<CardBody>
							<TableContainer
								columns={unrestrictedProviderscolumns}
								data={unrestrictedProvidersList}
								isPagination
								customPageSize={itemsPerPage}
								tableClass="table-bordered align-middle nowrap"
								paginationDiv="justify-content-center"
								pagination="pagination justify-content-start pagination-rounded"
								totalPageCount={totalProvidersCount}
								isManualPagination
								onChangePagination={setCurrentPage}
								currentPage={currentPage}
								isLoading={unrestrictedProvidersLoading}
								changeRowsPerPageCallback={onChangeRowsPerPage}
							/>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default AddRestrictedProviders;
