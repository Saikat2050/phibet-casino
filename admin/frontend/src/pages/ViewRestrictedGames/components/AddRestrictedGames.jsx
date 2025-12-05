import React from 'react';
import { Container, Row, Col, Card, CardBody, Button } from 'reactstrap';
import useAddRestrictedGame from '../hooks/useAddRestrictedGame';
import TableContainer from '../../../components/Common/Table';

const AddRestrictedGames = () => {
	const {
		currentPage,
		setCurrentPage,
		itemsPerPage,
		addGamesCurrentPage,
		setAddGamesCurrentPage,
		addGamesItemsPerPage,
		unrestrictedGamescolumns,
		addGamescolumns,
		selectedGames,
		unrestrictedGamesList,
		totalGamesCount,
		unrestrictedGamesLoading,
		onChangeRowsPerPage,
		onChangeAddGamesRowsPerPage,
		addRestrictedGames,
	} = useAddRestrictedGame();

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
									onClick={addRestrictedGames}
								>
									Submit
								</Button>
							</div>
							<CardBody>
								<TableContainer
									columns={addGamescolumns}
									data={selectedGames || []}
									isPagination
									customPageSize={addGamesItemsPerPage}
									tableClass="table-bordered align-middle nowrap"
									paginationDiv="justify-content-center"
									pagination="pagination justify-content-start pagination-rounded"
									totalPageCount={selectedGames?.length || 0}
									isManualPagination
									onChangePagination={setAddGamesCurrentPage}
									currentPage={addGamesCurrentPage}
									isLoading={false}
									changeRowsPerPageCallback={onChangeAddGamesRowsPerPage}
									columnType="toggleColumns1"
								/>
							</CardBody>
						</Card>
					) : (
						<Card>
							<h4 className="text-center text-primary p-5">
								Games you add will appear here.
							</h4>
						</Card>
					)}
					<Card>
						<div className="mx-4 pt-3">
							<h5>Unrestricted Games</h5>
						</div>
						<CardBody>
							<TableContainer
								columns={unrestrictedGamescolumns}
								data={unrestrictedGamesList}
								isPagination
								customPageSize={itemsPerPage}
								tableClass="table-bordered align-middle nowrap"
								paginationDiv="justify-content-center"
								pagination="pagination justify-content-start pagination-rounded"
								totalPageCount={totalGamesCount}
								isManualPagination
								onChangePagination={setCurrentPage}
								currentPage={currentPage}
								isLoading={unrestrictedGamesLoading}
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

export default AddRestrictedGames;
