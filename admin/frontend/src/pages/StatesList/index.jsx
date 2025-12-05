import React from 'react';
import { useSelector } from 'react-redux';
import { Container } from 'reactstrap';
import Breadcrumb from '../../components/Common/Breadcrumb';
import TableContainer from '../../components/Common/Table';
import useStatesListing from './hooks/useStatesListing';
import { projectName } from '../../constants/config';
import useEditState from './hooks/useEditState';
import useFilters from './hooks/useFilters';

const StatesList = () => {
	document.title = projectName;
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);

	const { filterValidation, selectedFiltersComponent, filterComponent } =
		useFilters();

	const {
		currentPage,
		setCurrentPage,
		totalStatesCount,
		isStatesLoading,
		formattedStates,
		itemsPerPage,
		onChangeRowsPerPage,
	} = useStatesListing(filterValidation.values);

	const { columns } = useEditState();

	return (
		<div className="page-content">
			<Container fluid>
				{showBreadcrumb && (
					<Breadcrumb title="Site Configurations" breadcrumbItem="States" />
				)}
				<TableContainer
					isLoading={isStatesLoading}
					columns={columns}
					data={formattedStates}
					isPagination
					customPageSize={itemsPerPage}
					totalPageCount={totalStatesCount}
					isManualPagination
					onChangePagination={setCurrentPage}
					currentPage={currentPage}
					changeRowsPerPageCallback={onChangeRowsPerPage}
					selectedFiltersComponent={selectedFiltersComponent}
					filterComponent={filterComponent}
				/>
			</Container>
		</div>
	);
};

StatesList.propTypes = {
	// t: PropTypes.func,
};

StatesList.defaultProps = {
	t: (string) => string,
};

export default StatesList;
