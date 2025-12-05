import React, { useEffect } from 'react';
import { Container } from 'reactstrap';
import { useSelector } from 'react-redux';
import TableContainer from '../../components/Common/Table';
import Breadcrumb from '../../components/Common/Breadcrumb';
import useAmoeListing from './hooks/useAmoeListing';
import useFilters from './hooks/useFilters';

const AMOE = () => {
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);

	const { filterComponent, selectedFiltersComponent, filterValidation } =
		useFilters();

	const {
		columns,
		actionList,
		formattedAmoe,
		itemsPerPage,
		setCurrentPage,
		currentPage,
		onChangeRowsPerPage,
		loading,
		totalPages,
	} = useAmoeListing();

	useEffect(() => {
		setCurrentPage(1);
	}, [filterValidation.values]);

	return (
		<div className="page-content">
			<Container fluid>
				{showBreadcrumb && (
					<Breadcrumb title="AMOE" breadcrumbItem="Alternate Method of Entry" />
				)}

				<TableContainer
					isLoading={loading}
					columns={columns || []}
					data={formattedAmoe}
					isPagination
					customPageSize={itemsPerPage}
					totalPageCount={totalPages}
					isManualPagination
					onChangePagination={setCurrentPage}
					currentPage={currentPage}
					changeRowsPerPageCallback={onChangeRowsPerPage}
					isShowColSettings={false}
					actionList={actionList}
					filterComponent={filterComponent}
					selectedFiltersComponent={selectedFiltersComponent}
				/>
			</Container>
		</div>
	);
};

export default AMOE;
