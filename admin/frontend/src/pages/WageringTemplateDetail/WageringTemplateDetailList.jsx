/* eslint-disable react/prop-types */
import React, { useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Container, Card, CardBody } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import TableContainer from '../../components/Common/Table';
import { getWageringTemplateDetail } from '../../store/actions';
import {
	RTP,
	TemplateName,
	WageringContribution,
} from './WageringTemplateListCol';

const columns = [
	{
		Header: 'Game Name',
		accessor: 'casinoGameName',
		Cell: ({ cell }) => <TemplateName cell={cell} />,
	},
	{
		Header: 'RTP',
		accessor: 'returnToPlayer',
		Cell: ({ cell }) => <RTP cell={cell} />,
	},
	{
		Header: 'Contribution Percentage',
		accessor: 'contributionPercentage',
		Cell: ({ cell }) => <RTP cell={cell} />,
	},
	{
		Header: 'Default Contribution',
		accessor: 'wageringContribution',
		Cell: ({ cell }) => <WageringContribution cell={cell} />,
	},
];

const WageringTemplateDetailList = () => {
	const dispatch = useDispatch();
	const { wageringTemplateId } = useParams();
	const { SAWageringTemplate, SAWageringTemplateLoading } = useSelector(
		(state) => state.WageringTemplate
	);

	useEffect(() => {
		if (wageringTemplateId) {
			dispatch(
				getWageringTemplateDetail({
					wageringTemplateId: Number(wageringTemplateId),
				})
			);
		}
	}, []);

	const formattedSAWageringTemplateData = useMemo(() => {
		if (SAWageringTemplate?.template?.length) {
			return SAWageringTemplate?.template?.[0]?.wageringTemplateGameDetails?.map(
				(template) => ({
					...template,
					casinoGameName: template.casinoGame?.name || '-',
					returnToPlayer: template?.casinoGame?.returnToPlayer || '-',
				})
			);
		}
		return [];
	}, [SAWageringTemplate]);

	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs
					title="Wagering Template"
					breadcrumbItem="View"
					titleLink="/wagering-template"
					leftTitle={
						<>
							<i className="fas fa-angle-left" /> Back
						</>
					}
				/>
				<Card>
					<CardBody>
						<TableContainer
							columns={columns}
							data={formattedSAWageringTemplateData}
							tableClass="table-bordered align-middle nowrap mt-2"
							paginationDiv="justify-content-center"
							pagination="pagination justify-content-start pagination-rounded"
							isLoading={SAWageringTemplateLoading}
						/>
					</CardBody>
				</Card>
			</Container>
		</div>
	);
};

export default WageringTemplateDetailList;
