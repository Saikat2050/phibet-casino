import React from 'react';
import { Badge } from 'reactstrap';
import PropTypes from 'prop-types';
import { currencyTypes } from './constants';

const Id = ({ value }) => value ?? '';

const Name = ({ cell }) =>
	cell.value ? (
		<>
			{cell.value}{' '}
			{cell.row.original.isDefault && (
				<Badge className="bg-success">Primary</Badge>
			)}
		</>
	) : (
		''
	);

const Code = ({ value }) => value ?? '';

const KeyValue = ({ value }) => value ?? '-';

const LoyaltyPoints = ({ value }) => value ?? '';

const Type = ({ value }) =>
	value ? currencyTypes.find((currency) => currency.key === value)?.value : '';

// eslint-disable-next-line react/prop-types
const Status = ({ value }) =>
	value ? (
		<Badge className="bg-success">Active</Badge>
	) : (
		<Badge className="bg-danger">In Active</Badge>
	);

const Actions = () => <i className="dripicons-dots-3" />;

export { Id, Name, Actions, Code, Type, LoyaltyPoints, KeyValue, Status };

Name.propTypes = {
	cell: PropTypes.shape({
		value: PropTypes.string.isRequired,
		row: PropTypes.shape({
			original: PropTypes.shape({
				isDefault: PropTypes.bool.isRequired,
			}).isRequired,
		}).isRequired,
	}).isRequired,
};
