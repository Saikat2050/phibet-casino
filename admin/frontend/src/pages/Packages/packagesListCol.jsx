import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'reactstrap';
import LightboxImage from '../../components/Common/LightboxImage';

const CellValue = ({ value }) => value ?? '-';

const Amount = ({ value }) => (value ? value.toFixed(2) : '-');

const BooleanCol = ({ value }) => (value ? 'Yes' : 'No');

const Status = ({ value }) =>
	value ?? '' ? (
		<Badge className="bg-success">Active</Badge>
	) : (
		<Badge className="bg-danger">In Active</Badge>
	);

const ImagePreview = ({ value }) => <LightboxImage imgSrc={value} />;

Status.propTypes = {
	value: PropTypes.bool.isRequired,
};

ImagePreview.propTypes = {
	value: PropTypes.string.isRequired,
};

export { CellValue, BooleanCol, Status, ImagePreview, Amount };
