import React from 'react';
import { Container, Row, Col, Card, CardBody, Button } from 'reactstrap';
import TableContainer from '../../../components/Common/Table';
import useRemoveRestrictedGame from '../hooks/useRemoveRestrictedGame';

const RemoveRestrictedGames = () => {
	const {
		currentPage,
		setCurrentPage,
		itemsPerPage,
		removeGamesCurrentPage,
		setRemoveGamesCurrentPage,
		removeGamesItemsPerPage,
		restrictedGamescolumns,
		removeGamescolumns,
		restrictedGamesList,
		totalGamesCount,
		restrictedGamesLoading,
		onChangeRowsPerPage,
		onChangeRemoveGamesRowsPerPage,
		selectedGames,
		removeRestrictedGames,
	} = useRemoveRestrictedGame();

	return (
		<Container fluid>
			<Row>
				<Col lg="12">
					{selectedGames?.length ? (
						<Card>
							<div className="mx-4 pt-3 d-flex justify-content-between">
								<h5>Selected Games</h5>
								<Button
									type="button"
									className="btn btn-sm btn-success font-size-14"
									onClick={removeRestrictedGames}
								>
									Submit
								</Button>
							</div>
							<CardBody>
								<TableContainer
									columns={removeGamescolumns}
									data={selectedGames || []}
									isPagination
									customPageSize={removeGamesItemsPerPage}
									tableClass="table-bordered align-middle nowrap"
									paginationDiv="justify-content-center"
									pagination="pagination justify-content-start pagination-rounded"
									totalPageCount={selectedGames?.length || 0}
									isManualPagination
									onChangePagination={setRemoveGamesCurrentPage}
									currentPage={removeGamesCurrentPage}
									isLoading={false}
									changeRowsPerPageCallback={onChangeRemoveGamesRowsPerPage}
									columnType="toggleColumns2"
								/>
							</CardBody>
						</Card>
					) : (
						<Card>
							<h4 className="text-center text-primary p-5">
								Games you remove will appear here.
							</h4>
						</Card>
					)}
					<Card>
						<div className="mx-4 pt-3">
							<h5>Restricted Games</h5>
						</div>
						<CardBody>
							<TableContainer
								columns={restrictedGamescolumns}
								data={restrictedGamesList || []}
								isPagination
								customPageSize={itemsPerPage}
								tableClass="table-bordered align-middle nowrap"
								paginationDiv="justify-content-center"
								pagination="pagination justify-content-start pagination-rounded"
								totalPageCount={totalGamesCount}
								isManualPagination
								onChangePagination={setCurrentPage}
								currentPage={currentPage}
								isLoading={restrictedGamesLoading}
								changeRowsPerPageCallback={onChangeRowsPerPage}
								columnType="toggleColumns2"
							/>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default RemoveRestrictedGames;
