import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import Breadcrumb from '../../components/Common/Breadcrumb';
import CrudSection from '../../components/Common/CrudSection';
import ReorderComponent from '../ReorderCategories';
import useBonusReorder from './hooks/useBonusReorder';
import TableContainer from '../../components/Common/Table';

const ReorderBonus = () => {
	const {
		buttonList,
		columns,
		state,
		setState,
		formattedBonus,
		isBonusDetailsLoading,
		formattedState,
	} = useBonusReorder();

	return (
		<div className="page-content">
			<div className="container-fluid">
				<Breadcrumb
					title="Bonus"
					breadcrumbItem="Reorder"
					titleLink="/bonus"
					leftTitle={
						<>
							<i className="fas fa-angle-left" /> Back
						</>
					}
				/>

				<Row>
					<Card>
						<CrudSection
							buttonList={state?.count ? buttonList : []}
							title="Bonus Reorder"
						/>
					</Card>
				</Row>

				<Row lg={12}>
					<Col lg={6}>
						<Card>
							<CardBody>
								<Row className="drag-table--header">
									<TableContainer
										columns={columns}
										data={formattedBonus}
										customPageSize={10}
										tableClass="table-bordered align-middle nowrap"
										theadClass="col-6"
										paginationDiv="justify-content-center"
										pagination="pagination justify-content-start pagination-rounded"
										isLoading={isBonusDetailsLoading}
										isShowColSettings={false}
									/>
								</Row>
							</CardBody>
						</Card>
					</Col>
					<Col lg={6}>
						<Card>
							<CardBody>
								<Row className="drag-table--header">
									{['ORDER ID', 'BONUS NAME', 'ACTION'].map((key) => (
										<Col key={key} className="drag-table--heading">
											{key}
										</Col>
									))}
									<ReorderComponent
										formattedState={formattedState}
										state={state}
										setState={setState}
									/>
								</Row>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</div>
		</div>
	);
};

export default ReorderBonus;
