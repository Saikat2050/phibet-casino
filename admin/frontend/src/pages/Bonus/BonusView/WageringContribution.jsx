import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Card, Col, Row } from 'reactstrap';
import { getWageringTemplateDetail } from '../../../store/actions';
import TableContainer from '../../../components/Common/Table';
import { selectedLanguage } from '../../../constants/config';

const KeyValueCell = ({ cell }) => (cell.value ? cell.value : '');

const columns = [
	{
		Header: 'NAME',
		accessor: 'name',
		disableSortBy: true,
		Cell: (cell) => <KeyValueCell cell={cell} />,
	},
	{
		Header: 'RTP',
		accessor: 'rtp',
		disableSortBy: true,
		Cell: (cell) => <KeyValueCell cell={cell} />,
	},
	{
		Header: 'WAGERING CONTRIBUTION',
		accessor: 'contribution',
		disableSortBy: true,
		Cell: (cell) => <KeyValueCell cell={cell} />,
	},
];

const WageringContribution = ({ wageringId }) => {
	const dispatch = useDispatch();
	const { SAWageringTemplateLoading, SAWageringTemplate } = useSelector(
		(state) => state.WageringTemplate
	);

	useEffect(() => {
		if (wageringId) {
			dispatch(
				getWageringTemplateDetail({
					wageringTemplateId: wageringId,
				})
			);
		}
	}, [wageringId]);

	const formattedWageringTemplates = useMemo(() => {
		if (SAWageringTemplate?.template?.length) {
			return SAWageringTemplate?.template?.[0]?.wageringTemplateGameDetails?.map(
				(item) => ({
					...item,
					name: item?.casinoGame?.name?.[selectedLanguage] || '',
					rtp: `${item?.casinoGame?.returnToPlayer ?? 0} %`,
					contribution: `${item.contributionPercentage ?? 0} %`,
				})
			);
		}
		return [];
	}, [SAWageringTemplate?.template]);

	return (
		<Card className="p-3">
			<Row>
				<Col sm="6" className="mb-3">
					<h6>
						Wagering Template : <b>{SAWageringTemplate?.template?.[0]?.name}</b>
					</h6>
				</Col>
				<Col lg="12" className="mb-3">
					<TableContainer
						isLoading={SAWageringTemplateLoading}
						columns={columns}
						data={formattedWageringTemplates}
						tableClass="table-bordered align-middle nowrap mt-2"
						paginationDiv="justify-content-center"
						pagination="pagination justify-content-start pagination-rounded"
						isShowColSettings={false}
					/>
				</Col>
			</Row>
		</Card>
	);
};

WageringContribution.defaultProps = {
	wageringId: '',
};

WageringContribution.propTypes = {
	wageringId: PropTypes.number,
};

export default WageringContribution;
