import React from 'react';
import { useSelector } from 'react-redux';
import { Card, CardBody, Col, Row } from 'reactstrap';
import Breadcrumb from '../../components/Common/Breadcrumb';
import CrudSection from '../../components/Common/CrudSection';
import useReorderCategory from './hooks/useReorderCategory';
import Spinners from '../../components/Common/Spinner';
import ReorderComponent from '../ReorderCategories';

const ReorderCategories = () => {
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);

	const {
		buttonList,
		iscasinoCategoryDetailsLoading,
		formattedState,
		state,
		setState,
		title
	} = useReorderCategory();

	return (
		<div className="page-content">
			<div className="container-fluid">
				{showBreadcrumb && (
					<Breadcrumb
						title="Casino Management"
						breadcrumbItem={title}
						showBackButton
					/>
				)}

				<Row>
					<Col lg="12">
						<Card>
							<CrudSection
								buttonList={buttonList}
								title={title}
							/>
							<CardBody>
								{!iscasinoCategoryDetailsLoading ? (
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

export default ReorderCategories;
