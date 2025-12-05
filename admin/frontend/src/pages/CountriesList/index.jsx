import React from 'react';
import { useSelector } from 'react-redux';
import { Container } from 'reactstrap';
// import PropTypes from 'prop-types';
import Breadcrumb from '../../components/Common/Breadcrumb';
import TableContainer from '../../components/Common/Table';

import useCountriesListing from './hooks/useCountriesListing';
import { projectName } from '../../constants/config';
import FormModal from '../../components/Common/FormModal';
import useEditCountry from './hooks/useEditCountry';
import useFilters from './hooks/useFilters';

const CountriesList = () => {
	document.title = projectName;
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);

	const { filterValidation, selectedFiltersComponent, filterComponent } =
		useFilters();

	const {
		currentPage,
		setCurrentPage,
		totalCountriesCount,
		isCountriesLoading,
		formattedCountries,
		itemsPerPage,
		onChangeRowsPerPage,
	} = useCountriesListing(filterValidation.values);

	const {
		isOpen,
		setIsOpen,
		header,
		validation,
		formFields,
		isEditCountryLoading,
		columns,
	} = useEditCountry();

	return (
		<div className="page-content">
			<Container fluid>
				{showBreadcrumb && (
					<Breadcrumb title="Site Configurations" breadcrumbItem="Countries" />
				)}
				<TableContainer
					isLoading={isCountriesLoading}
					columns={columns}
					data={formattedCountries}
					isPagination
					customPageSize={itemsPerPage}
					totalPageCount={totalCountriesCount}
					isManualPagination
					onChangePagination={setCurrentPage}
					currentPage={currentPage}
					changeRowsPerPageCallback={onChangeRowsPerPage}
					selectedFiltersComponent={selectedFiltersComponent}
					filterComponent={filterComponent}
				/>
				<FormModal
					isOpen={isOpen}
					toggle={() => setIsOpen((prev) => !prev)}
					header={header}
					validation={validation}
					formFields={formFields}
					submitLabel="Submit"
					customColClasses="col-md-12"
					isSubmitLoading={isEditCountryLoading}
				/>
			</Container>
		</div>
	);
};

CountriesList.propTypes = {
	// t: PropTypes.func,
};

CountriesList.defaultProps = {
	t: (string) => string,
};

export default CountriesList;
