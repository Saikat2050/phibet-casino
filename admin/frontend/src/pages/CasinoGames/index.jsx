import React from 'react';
import { useSelector } from 'react-redux';
import { CardBody, Container } from 'reactstrap';
import Breadcrumb from '../../components/Common/Breadcrumb';
import TableContainer from '../../components/Common/Table';
import { projectName } from '../../constants/config';
import useCasinoGamesListings from './hooks/useCasinoGamesListing';
import useEditCasinoGames from './hooks/useEditCasinoGames';
import FormModal from '../../components/Common/FormModal';
import useFilters from './hooks/useFilters';

const CasinoGames = () => {
	// meta title
	document.title = projectName;
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);

	const { filterValidation, selectedFiltersComponent, filterComponent } =
		useFilters();
	const {
		isEditCasinoGamesLoading,
		isOpen,
		setIsOpen,
		header,
		validation,
		formFields,
		onClickEdit,
	} = useEditCasinoGames();

	const {
		formattedCasinoGames,
		isCasinoGamesLoading,
		totalCasinoPages,
		page,
		setPage,
		itemsPerPage,
		onChangeRowsPerPage,
		columns,
		actionList,
	} = useCasinoGamesListings(filterValidation.values, onClickEdit);

	return (
		<div className="page-content">
			<Container fluid>
				{showBreadcrumb && (
					<Breadcrumb title="Casino Management" breadcrumbItem="Casino Games" />
				)}
				<CardBody>
					<TableContainer
						columns={columns}
						data={formattedCasinoGames}
						isGlobalFilter
						isPagination
						customPageSize={itemsPerPage}
						totalPageCount={totalCasinoPages}
						isManualPagination
						onChangePagination={setPage}
						currentPage={page}
						isLoading={isCasinoGamesLoading}
						changeRowsPerPageCallback={onChangeRowsPerPage}
						filterComponent={filterComponent}
						selectedFiltersComponent={selectedFiltersComponent}
						actionList={actionList}
					/>
					<FormModal
						isOpen={isOpen}
						toggle={() => setIsOpen((prev) => !prev)}
						header={header}
						validation={validation}
						formFields={formFields}
						submitLabel="Submit"
						customColClasses="col-md-12"
						isSubmitLoading={isEditCasinoGamesLoading}
					/>
				</CardBody>
			</Container>
		</div>
	);
};

CasinoGames.defaultProps = {
	t: (string) => string,
};

export default CasinoGames;
