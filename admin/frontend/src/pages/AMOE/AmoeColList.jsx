/* eslint-disable react/prop-types */

import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from 'reactstrap';

const KeyValueCellNA = ({ value }) => value ?? '-';

const UserName = ({ cell }) =>
	cell.value && cell?.row?.original?.id ? (
		<Link to={`/player-details/${cell?.row?.original?.userId}`}>
			{cell.value}
		</Link>
	) : (
		cell.value || '-'
	);
const Status = ({ value }) => {
	switch (value) {
		case 'approved':
			return <Badge className="bg-success">Approved</Badge>;
		case 'pending':
			return <Badge className="bg-info">Pending</Badge>;
		case 'rejected':
			return <Badge className="bg-danger">Rejected</Badge>;
		default:
			return <Badge className="bg-info">{value}</Badge>;
	}
};
const KycStatus = ({ value }) => {
	switch (value) {
		case 'COMPLETED':
			return <Badge color="primary">Approved</Badge>;
		case 'PENDING':
			return <Badge color="warning">Pending</Badge>;
		case 'IN_PROGRESS':
			return <Badge color="secondary">In progress</Badge>;
		case 'FAILED':
			return <Badge color="danger">Failed</Badge>;
		default:
			return '-';
	}
};

const Earned = ({ value, defaultCurrency }) => (
	<p className="text-success">
		{defaultCurrency.symbol} {value ?? 0}
	</p>
);

export { KeyValueCellNA, UserName, Status, KycStatus, Earned };
