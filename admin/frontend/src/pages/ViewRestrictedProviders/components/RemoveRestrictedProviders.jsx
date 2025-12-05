import React from 'react';
import { Container, Row, Col, Card, CardBody, Button } from 'reactstrap';
import TableContainer from '../../../components/Common/Table';
import useRemoveRestrictedProviders from '../hooks/useRemoveRestrictedProviders';

const RemoveRestrictedProviders = () => {
	const {
		currentPage,
		setCurrentPage,
		itemsPerPage,
		removeProvidersCurrentPage,
		setRemoveProvidersCurrentPage,
		removeProvidersItemsPerPage,
		restrictedProviderscolumns,
		removeProviderscolumns,
		restrictedProvidersList,
		totalProvidersCount,
		restrictedProvidersLoading,
		onChangeRowsPerPage,
		onChangeRemoveProvidersRowsPerPage,
		selectedProviders,
		removeRestrictedProviders,
	} = useRemoveRestrictedProviders();

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
									onClick={removeRestrictedProviders}
								>
									Submit
								</Button>
							</div>
							<CardBody>
								<TableContainer
									columns={removeProviderscolumns}
									data={selectedProviders || []}
									isPagination
									customPageSize={removeProvidersItemsPerPage}
									tableClass="table-bordered align-middle nowrap"
									paginationDiv="justify-content-center"
									pagination="pagination justify-content-start pagination-rounded"
									totalPageCount={selectedProviders?.length || 0}
									isManualPagination
									onChangePagination={setRemoveProvidersCurrentPage}
									currentPage={removeProvidersCurrentPage}
									isLoading={false}
									changeRowsPerPageCallback={onChangeRemoveProvidersRowsPerPage}
								/>
							</CardBody>
						</Card>
					) : (
						<Card>
							<h4 className="text-center text-primary p-5">
								Providers you remove will appear here.
							</h4>
						</Card>
					)}
					<Card>
						<div className="mx-4 pt-3">
							<h5>Restricted Games</h5>
						</div>
						<CardBody>
							<TableContainer
								columns={restrictedProviderscolumns}
								data={restrictedProvidersList || []}
								isPagination
								customPageSize={itemsPerPage}
								tableClass="table-bordered align-middle nowrap"
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
				</Col>
			</Row>
		</Container>
	);
};

export default RemoveRestrictedProviders;
