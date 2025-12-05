import React from 'react';
// import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Container } from 'reactstrap';
import TableContainer from '../../components/Common/Table';
import Breadcrumb from '../../components/Common/Breadcrumb';
import { projectName } from '../../constants/config';
import useFilters from './hooks/useFilters';
import useGameTransactionsListing from './hooks/useGameTransactionsListing';
import DepositWithdrawalInfo from '../../components/DepositWithdrawalInfo';

const GameTransactionsList = () => {
	document.title = projectName;
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);

	const { filterValidation, filterComponent, selectedFiltersComponent } =
		useFilters();

	const {
		currentPage,
		setCurrentPage,
		totalCount,
		loading,
		gameTransactions,
		itemsPerPage,
		onChangeRowsPerPage,
		columns,
		actionList,
	} = useGameTransactionsListing(filterValidation.values);

	return (
		<div className="page-content">
			<Container fluid>
				{showBreadcrumb && (
					<Breadcrumb title="Reports" breadcrumbItem="Game Reports" />
				)}
				<TableContainer
					isLoading={loading}
					columns={columns}
					data={gameTransactions?.gameReport || []}
					isPagination
					customPageSize={itemsPerPage}
					tableClass="table-bordered align-middle nowrap mt-2"
					// paginationDiv="col-sm-12 col-md-7"
					paginationDiv="justify-content-center"
					pagination="pagination justify-content-start pagination-rounded"
					totalPageCount={totalCount}
					isManualPagination
					onChangePagination={setCurrentPage}
					currentPage={currentPage}
					changeRowsPerPageCallback={onChangeRowsPerPage}
					customTableInfo={
						<DepositWithdrawalInfo
							currencyId={filterValidation.values?.currencyId}
							values={[
								{
									label: 'Total Wagered',
									value: gameTransactions?.totalBetAmount || 0,
									type: 'in',
								},
								{
									label: 'Total Payout',
									value: gameTransactions?.totalWinAmount || 0,
									colorClass: 'text-danger',
								},
								{
									label: 'Total Profit',
									value: (
										Number(gameTransactions?.totalBetAmount || 0) -
										Number(gameTransactions?.totalWinAmount || 0)
									)?.toFixed(2),
									type: 'in',
								},
							]}
						/>
					}
					filterComponent={filterComponent}
					selectedFiltersComponent={selectedFiltersComponent}
					actionList={actionList}
					customSearchClass=""
				/>
			</Container>
		</div>
	);
};

GameTransactionsList.propTypes = {
	// t: PropTypes.func,
};

GameTransactionsList.defaultProps = {
	t: (string) => string,
};

export default GameTransactionsList;
