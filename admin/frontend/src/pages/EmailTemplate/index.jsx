import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Collapse, CardBody, Card, Table } from 'reactstrap';
import classnames from 'classnames';

import { projectName } from '../../constants/config';
import useEmailTemplate from './hooks/useEmailTemplate';
import Spinners from '../../components/Common/Spinner';
import Modal from '../../components/Common/Modal';
import Breadcrumb from '../../components/Common/Breadcrumb';

import { EMAIL_TEMPLATE_EVENT_TYPES } from './Constant';

const EmailTemplate = () => {
	// meta title
	document.title = projectName;
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);
	const [expanded, setExpanded] = useState('welcome');

	const {
		emailTemplateloading,
		emailTemplates,
		toggleView,
		emailTemplate,
		isEmailTemplateLoading,
		customComponent,
		columns,
		clickId,
		actionList,
		permissions,
	} = useEmailTemplate();

	const handleChange = (e, panel) => {
		e.preventDefault();
		if (expanded === panel) {
			setExpanded('');
		} else {
			setExpanded(panel);
		}
	};

	const emailTemplateContent = useMemo(
		() =>
			Object.values(EMAIL_TEMPLATE_EVENT_TYPES || {}).map((key) => (
				<div
					className="accordion mb-2 left-accordion-arrow"
					id="accordion"
					key={key}
				>
					<div className="accordion-item border-0 bg-transparent">
						<h2
							className="accordion-header accordion-border-radius accordion-item"
							id={`heading${key}`}
						>
							<button
								className={classnames(
									'accordion-button',
									'fw-medium',
									'accordion-border-radius',
									'min-height',
									{
										collapsed: expanded !== key,
									}
								)}
								type="button"
								onClick={(e) => handleChange(e, key)}
								style={{ cursor: 'pointer' }}
							>
								<h5 className="font-size-14 mb-0 fw-bolder margin-left">
									{key?.split('_')?.join(' ')?.toUpperCase()}
								</h5>
							</button>
						</h2>
						<Collapse isOpen={expanded === key} className="accordion-collapse">
							{expanded === key ? (
								<div className="accordion-body accordion-body-padding">
									{/* <TableContainer
										columns={columns}
										data={expanded === key ? emailTemplates?.[key] : []}
										tableClass="table-bordered align-middle nowrap mt-2"
										paginationDiv="justify-content-center"
										pagination="pagination justify-content-start pagination-rounded"
										isLoading={emailTemplateloading}
										thCustomClass="col-3"
										customPageSize={10}
									/> */}
									<Table striped>
										<thead>
											<tr>
												{columns.map((col) => (
													<th>{col.Header}</th>
												))}
											</tr>
										</thead>
										<tbody>
											{emailTemplates?.[key]?.map((row) => (
												<tr>
													{columns.map((col) => (
														<th>
															{col.Cell(
																row?.[col.accessor],
																row?.eventType,
																row?.isDefault
															)}
														</th>
													))}
												</tr>
											))}
										</tbody>
									</Table>
								</div>
							) : null}
						</Collapse>
					</div>
				</div>
			)),
		[expanded, emailTemplateloading, emailTemplates, permissions]
	);

	return (
		<div className="page-content">
			<Container fluid>
				{showBreadcrumb && (
					<Breadcrumb title="CRM" breadcrumbItem="Email Template" />
				)}
				<div className="d-flex justify-content-end w-100 custom-btn-group p-3">
					{actionList}
				</div>
				<Card>
					<CardBody className="my-3">
						{emailTemplateloading ? (
							<Spinners
								color="primary"
								className="position-absolute top-50 start-50"
							/>
						) : (
							emailTemplateContent
						)}
					</CardBody>
				</Card>
				<Modal
					openModal={clickId}
					toggleModal={toggleView}
					headerTitle={emailTemplate?.label}
					className="modal-dialog modal-lg"
					isLoading={isEmailTemplateLoading}
					hideFooter
				>
					{customComponent}
				</Modal>
			</Container>
		</div>
	);
};

EmailTemplate.propTypes = {
	// t: PropTypes.func,
};

EmailTemplate.defaultProps = {
	// t: (string) => string,
};

export default EmailTemplate;
