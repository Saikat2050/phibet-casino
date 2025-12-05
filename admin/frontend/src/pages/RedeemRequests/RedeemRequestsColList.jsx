/* eslint-disable react/prop-types */

import React from 'react';
import { Badge } from 'reactstrap';
import { Link } from 'react-router-dom';

const KeyValueCellNA = ({ value }) => value ?? '-';

const IsActive = ({ value }) => {
	switch (value) {
		case true:
			return <Badge className="bg-success">Active</Badge>;
		case false:
			return <Badge className="bg-danger">Inactive</Badge>;
		default:
			return '';
	}
};

const Segment = ({ cell }) =>
	cell.value ? (
		<Link to="/players" state={{ Segment: cell?.row?.original }}>
			{cell.value}
		</Link>
	) : (
		''
	);

export { KeyValueCellNA, IsActive, Segment };
