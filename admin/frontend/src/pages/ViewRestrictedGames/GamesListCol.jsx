import React from 'react';
import PropTypes from 'prop-types';

const KeyValueCell = ({ value }) => value ?? '';

const Status = ({ value }) =>
	value ?? '' ? (
		<span className="text-success">Active</span>
	) : (
		<span className="text-danger">In Active</span>
	);

const OperatorStatus = ({ value }) =>
	value ?? '' ? (
		<span className="text-success">Active</span>
	) : (
		<span className="text-danger">In Active</span>
	);

Status.propTypes = {
	value: PropTypes.bool.isRequired,
};

OperatorStatus.propTypes = {
	value: PropTypes.bool.isRequired,
};

export { KeyValueCell, Status, OperatorStatus };
