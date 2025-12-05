import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TestimonialItem from '../../components/Common/TestimonialItem';

const TestimonialList = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get(`${process.env.VITE_APP_API_URL}/api/testimonials`, {
          params: { isActive: true }, // Fetch only active testimonials
        });
        setTestimonials(res.data.data || []);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Testimonials - Landing Page</h3>
      <div className="testimonials">
        {testimonials.map((item) => (
          <TestimonialItem key={item.id} name={item.author} quote={item.title} position="User" />
        ))}
      </div>
    </div>
  );
};

export default TestimonialList;