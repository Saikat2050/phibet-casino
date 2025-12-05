import React from 'react';
import { Badge } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const PaymentId = ({ value }) => <span className="fw-bold">{value ?? ''}</span>;

const Name = ({ value, paymentData, handleView }) => (
	<Link to="!#" onClick={(e) => handleView(e, paymentData)}>
		{value ?? ''}
	</Link>
);

const BooleanCell = ({ value }) =>
	value ? (
		<Badge className="bg-success">Yes</Badge>
	) : (
		<Badge className="bg-danger">No</Badge>
	);

const Aggregator = ({ value }) => value ?? '';

const Category = ({ value }) => value ?? '';

const Status = ({ value }) =>
	value ?? '' ? (
		<Badge className="bg-success">Active</Badge>
	) : (
		<Badge className="bg-danger">In Active</Badge>
	);

PaymentId.propTypes = {
	value: PropTypes.number.isRequired,
};

Status.propTypes = {
	value: PropTypes.bool.isRequired,
};

BooleanCell.propTypes = {
	value: PropTypes.bool.isRequired,
};

Name.propTypes = {
	value: PropTypes.bool.isRequired,
	paymentData: PropTypes.objectOf({ id: PropTypes.string }).isRequired,
	handleView: PropTypes.func.isRequired,
};

export { PaymentId, Name, Status, Aggregator, BooleanCell, Category };
