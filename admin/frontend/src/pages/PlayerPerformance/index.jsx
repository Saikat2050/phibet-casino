import React from 'react';
// import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Container } from 'reactstrap';
import TableContainer from '../../components/Common/Table';
import Breadcrumb from '../../components/Common/Breadcrumb';
import { projectName } from '../../constants/config';
import useFilters from './hooks/useFilters';
import usePlayerPerformance from './hooks/usePlayerPerformance';

const PlayerPerformance = () => {
	document.title = projectName;
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);

	const { filterValidation, filterComponent, selectedFiltersComponent } =
		useFilters();

	const {
		currentPage,
		setCurrentPage,
		totalCount,
		loading,
		playerPerformance,
		itemsPerPage,
		onChangeRowsPerPage,
		columns,
		actionList,
		// timezone,
		// setTimezone,
	} = usePlayerPerformance(filterValidation.values);

	return (
		<div className="page-content">
			<Container fluid>
				{showBreadcrumb && (
					<Breadcrumb title="Reports" breadcrumbItem="Player Performance" />
				)}
				<TableContainer
					isLoading={loading}
					columns={columns}
					data={playerPerformance}
					isPagination
					customPageSize={itemsPerPage}
					paginationDiv="justify-content-center"
					pagination="pagination justify-content-start pagination-rounded"
					totalPageCount={totalCount}
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

PlayerPerformance.propTypes = {
	// t: PropTypes.func,
};

PlayerPerformance.defaultProps = {
	t: (string) => string,
};

export default PlayerPerformance;
