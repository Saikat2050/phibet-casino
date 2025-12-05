/* eslint-disable react/prop-types */
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
	Card,
	CardBody,
	Container,
	Collapse,
	Button,
	UncontrolledTooltip,
} from 'reactstrap';

import classnames from 'classnames';
import TableContainer from '../../components/Common/Table';
import Breadcrumb from '../../components/Common/Breadcrumb';
import Spinners from '../../components/Common/Spinner';

import useKYCLables from './hooks/useKYCLabels';
import { Language, LabelName } from './KYCLabelListCol';
import { projectName } from '../../constants/config';
import FormModal from '../../components/Common/FormModal';
import useCreateKYCLabels from './hooks/useCreateKYCLabels';
import usePermission from '../../components/Common/Hooks/usePermission';
import { modules } from '../../constants/permissions';
import ConfirmationModal from '../../components/Common/ConfirmationModal';
import { formPageTitle } from '../../components/Common/constants';

const columns = [
	{
		Header: 'LANGUAGE',
		accessor: 'language',
		filterable: true,
		Cell: ({ cell }) => <Language value={cell.value} />,
	},
	{
		Header: 'LABEL NAME',
		accessor: 'labelName',
		filterable: true,
		Cell: ({ cell }) => <LabelName value={cell.value} />,
	},
];

const KYCLabels = () => {
	// meta title
	document.title = projectName;
	const { isGranted } = usePermission();
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);

	const {
		formattedDocumentLabels,
		documentLabelsLoading,
		expanded,
		setExpanded,
	} = useKYCLables();

	const handleChange = (panel) => () => {
		if (expanded === panel) {
			setExpanded('');
		} else {
			setExpanded(panel);
		}
	};

	const {
		isOpen,
		toggleFormModal,
		formFields,
		header,
		validation,
		isCreateKYCLabelsLoading,
		actionList,
		onClickEditButton,
		isEditKYCLabelsLoading,
		showModal,
		setShowModal,
	} = useCreateKYCLabels();

	return (
		<div className="page-content">
			<Container fluid>
				{showBreadcrumb && (
					<Breadcrumb title="Player Verification" breadcrumbItem="KYC Labels" />
				)}
				<div className="d-flex justify-content-end w-100 custom-btn-group p-3">
					{actionList}
				</div>
				<Card>
					<CardBody>
						{documentLabelsLoading ? (
							<Spinners
								color="primary"
								className="position-absolute top-50 start-50"
							/>
						) : (
							formattedDocumentLabels?.map((label) => {
								const { required, languageData, id: labelId } = label[0];
								return (
									<div
										className="accordion mb-2 left-accordion-arrow"
										id="accordion"
										key={labelId}
									>
										<div className="accordion-item border-0 bg-transparent">
											<h2
												className="accordion-header accordion-border-radius accordion-item"
												id={`heading${labelId}`}
											>
												<button
													className={classnames(
														'accordion-button',
														'fw-medium',
														'accordion-border-radius',
														{ collapsed: expanded !== labelId }
													)}
													type="button"
													onClick={handleChange(labelId)}
													style={{ cursor: 'pointer' }}
												>
													<h5 className="font-size-14 d-inline-flex align-items-center gap-2 mb-0 fw-bolder margin-left">
														Label {labelId}
														{required ? (
															<span className="text-success">(Required)</span>
														) : (
															<span className="text-danger">
																(Not Required)
															</span>
														)}{' '}
														<Button
															hidden={!isGranted(modules.kyc, 'U')}
															onClick={(e) => onClickEditButton(e, label?.[0])}
															className="btn btn-sm btn-soft-info"
														>
															<i
																className="mdi mdi-pencil-outline"
																id={`edit-tooltip-${labelId}`}
															/>
															<UncontrolledTooltip
																placement="top"
																target={`edit-tooltip-${labelId}`}
															>
																Edit
															</UncontrolledTooltip>
														</Button>
													</h5>
												</button>
											</h2>

											<Collapse
												isOpen={expanded === labelId}
												className="accordion-collapse"
											>
												<div className="accordion-body accordion-body-padding">
													<TableContainer
														columns={columns}
														data={languageData}
														customPageSize={10}
														tableClass="table-bordered align-middle nowrap mt-2"
														theadClass="col-6"
														paginationDiv="justify-content-center"
														pagination="pagination justify-content-start pagination-rounded"
														isLoading={documentLabelsLoading}
														thCustomClass="col-6"
														isShowColSettings={false}
													/>
												</div>
											</Collapse>
										</div>
									</div>
								);
							})
						)}
						<FormModal
							isOpen={isOpen}
							toggle={toggleFormModal}
							header={header}
							validation={validation}
							formFields={formFields}
							submitLabel="Submit"
							customColClasses="col-md-12"
							isSubmitLoading={
								isCreateKYCLabelsLoading || isEditKYCLabelsLoading
							}
						/>
						<ConfirmationModal
							openModal={showModal}
							setOpenModal={setShowModal}
							validation={validation}
							pageType={formPageTitle.kyc}
						/>
					</CardBody>
				</Card>
			</Container>
		</div>
	);
};

KYCLabels.propTypes = {
	// t: PropTypes.func,
};

KYCLabels.defaultProps = {
	t: (string) => string,
};

export default KYCLabels;
