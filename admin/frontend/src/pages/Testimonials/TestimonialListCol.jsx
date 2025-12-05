import PropTypes from 'prop-types';
import { Badge } from 'reactstrap';
import { Link } from 'react-router-dom';

const TestimonialId = ({ value }) => (
  <Link to={`/testimonials/view/${value}`} className="text-body fw-bold">
    {value ?? ''}
  </Link>
);

const Author = ({ value }) => value || '-';

const Content = ({ value }) => {
  if (!value || value.trim() === '') return '-';
  return value.length > 100 ? `${value.substring(0, 100)}...` : value;
};

const Status = ({ value }) =>
  value ? (
    <Badge className="bg-success">Active</Badge>
  ) : (
    <Badge className="bg-danger">Inactive</Badge>
  );

TestimonialId.propTypes = { value: PropTypes.string.isRequired, };
Author.propTypes = { value: PropTypes.string, };
Content.propTypes = { value: PropTypes.string, };
Status.propTypes = { value: PropTypes.bool.isRequired, };

export { TestimonialId, Author, Content, Status };