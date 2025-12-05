import React from 'react';
import { Card, CardBody } from 'reactstrap';
import PropTypes from 'prop-types';
import useRestrictedStatesListing from '../hooks/useRestrictedStatesListing';
import TableContainer from '../../../components/Common/Table';

const RestrictedStates = ({ restrictedStates }) => {
	const { columns } = useRestrictedStatesListing();

	return (
		<Card className="p-2">
			<CardBody>
				<TableContainer
					columns={columns}
					data={restrictedStates}
					customPageSize={restrictedStates?.length || 10}
				/>
			</CardBody>
		</Card>
	);
};

export default RestrictedStates;

RestrictedStates.propTypes = {
	restrictedStates: PropTypes.arrayOf(
		PropTypes.objectOf({
			id: PropTypes.string,
			name: PropTypes.string,
			code: PropTypes.string,
		})
	).isRequired,
};
