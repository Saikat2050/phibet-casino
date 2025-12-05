import React from 'react';

const TestimonialItem = ({ name, quote, position }) => {
  return (
    <div className="testimonial-item">
      <p>"{quote}"</p>
      <h5>{name} - {position}</h5>
    </div>
  );
};

export default TestimonialItem;