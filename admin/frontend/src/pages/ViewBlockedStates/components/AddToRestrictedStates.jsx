import React from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Input, Row } from 'reactstrap';
import TableContainer from '../../../components/Common/Table';
import useAddToRestrictedStatesListing from '../hooks/useAddToRestrictedStatesListing';

const AddToRestrictedStates = ({ unrestrictedStates }) => {
	const {
		columns,
		unrestrictedStatesState,
		selectedStatesState,
		selectedTableColumns,
		actionList,
		searchString,
		setSearchString,
	} = useAddToRestrictedStatesListing(unrestrictedStates);

	return (
		<Card className="p-2">
			<Row className="col-reverse-sm">
				<Col sm={12} md={6} lg={6}>
					<h4 className="py-3">Unrestricted States</h4>
					<div className="filter-search me-2">
						<div className="position-relative">
							<Input
								type="text"
								value={searchString}
								className="form-control border-0"
								placeholder="Search by Unrestricted States"
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
						data={unrestrictedStatesState}
						isManualPagination
						isShowColSettings={false}
					/>
				</Col>
				<Col sm={12} md={6} lg={6}>
					{selectedStatesState?.length ? (
						<>
							<h4 className="py-3 ps-3">Selected States</h4>

							<TableContainer
								columns={selectedTableColumns}
								data={selectedStatesState}
								tableClass="table-bordered align-middle nowrap mt-2"
								isShowColSettings
								actionList={actionList}
							/>
						</>
					) : (
						<Card>
							<h5 className="text-center text-primary p-5 mt-5">
								Select states you want to restrict.
							</h5>
						</Card>
					)}
				</Col>
			</Row>
		</Card>
	);
};

export default AddToRestrictedStates;

AddToRestrictedStates.propTypes = {
	unrestrictedStates: PropTypes.arrayOf(
		PropTypes.objectOf({
			id: PropTypes.string,
			name: PropTypes.string,
			code: PropTypes.string,
		})
	).isRequired,
};
