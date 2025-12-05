import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { staticFormFields, createTestimonialSchema, getInitialValues } from '../TestimonialFormDetails';
import { getTestimonialById, updateTestimonial } from '../../../store/testimonials/actions';

const useEditTestimonial = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { testimonialById, testimonialByIdLoading } = useSelector((state) => state.Testimonials);

  const validation = useFormik({
    initialValues: getInitialValues(),
    validationSchema: createTestimonialSchema(),
    onSubmit: (values) => {
      const testimonialData = {
        author: values.author,
        content: values.content,
        isActive: values.isActive,
        rating: values.rating,
        id
      };
      dispatch(updateTestimonial({ testimonialData, navigate }));
    },
  });

  useEffect(() => {
    if (id) dispatch(getTestimonialById({ id }))
  }, [id])

  useEffect(() => {
    if (testimonialById && testimonialById.id && testimonialById.id.toString() === id) {
      const initialValues = getInitialValues(testimonialById);
      validation.setValues(initialValues);
    }
  }, [testimonialById, id])

  const actionList = [
    {
      label: 'Edit',
      link: `/testimonials/edit/${id}`,
      className: 'btn-primary',
      type: 'link',
    },
  ];

  return {
    header: 'Edit Testimonial',
    validation,
    formFields: staticFormFields(),
    actionList,
    isLoading: testimonialByIdLoading
  };
};

export default useEditTestimonial;