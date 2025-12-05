import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import CrudSection from '../../components/Common/CrudSection';
import { projectName } from '../../constants/config';
import FormPage from '../../components/Common/FormPage';
import useEditEmailTemplate from './hooks/useEditEmailTemplate';
import { CustomComponent } from './EmailTemplateListCol';
import Modal from '../../components/Common/Modal';
import CodepenEditor from './CodeEditor';

const EditEmailTemplate = () => {
	// Set meta title
	document.title = projectName;

	const {
		galleryList,
		validation,
		formFields,
		emailTemplate,
		imageComponent,
		header,
		showGallery,
		setShowGallery,
		dynamicKeyData, 
		setDynamicKeyData
	} = useEditEmailTemplate();

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
								buttonList={galleryList}
								title={`Edit Email Template - ${emailTemplate?.label}`}
							/>
							<FormPage
								formTitle={header}
								validation={validation}
								responsiveFormFields={formFields}
								customComponent={
									<CodepenEditor
									label="Content"
									dynamicData={safeStringify(dynamicKeyData, null, 2)}
									HTML={validation.values.content || ''}
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
								customColClasses="mb-0"
								isSubmitLoading={false}
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
						</Card>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default EditEmailTemplate;
