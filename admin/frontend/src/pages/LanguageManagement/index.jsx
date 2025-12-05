import React from 'react';
// import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import TableContainer from '../../components/Common/Table';
import Breadcrumb from '../../components/Common/Breadcrumb';
import useLanguageManagementListing from './hooks/useLanguageManagementListing';
import { projectName } from '../../constants/config';
import CrudSection from '../../components/Common/CrudSection';

const LanguageManagementList = () => {
	document.title = projectName;
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);

	const {
		isLanguageManagementLoading,
		formattedLanguageManagement,
		columns,
		buttonList,
	} = useLanguageManagementListing();

	return (
		<div className="page-content">
			<Container fluid>
				{showBreadcrumb && (
					<Breadcrumb
						title="Site Configurations"
						breadcrumbItem="Language Management"
					/>
				)}
				<Row>
					<Col lg="12">
						<Card>
							<CrudSection
								buttonList={buttonList}
								title="Languages Management"
							/>
							<CardBody>
								<TableContainer
									isLoading={isLanguageManagementLoading}
									columns={columns}
									data={formattedLanguageManagement}
									isManualPagination
									isGlobalFilter
								/>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

LanguageManagementList.propTypes = {
	// t: PropTypes.func,
};

LanguageManagementList.defaultProps = {
	t: (string) => string,
};

export default LanguageManagementList;
