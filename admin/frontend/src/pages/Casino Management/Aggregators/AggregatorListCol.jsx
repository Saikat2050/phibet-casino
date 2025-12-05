/* eslint-disable react/prop-types */
import React from 'react';
import { Badge } from 'reactstrap';
import Proptypes from 'prop-types';

const ID = ({ value }) => value ?? '';

const Name = ({ value }) => value.EN ?? '';
const Status = ({ value }) =>
	value ? (
		<Badge className="bg-success">Active</Badge>
	) : (
		<Badge className="bg-danger">In Active</Badge>
	);

Status.prototype = {
	value: Proptypes.bool.isRequired,
};

export { ID, Name, Status };
