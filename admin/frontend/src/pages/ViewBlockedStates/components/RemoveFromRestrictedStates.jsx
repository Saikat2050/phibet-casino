import React from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Row } from 'reactstrap';
import TableContainer from '../../../components/Common/Table';
import useRemoveFromRestrictedStatesListing from '../hooks/useRemoveFromRestrictedStates';

const RemoveFromRestrictedStates = ({ restrictedStates }) => {
	const {
		restrictedStatesLoading,
		restrictedStatesState,
		columns,
		selectedStatesState,
		selectedTableColumns,
		actionList,
	} = useRemoveFromRestrictedStatesListing(restrictedStates);

	return (
		<Card className="p-2">
			<Row className="col-reverse-sm">
				<Col sm={12} md={6} lg={6}>
					<h4 className="py-2">Restricted States</h4>
					<TableContainer
						columns={columns}
						isLoading={restrictedStatesLoading}
						data={restrictedStatesState}
						isShowColSettings={false}
					/>
				</Col>
				<Col sm={12} md={6} lg={6}>
					{selectedStatesState?.length ? (
						<>
							<h4 className="ps-2 py-3"> Selected States </h4>
							<TableContainer
								columns={selectedTableColumns}
								data={selectedStatesState}
								isShowColSettings
								actionList={actionList}
							/>
						</>
					) : (
						<Card>
							<h5 className="text-center text-primary p-5 mt-5">
								{' '}
								Select states you want to unrestrict
							</h5>
						</Card>
					)}
				</Col>
			</Row>
		</Card>
	);
};

export default RemoveFromRestrictedStates;

RemoveFromRestrictedStates.propTypes = {
	restrictedStates: PropTypes.arrayOf(
		PropTypes.objectOf({
			id: PropTypes.string,
			name: PropTypes.string,
			code: PropTypes.string,
		})
	).isRequired,
};
