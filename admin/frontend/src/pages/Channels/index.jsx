import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux';
import { Container } from 'reactstrap';
import Breadcrumb from '../../components/Common/Breadcrumb';
import TableContainer from '../../components/Common/Table';
import { projectName } from '../../constants/config';
import useChannelListing from './hooks/useChannelListing';
import useFilters from './hooks/useFilters';

const Channels = () => {
	document.title = projectName;
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);

	const { filterValidation, filterComponent, selectedFiltersComponent } =
		useFilters();

	const {
		formattedchannelDetails,
		isLoading,
		page,
		setPage,
		totalCount,
		itemsPerPage,
		onChangeRowsPerPage,
		columns,
		actionList,
	} = useChannelListing(filterValidation.values);

	return (
		<div className="page-content">
			<Container fluid>
				{showBreadcrumb && (
					<Breadcrumb title="Chat Management" breadcrumbItem="Channel" />
				)}
				<TableContainer
					columns={columns}
					data={formattedchannelDetails || []}
					isGlobalFilter
					isPagination
					customPageSize={itemsPerPage}
					totalPageCount={totalCount || 15}
					isManualPagination
					onChangePagination={setPage}
					currentPage={page}
					isLoading={isLoading}
					changeRowsPerPageCallback={onChangeRowsPerPage}
					actionList={actionList}
					filterComponent={filterComponent}
					selectedFiltersComponent={selectedFiltersComponent}
				/>
			</Container>
		</div>
	);
};

Channels.propTypes = {};

Channels.defaultProps = {
	t: (string) => string,
};

export default Channels;
