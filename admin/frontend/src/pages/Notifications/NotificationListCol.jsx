/* eslint-disable react/prop-types */
import React from 'react';
import { Badge, UncontrolledTooltip } from 'reactstrap';

const Id = ({ value }) => value ?? '';

const KeyValueCell = ({ value, id }) => (
	<>
		<div id={`value-${id ?? '-'}`} className="text-ellipsis">
			{value ?? '-'}
		</div>
		<UncontrolledTooltip placement="top" target={`value-${id ?? '-'}`}>
			{value}
		</UncontrolledTooltip>
	</>
);

const Status = ({ value }) =>
	value ? (
		<Badge className="bg-success">Active</Badge>
	) : (
		<Badge className="bg-danger">In Active</Badge>
	);

export { Id, KeyValueCell, Status };
