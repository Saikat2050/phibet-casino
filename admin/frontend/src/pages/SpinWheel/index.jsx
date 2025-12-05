import React from 'react';
import { useSelector } from 'react-redux';
import { Container } from 'reactstrap';
// import PropTypes from 'prop-types';
import Breadcrumb from '../../components/Common/Breadcrumb';
import TableContainer from '../../components/Common/Table';
import FormModal from '../../components/Common/FormModal';

import { projectName } from '../../constants/config';
import useSpinWheel from './hooks/useSpinWheel';

const SpinWheelListing = () => {
	document.title = projectName;
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);

	const {
		columns,
		formattedSegments,
		loading,
		isOpen,
		toggleFormModal,
		header,
		validation,
		formFields,
	} = useSpinWheel();
	return (
		<div className="page-content">
			<Container fluid>
				{showBreadcrumb && (
					<Breadcrumb title="Spin Wheels" breadcrumbItem="Spin Wheel" />
				)}
				<TableContainer
					columns={columns || []}
					data={formattedSegments || []}
					isGlobalFilter
					customPageSize={17}
					isLoading={loading}
				/>
				<FormModal
					isOpen={isOpen}
					toggle={toggleFormModal}
					header={header}
					validation={validation}
					submitLabel="Update"
					customColClasses="col-md-12"
					formFields={formFields}
				/>
			</Container>
		</div>
	);
};

SpinWheelListing.propTypes = {
	// t: PropTypes.func,
};

SpinWheelListing.defaultProps = {
	t: (string) => string,
};

export default SpinWheelListing;
