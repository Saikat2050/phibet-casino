import React from 'react';
import { useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import Breadcrumb from '../../components/Common/Breadcrumb';
import Spinners from '../../components/Common/Spinner';
import ReorderComponent from '../ReorderCategories';
import useReorderPackages from './hooks/useReorderPackages';
import ButtonList from '../../components/Common/ButtonList';

const ReorderPackages = () => {
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);

	const { state, setState, buttonList, formattedState, isPackagesLoading } =
		useReorderPackages();

	const actionList = <ButtonList buttonList={buttonList} />;

	return (
		<div className="page-content">
			<div className="container-fluid">
				{showBreadcrumb && (
					<Breadcrumb
						title="Packages"
						breadcrumbItem="Reorder"
						showBackButton
					/>
				)}

				<div className="d-flex justify-content-end w-100 custom-btn-group mb-2">
					{actionList}
				</div>

				{isPackagesLoading ? (
					<Spinners />
				) : (
					<Row className="drag-table--header px-3">
						{['ORDER ID', 'NAME', 'AMOUNT', 'STATUS'].map((key) => (
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
			</div>
		</div>
	);
};

export default ReorderPackages;
