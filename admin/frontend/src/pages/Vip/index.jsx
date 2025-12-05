import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux';
import { Container } from 'reactstrap';
import Breadcrumb from '../../components/Common/Breadcrumb';
import TableContainer from '../../components/Common/Table';
import { projectName } from '../../constants/config';
import useVipTiersListing from './hooks/useVipTiersListing';

const VIPtiers = () => {
	document.title = projectName;
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);

	const {
		isLoading,
		columns,
		vipTiers,
		onChangeRowsPerPage,
		itemsPerPage,
		setPage,
		page,
		actionList,
		totalPages,
		// navigate
	} = useVipTiersListing();

	return (
		<div className="page-content">
			<Container fluid>
				{showBreadcrumb && (
					<Breadcrumb title="VIP Tier" breadcrumbItem="VIP Tier" />
				)}
				<TableContainer
					columns={columns}
					data={vipTiers}
					isAddOptions={false}
					isPagination
					customPageSize={itemsPerPage}
					totalPageCount={totalPages || 1}
					isManualPagination
					onChangePagination={setPage}
					currentPage={page}
					isLoading={isLoading}
					isGlobalFilter
					changeRowsPerPageCallback={onChangeRowsPerPage}
					// filterComponent={filterComponent}
					// selectedFiltersComponent={selectedFiltersComponent}
					actionList={actionList}
				/>
			</Container>
		</div>
	);
};

VIPtiers.propTypes = {
	// t: PropTypes.func,
};

VIPtiers.defaultProps = {
	// t: (string) => string,
};

export default VIPtiers;
