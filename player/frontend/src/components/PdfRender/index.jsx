'use client';

import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { usePathname } from 'next/navigation';
// Set the worker source for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PdfRender({ slug }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfUrl, setPdfUrl] = useState(null);
  const pathname = usePathname();
  useEffect(() => {
    // Construct the URL for the PDF file
    const pdfPath = `/${slug}`;
    setPdfUrl(pdfPath);
  }, [slug]);

  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div>
      {pdfUrl ? (
        <Document
          file={pdfUrl}
          onLoadSuccess={onLoadSuccess}
          loading="Loading PDF..."
          error="Failed to load PDF file."
          className="Failed to load PDF file."
        >
          <Page pageNumber={pageNumber} />
        </Document>
      ) : (
        <p className=' -300'>Loading...</p>
      )}
      {/* Pagination controls */}
      {numPages && (
        <div>
          <button
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((prev) => prev - 1)}
          >
            Previous
          </button>
          <span>
            {pageNumber} of {numPages}
          </span>
          <button
            disabled={pageNumber >= numPages}
            onClick={() => setPageNumber((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default PdfRender;
