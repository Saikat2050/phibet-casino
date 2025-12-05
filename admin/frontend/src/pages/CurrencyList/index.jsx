/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useSelector } from 'react-redux';
import { Container } from 'reactstrap';
// import PropTypes from 'prop-types';
import Breadcrumb from '../../components/Common/Breadcrumb';
import TableContainer from '../../components/Common/Table';
import useCurrencyListing from './hooks/useCurrencyListing';
import { projectName } from '../../constants/config';
import FormModal from '../../components/Common/FormModal';
import useCreateCurrency from './hooks/useCreateCurrency';
import ConfirmationModal from '../../components/Common/ConfirmationModal';
import { formPageTitle } from '../../components/Common/constants';

const CurrencyList = () => {
	document.title = projectName;
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);

	const { isCurrenciesLoading, formattedCurrencies } = useCurrencyListing();

	const {
		isOpen,
		header,
		validation,
		formFields,
		columns,
		isEditCurrencyLoading,
		showModal,
		setShowModal,
		toggleFormModal,
	} = useCreateCurrency();

	return (
		<div className="page-content">
			<Container fluid>
				{showBreadcrumb && (
					<Breadcrumb title="Site Configurations" breadcrumbItem="Coins" />
				)}

				<TableContainer
					isLoading={isCurrenciesLoading}
					columns={columns}
					data={formattedCurrencies}
					customPageSize={10}
				/>

				<FormModal
					isOpen={isOpen}
					toggle={toggleFormModal}
					header={header}
					validation={validation}
					formFields={formFields}
					submitLabel="Submit"
					customColClasses="col-md-12"
					isSubmitLoading={isEditCurrencyLoading}
				/>
				<ConfirmationModal
					openModal={showModal}
					setOpenModal={setShowModal}
					validation={validation}
					pageType={formPageTitle.currencies}
				/>
			</Container>
		</div>
	);
};

CurrencyList.propTypes = {
	// t: PropTypes.func,
};

CurrencyList.defaultProps = {
	t: (string) => string,
};

export default CurrencyList;
