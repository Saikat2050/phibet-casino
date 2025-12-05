import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { staticFormFields, createTestimonialSchema, getInitialValues } from '../TestimonialFormDetails';
import { createTestimonial } from '../../../store/testimonials/actions';

const useCreateTestimonial = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector(state => state.Testimonials)

  const validation = useFormik({
    initialValues: getInitialValues(),
    validationSchema: createTestimonialSchema(),
    onSubmit: (values) => {
      const testimonialData = {
        author: values.author,
        content: values.content,
        isActive: values.isActive,
        rating: values.rating
      };
      dispatch(createTestimonial({ testimonialData, navigate }));
    },
  });

  const header = 'Create Testimonial';
  const formFields = staticFormFields(false);
  const actionList = [
    {
      label: 'Create',
      link: '/testimonials/create',
      module: 'testimonial',
      operation: 'create',
    }
  ];

  return {
    header,
    validation,
    formFields,
    actionList,
    isLoading
  };
};

export default useCreateTestimonial;