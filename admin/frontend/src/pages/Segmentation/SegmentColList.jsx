/* eslint-disable react/prop-types */

import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from 'reactstrap';
import { getDateTimeWithAMPM } from '../../utils/dateFormatter';

const KeyValueCellNA = ({ value }) =>
	typeof value === 'number' ? value.toFixed(2) : value ?? '-';

const KycStatus = ({ value }) => {
	switch (value) {
		case true:
			return <Badge color="primary">Approved</Badge>;
		case false:
			return <Badge color="warning">Pending</Badge>;
		default:
			return '-';
	}
};

const Name = ({ cell }) => {
	const Id = cell?.row?.original?.id;
	const name = cell?.value;

	return (
		<div className="text-ellipsis" id={`username-${Id}`}>
			{name ? (
				<Link
					to={{
						pathname: `/segmentation/view/${Id}`,
					}}
					state={{ name }}
				>
					{name}
				</Link>
			) : (
				''
			)}
		</div>
	);
};

const UserName = ({ cell }) => (
	<>
		<div className="text-ellipsis" id={`username-${cell?.row?.original?.id}`}>
			{cell.value ? (
				<Link to={`/player-details/${cell?.row?.original?.id}`}>
					{cell.value}
				</Link>
			) : (
				''
			)}
		</div>
	</>
);

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

const Date = ({ value }) => getDateTimeWithAMPM(value);

export { KeyValueCellNA, IsActive, Name, Date, KycStatus , UserName};
