/* eslint-disable react/prop-types */
import React from 'react';
import { Badge } from 'reactstrap';

const KeyValueCell = ({ value }) => value ?? '';

const Status = ({ value }) =>
	value ?? '' ? (
		<Badge className="bg-success">Active</Badge>
	) : (
		<Badge className="bg-danger">In Active</Badge>
	);
export { KeyValueCell, Status };
