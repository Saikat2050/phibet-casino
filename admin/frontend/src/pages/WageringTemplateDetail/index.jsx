/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/prop-types */
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Container } from 'reactstrap';
import Breadcrumb from '../../components/Common/Breadcrumb';
import TableContainer from '../../components/Common/Table';

import useWageringTemplate from './hooks/useWageringTemplate';
import { projectName } from '../../constants/config';
import useFilters from './hooks/useFilters';

const WageringTemplate = () => {
	// Set meta title
	document.title = projectName;
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);

	const { filterValidation, filterComponent, selectedFiltersComponent } =
		useFilters();

	const {
		wageringTemplateDetail,
		wageringTemplateDetailLoading,
		totalwageringTemplateDetailCount,
		page,
		setPage,
		itemsPerPage,
		onChangeRowsPerPage,
		columns,
		actionList,
	} = useWageringTemplate(filterValidation.values);

	return (
		<div className="page-content">
			<Container fluid>
				{showBreadcrumb && (
					<Breadcrumb
						title="Bonus Management"
						breadcrumbItem="Wagering Template"
					/>
				)}

				<TableContainer
					columns={columns}
					data={wageringTemplateDetail?.wageringTemplates || []}
					isAddOptions={false}
					isPagination
					customPageSize={itemsPerPage}
					totalPageCount={totalwageringTemplateDetailCount}
					isManualPagination
					onChangePagination={setPage}
					currentPage={page}
					isLoading={wageringTemplateDetailLoading}
					isGlobalFilter
					changeRowsPerPageCallback={onChangeRowsPerPage}
					actionList={actionList}
					filterComponent={filterComponent}
					selectedFiltersComponent={selectedFiltersComponent}
				/>
			</Container>
		</div>
	);
};

WageringTemplate.propTypes = {
	// t: PropTypes.func,
};

WageringTemplate.defaultProps = {
	t: (string) => string,
};

export default WageringTemplate;
