import React from 'react';
// import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Container } from 'reactstrap';
import TableContainer from '../../components/Common/Table';
import Breadcrumb from '../../components/Common/Breadcrumb';
import useLanguageListing from './hooks/useLanguageListing';
import { projectName } from '../../constants/config';
import useFilters from './hooks/useFilters';

const LanguageList = () => {
	document.title = projectName;
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);

	const { filterValidation, filterComponent, selectedFiltersComponent } =
		useFilters();

	const {
		currentPage,
		setCurrentPage,
		totalLanguagesCount,
		isLanguagesLoading,
		formattedLanguages,
		itemsPerPage,
		onChangeRowsPerPage,
		columns,
	} = useLanguageListing(filterValidation.values);

	return (
		<div className="page-content">
			<Container fluid>
				{showBreadcrumb && (
					<Breadcrumb title="Site Configurations" breadcrumbItem="Languages" />
				)}
				<TableContainer
					isLoading={isLanguagesLoading}
					columns={columns}
					data={formattedLanguages}
					isPagination
					customPageSize={itemsPerPage}
					totalPageCount={totalLanguagesCount}
					isManualPagination
					onChangePagination={setCurrentPage}
					currentPage={currentPage}
					changeRowsPerPageCallback={onChangeRowsPerPage}
					filterComponent={filterComponent}
					selectedFiltersComponent={selectedFiltersComponent}
				/>
			</Container>
		</div>
	);
};

LanguageList.propTypes = {
	// t: PropTypes.func,
};

LanguageList.defaultProps = {
	t: (string) => string,
};

export default LanguageList;
