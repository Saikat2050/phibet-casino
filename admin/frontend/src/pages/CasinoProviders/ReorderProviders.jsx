import React from 'react';
import { useSelector } from 'react-redux';
import { Card, CardBody, Col, Row } from 'reactstrap';
import Breadcrumb from '../../components/Common/Breadcrumb';
import CrudSection from '../../components/Common/CrudSection';
import useReorderProvider from './hooks/useReorderProvider';
import Spinners from '../../components/Common/Spinner';
import ReorderComponent from '../ReorderComponent';

const ReorderProviders = () => {
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);

	const {
		buttonList,
		isCasinoProvidersDataLoading,
		formattedState,
		state,
		setState,
	} = useReorderProvider();

	return (
		<div className="page-content">
			<div className="container-fluid">
				{showBreadcrumb && (
					<Breadcrumb
						title="Casino Management"
						breadcrumbItem="Reorder Provider"
						showBackButton
					/>
				)}

				<Row>
					<Col lg="12">
						<Card>
							<CrudSection
								buttonList={buttonList}
								title="Casino Providers Reorder"
							/>
							<CardBody>
								{!isCasinoProvidersDataLoading ? (
									<Spinners />
								) : (
									<Row className="drag-table--header">
										{['ID', 'NAME', 'STATUS'].map((key) => (
											<Col className="drag-table--heading" key={key}>
												{key}
											</Col>
										))}
										<ReorderComponent
											formattedState={formattedState}
											state={state}
											setState={setState}
										/>
									</Row>
								)}
							</CardBody>
						</Card>
					</Col>
				</Row>
			</div>
		</div>
	);
};

export default ReorderProviders;
