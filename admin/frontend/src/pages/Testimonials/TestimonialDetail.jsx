import React from 'react';
import { Card, Col, Container, Row, CardBody } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import CrudSection from '../../components/Common/CrudSection';
import { projectName } from '../../constants/config';
import useTestimonialDetail from './hooks/useTestimonialDetail';

const TestimonialDetail = () => {
  document.title = projectName;
  const { data } = useTestimonialDetail();

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title="Testimonials"
          breadcrumbItem="View"
          titleLink="/testimonials"
          leftTitle={<> <i className="fas fa-angle-left" /> Back  </>}
        />
        <Row>
          <Col lg="12">
            <Card>
              <CrudSection title="Testimonial Details" />
              <CardBody>
                <Row className="mb-4">
                  <Col md="6">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Author:</label>
                      <p className="mb-0">{data.author || 'No author available'}</p>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Status:</label>
                      <p className="mb-0">
                        <span className={`badge ${data.isActive ? 'bg-success' : 'bg-secondary'}`}>
                          {data.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </p>
                    </div>
                  </Col>
                  <Col md="12">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Quote:</label>
                      <div className="border rounded p-3 bg-light">
                        <p className="mb-0">{data.content || 'No quote available'}</p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardBody>
                <h5>Testimonial Preview</h5>
                <Card className="mt-3 border-left-primary">
                  <CardBody>
                    <blockquote className="blockquote mb-0">
                      <p className="mb-3 font-size-16">
                        <i className="mdi mdi-format-quote-open text-primary font-size-24 me-2"></i>
                        {data.content || 'No testimonial content'}
                        <i className="mdi mdi-format-quote-close text-primary font-size-24 ms-2"></i>
                      </p>
                      <footer className="blockquote-footer font-size-14">
                        <cite title="Source Title">{data.author || 'Unknown Author'}</cite>
                      </footer>
                    </blockquote>
                  </CardBody>
                </Card>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TestimonialDetail;
