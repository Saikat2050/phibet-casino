import React from 'react';
import { Card, CardBody } from 'reactstrap';
import PropTypes from 'prop-types';
import useRestrictedCountriesListing from '../hooks/useRestrictedCountriesListing';
import TableContainer from '../../../components/Common/Table';

const RestrictedCountries = ({ restrictedCountries }) => {
	const { columns } = useRestrictedCountriesListing();

	return (
		<Card className="p-2">
			<CardBody>
				<TableContainer
					columns={columns}
					data={restrictedCountries}
					customPageSize={restrictedCountries?.length || 10}
				/>
			</CardBody>
		</Card>
	);
};

export default RestrictedCountries;

RestrictedCountries.propTypes = {
	restrictedCountries: PropTypes.arrayOf(
		PropTypes.objectOf({
			id: PropTypes.string,
			name: PropTypes.string,
			code: PropTypes.string,
		})
	).isRequired,
};
