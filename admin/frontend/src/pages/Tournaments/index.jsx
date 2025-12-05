import React from 'react';
import { Container } from 'reactstrap';
import { useSelector } from 'react-redux';
import useTournaments from './hooks/useTournaments';
import TableContainer from '../../components/Common/Table/index';
import Breadcrumb from '../../components/Common/Breadcrumb';

const Tournament = () => {
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);

	const {
		itemsPerPage,
		currentPage,
		setCurrentPage,
		onChangeRowsPerPage,
		totalPages,
		tournamentsInfo,
		columns,
		actionList,
		isTournamentsInfoLoading,
		filterComponent,
		selectedFiltersComponent,
	} = useTournaments();

	return (
		<div className="page-content">
			<Container fluid>
				{showBreadcrumb && (
					<Breadcrumb title="Tournaments" breadcrumbItem="Tournaments" />
				)}

				<TableContainer
					isLoading={isTournamentsInfoLoading}
					columns={columns || []}
					data={tournamentsInfo?.casinoTournaments || []}
					isPagination
					customPageSize={itemsPerPage}
					totalPageCount={totalPages}
					isManualPagination
					onChangePagination={setCurrentPage}
					currentPage={currentPage}
					changeRowsPerPageCallback={onChangeRowsPerPage}
					filterComponent={filterComponent}
					selectedFiltersComponent={selectedFiltersComponent}
					actionList={actionList}
				/>
			</Container>
		</div>
	);
};

Tournament.propTypes = {};

export default Tournament;
