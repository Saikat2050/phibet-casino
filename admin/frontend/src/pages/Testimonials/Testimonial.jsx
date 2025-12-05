import React from 'react';
import { useSelector } from 'react-redux';
import { Container } from 'reactstrap';
import Breadcrumb from '../../components/Common/Breadcrumb';
import TableContainer from '../../components/Common/Table';
import ErrorBoundary from '../../components/Common/ErrorBoundary';
import useTestimonialListing from './hooks/useTestimonialListing';
import useFilters from './hooks/useFilters';
import { projectName } from '../../constants/config';

const Testimonial = () => {
  document.title = projectName;
  const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);
  const { filterValidation, filterComponent, selectedFiltersComponent } = useFilters();
  const {
    formattedTestimonialDetails,
    isLoading,
    page,
    setPage,
    itemsPerPage,
    columns,
    totalPages,
    actionList
  } = useTestimonialListing(filterValidation.values);

  return (
    <ErrorBoundary>
      <div className="page-content">
        <Container fluid>
          {showBreadcrumb && (
            <Breadcrumb title="Testimonials" breadcrumbItem="Testimonials" />
          )}

          <TableContainer
            columns={columns}
            data={formattedTestimonialDetails}
            isAddOptions={false}
            isPagination
            customPageSize={itemsPerPage}
            totalPageCount={totalPages}
            isManualPagination
            onChangePagination={setPage}
            currentPage={page}
            isLoading={isLoading}
            selectedFiltersComponent={selectedFiltersComponent}
            actionList={actionList}
            isSelectable
            filterComponent={filterComponent}
          />
        </Container>
      </div>
    </ErrorBoundary>
  );
};

export default Testimonial;