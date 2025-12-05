import React, { useState } from 'react';
import { Card, Col, Container, Row, Button, CardBody } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { projectName } from '../../constants/config';
import useCreateTestimonial from './hooks/useCreateTestimonial';
import FormPage from '../../components/Common/FormPage';

const CreateTestimonial = () => {
  document.title = projectName;
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { header, validation, formFields, isLoading } = useCreateTestimonial();
  const togglePreview = () => setIsPreviewOpen(!isPreviewOpen);

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title="Testimonials"
          breadcrumbItem="Create"
          titleLink="/testimonials"
          leftTitle={<>  <i className="fas fa-angle-left" /> Back  </>}
        />
        <Row>
          <Col lg="12">
            <Card>
              <FormPage
                formTitle={header}
                validation={validation}
                responsiveFormFields={formFields}
                submitLabel="Submit"
                customColClasses="mb-0"
                isSubmitLoading={isLoading}
              />

              <CardBody>
                <Button color="primary" onClick={togglePreview} className="mb-3">
                  {isPreviewOpen ? 'Hide Preview' : 'Show Preview'}
                </Button>
                {isPreviewOpen && (
                  <Card className="mt-3">
                    <CardBody>
                      <h5>{validation.values.author || 'Unknown Author'}</h5>
                      <p>"{validation.values.content || 'No Quote'}"</p>
                      <p><strong>Status:</strong> {validation.values.isActive ? 'Active' : 'Inactive'}</p>
                    </CardBody>
                  </Card>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CreateTestimonial;