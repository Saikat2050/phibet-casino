import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import CrudSection from '../../components/Common/CrudSection';
import { projectName } from '../../constants/config';
import FormPage from '../../components/Common/FormPage';
import useCreateEmailTemplate from './hooks/useCreateEmailTemplate';
import ConfirmationModal from '../../components/Common/ConfirmationModal';
import { formPageTitle } from '../../components/Common/constants';
import { CustomComponent } from './EmailTemplateListCol';
import Modal from '../../components/Common/Modal';
// import CodePenEmbed from './CodePen';
import CodepenEditor from './CodeEditor';

const CreateEmailTemplate = () => {
	// Set meta title
	document.title = projectName;

	const {
		galleryList,
		validation,
		formFields,
		showModal,
		setShowModal,
		navigate,
		existingFilledFields,
		imageComponent,
		header,
		showGallery,
		setShowGallery,
		buttonList,
		dynamicKeyData,
		setDynamicKeyData
	} = useCreateEmailTemplate();

	const [template, setTemplate] = useState('')
	function safeStringify(obj, replacer = null, space = 2) {
		const seen = new WeakSet();

		return JSON.stringify(
			obj,
			(key, value) => {
				if (typeof value === 'object' && value !== null) {
					if (seen.has(value)) {
						return '[Circular]';
					}
					seen.add(value);
				}
				return typeof replacer === 'function' ? replacer(key, value) : value;
			},
			space
		);
	}

	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs
					title="Email Template"
					breadcrumbItem="Create"
					titleLink="/email-templates"
					leftTitle={
						<>
							<i className="fas fa-angle-left" /> Back
						</>
					}
				/>
				<Row>
					<Col lg="12">
						<Card key={`content[${validation?.values?.language}]`}>
							<CrudSection
								buttonList={buttonList}
								title="Create Email Template"
							/>
							<FormPage
								formTitle={header}
								validation={validation}
								responsiveFormFields={formFields}
								customComponent={
									<CodepenEditor
										label="Content"
										dynamicData={safeStringify(dynamicKeyData, null, 2)}
										HTML={'<h1> create new template here</h1>'}
										initial='HTML'
										mobileQuery={800}
										height='60vh'
										setTemplate={setTemplate}
										themeTransitionSpeed={150}
										setRequiredKeyData={setDynamicKeyData}
										validation={validation}
									/>
								}
								submitLabel="Submit"
								customColClasses=""
								isSubmitLoading={false}
								formClass="ms-2"
							/>
							<Modal
								openModal={showGallery}
								toggleModal={() => setShowGallery(!showGallery)}
								headerTitle="Gallery"
								hideFooter
								className="modal-dialog modal-lg"
							>
								{imageComponent}
							</Modal>
							<ConfirmationModal
								openModal={showModal}
								setOpenModal={setShowModal}
								validation={existingFilledFields}
								navigate={navigate}
								pageType={formPageTitle.crm}
							/>
						</Card>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default CreateEmailTemplate;
