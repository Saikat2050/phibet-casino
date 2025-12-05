import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Container } from 'reactstrap';
import Breadcrumb from '../../components/Common/Breadcrumb';
import TableContainer from '../../components/Common/Table';
import { projectName } from '../../constants/config';
import useBonusListing from './hooks/useBonusListing';
import useFilters from './hooks/useFilters';

const BonusDetail = () => {
	// meta title
	document.title = projectName;
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);

	const { filterValidation, filterComponent, selectedFiltersComponent } =
		useFilters();

	const {
		formattedBonusDetails,
		isLoading,
		page,
		setPage,
		totalBonusCount,
		itemsPerPage,
		onChangeRowsPerPage,
		columns,
		actionList,
	} = useBonusListing(filterValidation.values);

	return (
		<div className="page-content">
			<Container fluid>
				{showBreadcrumb && (
					<Breadcrumb title="Bonus Management" breadcrumbItem="Bonus" />
				)}
				<TableContainer
					columns={columns}
					data={formattedBonusDetails}
					isGlobalFilter
					isPagination
					customPageSize={itemsPerPage}
					totalPageCount={totalBonusCount}
					isManualPagination
					onChangePagination={setPage}
					currentPage={page}
					isLoading={!isLoading}
					changeRowsPerPageCallback={onChangeRowsPerPage}
					filterComponent={filterComponent}
					selectedFiltersComponent={selectedFiltersComponent}
					actionList={actionList}
				/>
			</Container>
		</div>
	);
};

BonusDetail.propTypes = {
	// t: PropTypes.func,
};

BonusDetail.defaultProps = {
	t: (string) => string,
};

export default BonusDetail;
