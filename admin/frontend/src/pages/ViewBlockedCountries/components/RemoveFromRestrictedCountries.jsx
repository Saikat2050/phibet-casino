import React from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Row } from 'reactstrap';
import TableContainer from '../../../components/Common/Table';
import useRemoveFromRestrictedCountriesListing from '../hooks/useRemoveFromRestrictedCountries';

const RemoveFromRestrictedCountries = ({ restrictedCountries }) => {
	const {
		restrictedCountriesLoading,
		restrictedCountriesState,
		columns,
		selectedCountriesState,
		selectedTableColumns,
		actionList,
	} = useRemoveFromRestrictedCountriesListing(restrictedCountries);

	return (
		<Card className="p-2">
			<Row className="col-reverse-sm">
				<Col sm={12} md={6} lg={6}>
					<h4 className="py-2">Restricted Countries</h4>
					<TableContainer
						columns={columns}
						isLoading={restrictedCountriesLoading}
						data={restrictedCountriesState}
						isShowColSettings={false}
					/>
				</Col>
				<Col sm={12} md={6} lg={6}>
					{selectedCountriesState?.length ? (
						<>
							<h4 className="ps-2 py-3"> Selected Countries </h4>
							<TableContainer
								columns={selectedTableColumns}
								data={selectedCountriesState}
								isShowColSettings
								actionList={actionList}
							/>
						</>
					) : (
						<Card>
							<h5 className="text-center text-primary p-5 mt-5">
								{' '}
								Select countries you want to unrestrict
							</h5>
						</Card>
					)}
				</Col>
			</Row>
		</Card>
	);
};

export default RemoveFromRestrictedCountries;

RemoveFromRestrictedCountries.propTypes = {
	restrictedCountries: PropTypes.arrayOf(
		PropTypes.objectOf({
			id: PropTypes.string,
			name: PropTypes.string,
			code: PropTypes.string,
		})
	).isRequired,
};
