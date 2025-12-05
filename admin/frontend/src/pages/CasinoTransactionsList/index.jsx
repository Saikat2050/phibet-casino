import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';
import TableContainer from '../../components/Common/Table';
import Breadcrumb from '../../components/Common/Breadcrumb';
import useCasinoTransactionsListing from './hooks/useCasinoTransactionsListing';
import { projectName } from '../../constants/config';
import useFilters from './hooks/useFilters';
import DepositWithdrawalInfo from '../../components/DepositWithdrawalInfo';
import CrudSection from '../../components/Common/CrudSection';

const pageTitle = 'Casino Transactions';

const CasinoTransactionsList = ({ userId }) => {
	document.title = projectName;
	const { filterValidation, filterComponent, selectedFiltersComponent } =
		useFilters(userId);

	const {
		currentPage,
		setCurrentPage,
		isCasinoTransactionsLoading,
		formattedCasinoTransactions,
		itemsPerPage,
		casinoTransactions,
		onChangeRowsPerPage,
		columns,
		actionList,
	} = useCasinoTransactionsListing(filterValidation.values, userId);

	return (
		<div className={`${userId ? '' : 'page-content'}`}>
			<Container fluid>
				{!userId ? (
					<Breadcrumb title="Reports" breadcrumbItem={pageTitle} />
				) : (
					<CrudSection title={pageTitle} />
				)}

				<TableContainer
					isLoading={isCasinoTransactionsLoading}
					columns={columns}
					data={formattedCasinoTransactions}
					isPagination
					customPageSize={itemsPerPage}
					paginationDiv="justify-content-center"
					pagination="pagination justify-content-start pagination-rounded"
					totalPageCount={casinoTransactions?.totalPages || 0}
					isManualPagination
					onChangePagination={setCurrentPage}
					currentPage={currentPage}
					changeRowsPerPageCallback={onChangeRowsPerPage}
					customTableInfo={
						!userId ? (
							<DepositWithdrawalInfo // Hide deposit withdraw info from specific player report
								currencyId={filterValidation.values?.currencyId}
								values={[
									{
										label: 'Total Wagered',
										value: casinoTransactions?.totalBetAmount || 0,
										type: 'in',
									},
									{
										label: 'Total Payout',
										value: casinoTransactions?.totalWinAmount || 0,
										colorClass: 'text-danger',
									},
									{
										label: 'Total Profit',
										value: (
											Number(casinoTransactions?.totalBetAmount || 0) -
											Number(casinoTransactions?.totalWinAmount || 0)
										)?.toFixed(2),
										type: 'in',
									},
								]}
							/>
						) : null
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
CasinoTransactionsList.defaultProps = {
	userId: '',
};

CasinoTransactionsList.propTypes = {
	userId: PropTypes.string,
};

export default CasinoTransactionsList;
