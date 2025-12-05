import React from 'react';
import PropTypes from 'prop-types';
import { CCol } from '@coreui/react';
import { DivLoaderConainer } from './style';

const DivLoader = (props) => {
	const { isSmall, loaderVarient, isWithoutPadding } = props;
	const spinnerClass = [
		'spinner-border',
		loaderVarient || 'text-info',
		isSmall ? 'spinner-border-sm' : '',
	];
	return (
		<CCol xs="12" className={isWithoutPadding ? '' : 'py-5'}>
			<DivLoaderConainer className="d-flex justify-content-center">
				<div className={spinnerClass.join(' ')} role="status">
					<span className="sr-only">Loading...</span>
				</div>
			</DivLoaderConainer>
		</CCol>
	);
};

DivLoader.propTypes = {
	isSmall: PropTypes.bool,
	loaderVarient: PropTypes.string,
	isWithoutPadding: PropTypes.bool,
};
DivLoader.defaultProps = {
	isSmall: false,
	loaderVarient: '',
	isWithoutPadding: false,
};
export default DivLoader;
