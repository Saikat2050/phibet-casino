import React from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Input, Row } from 'reactstrap';
import TableContainer from '../../../components/Common/Table';
import useAddToRestrictedCountriesListing from '../hooks/useAddToRestrictedCountriesListing';

const AddToRestrictedCountries = ({ unrestrictedCountries }) => {
	const {
		columns,
		unrestrictedCountriesState,
		selectedCountriesState,
		selectedTableColumns,
		actionList,
		searchString,
		setSearchString,
	} = useAddToRestrictedCountriesListing(unrestrictedCountries);

	return (
		<Card className="p-2">
			<Row className="col-reverse-sm">
				<Col sm={12} md={6} lg={6}>
					<h4 className="py-3">Unrestricted Countries</h4>
					<div className="filter-search me-2">
						<div className="position-relative">
							<Input
								type="text"
								value={searchString}
								className="form-control border-0"
								placeholder="Search by Unrestricted Countries"
								onChange={(e) => setSearchString(e.target.value)}
							/>
							<i
								className="bx bx-search-alt search-icon"
								style={{
									position: 'absolute',
									left: '10px',
									top: '50%',
									transform: 'translateY(-50%)',
								}}
							/>
						</div>
					</div>
					<TableContainer
						columns={columns}
						data={unrestrictedCountriesState}
						isManualPagination
						isShowColSettings={false}
					/>
				</Col>
				<Col sm={12} md={6} lg={6}>
					{selectedCountriesState?.length ? (
						<>
							<h4 className="py-3 ps-3">Selected Countries</h4>

							<TableContainer
								columns={selectedTableColumns}
								data={selectedCountriesState}
								tableClass="table-bordered align-middle nowrap mt-2"
								isShowColSettings
								actionList={actionList}
							/>
						</>
					) : (
						<Card>
							<h5 className="text-center text-primary p-5 mt-5">
								Select countries you want to restrict.
							</h5>
						</Card>
					)}
				</Col>
			</Row>
		</Card>
	);
};

export default AddToRestrictedCountries;

AddToRestrictedCountries.propTypes = {
	unrestrictedCountries: PropTypes.arrayOf(
		PropTypes.objectOf({
			id: PropTypes.string,
			name: PropTypes.string,
			code: PropTypes.string,
		})
	).isRequired,
};
