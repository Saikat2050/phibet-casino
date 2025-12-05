import React from 'react';

const CodePenEmbed = ({ slugHash }) => {
  return (
    <iframe
      height="800"
      style={{
        width: '100%',
        border: '2px solid #ccc',
        margin: '1em 0',
        borderRadius: '4px',
      }}
      scrolling="no"
      title="CodePen Embed"
      src={`https://codepen.io/Ankit-Rajput-the-scripter/embed/${slugHash}?default-tab=html,result`}
      frameBorder="no"
      loading="lazy"
      allowTransparency={true}
      allowFullScreen={true}
    ></iframe>
  );
};

export default CodePenEmbed;


















// import React, { useEffect } from 'react';

// const CodePenEmbed = ({ slugHash }) => {
//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = 'https://public.codepenassets.com/embed/index.js';
//     script.async = true;
//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, [slugHash]);

//   return (
//     <div
//       className="codepen"
//       data-height="800"
//       data-default-tab="html,result"
//       data-slug-hash={slugHash}
//       data-pen-title="Dynamic Pen"
//       data-user="Ankit-Rajput-the-scripter"
//       style={{
//         height: '300px',
//         boxSizing: 'border-box',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         border: '2px solid',
//         margin: '1em 0',
//         padding: '1em'
//       }}
//     >
//       <span>
//         See the Pen{' '}
//         <a href={`https://codepen.io/Ankit-Rajput-the-scripter/pen/${slugHash}`}>
//           Dynamic Pen
//         </a>{' '}
//         by Ankit Rajput (
//         <a href="https://codepen.io/Ankit-Rajput-the-scripter">
//           @Ankit-Rajput-the-scripter
//         </a>) on{' '}
//         <a href="https://codepen.io">CodePen</a>.
//       </span>
//     </div>
//   );
// };

// export default CodePenEmbed;
