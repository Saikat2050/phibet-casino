import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'reactstrap';

const CellValue = ({ value }) => value ?? '-';

const CapitalizedValue = ({ value }) =>
	value ? <div className="text-capitalize">{value}</div> : '-';

const Amount = ({ value }) => (value ? value.toFixed(2) : '-');

const BooleanCol = ({ value }) => (value ? 'Yes' : 'No');

const Status = ({ value }) =>
	value ?? '' ? (
		<Badge className="bg-success">Active</Badge>
	) : (
		<Badge className="bg-danger">In Active</Badge>
	);

Status.propTypes = {
	value: PropTypes.bool.isRequired,
};

CapitalizedValue.propTypes = {
	value: PropTypes.string.isRequired,
};

export { CellValue, BooleanCol, Status, Amount, CapitalizedValue };
