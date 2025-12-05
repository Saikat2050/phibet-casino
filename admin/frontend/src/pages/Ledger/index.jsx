import React from 'react';
import { Container } from 'reactstrap';
import PropTypes from 'prop-types';
import TableContainer from '../../components/Common/Table';
import useLedgerListing from './hooks/useLedgerListing';
import CrudSection from '../../components/Common/CrudSection';
import Breadcrumb from '../../components/Common/Breadcrumb';
import useFilters from './hooks/useFilters';

const pageTitle = 'Ledgers';

const Ledger = ({ userId }) => {
	const { selectedFiltersComponent, filterComponent, filterValidation } =
		useFilters(userId);

	const {
		currentPage,
		setCurrentPage,
		totalLedgerCount,
		ledgerDetailLoading,
		formattedLedgerDetails,
		itemsPerPage,
		onChangeRowsPerPage,
		columns,
		actionList,
	} = useLedgerListing(userId, filterValidation?.values);

	return (
		<div className={`${userId ? '' : 'page-content'}`}>
			<Container fluid>
				{!userId ? (
					<Breadcrumb title="Reports" breadcrumbItem={pageTitle} />
				) : (
					<CrudSection title={pageTitle} />
				)}
				<TableContainer
					isLoading={ledgerDetailLoading}
					columns={columns}
					data={formattedLedgerDetails}
					isPagination
					customPageSize={itemsPerPage}
					totalPageCount={totalLedgerCount}
					isManualPagination
					onChangePagination={setCurrentPage}
					currentPage={currentPage}
					changeRowsPerPageCallback={onChangeRowsPerPage}
					selectedFiltersComponent={selectedFiltersComponent}
					filterComponent={filterComponent}
					actionList={actionList}
				/>
			</Container>
		</div>
	);
};

Ledger.defaultProps = {
	userId: '',
};

Ledger.propTypes = {
	userId: PropTypes.string,
};

export default Ledger;
