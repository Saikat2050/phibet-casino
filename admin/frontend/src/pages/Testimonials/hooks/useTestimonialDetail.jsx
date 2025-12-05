import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getTestimonialById } from '../../../store/testimonials/actions';

const useTestimonialDetail = () => {
  const { id } = useParams();
  const { testimonialById } = useSelector((state) => state.Testimonials);

  useEffect(() => {
    if (id) dispatch(getTestimonialById({ id }))
  }, [id]);

  return { data: testimonialById || {} };
};

export default useTestimonialDetail;