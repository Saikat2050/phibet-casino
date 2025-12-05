import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import SelectedFilters from '../../../components/Common/SelectedFilters';
import CustomFilters from '../../../components/Common/CustomFilters';
import { filterValidationSchema, filterValues } from '../formDetails';
import { fetchSegmentationDetails } from '../../../store/actions';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { itemsPerPage } from '../../../constants/config';

const keyMapping = {
	searchString: 'Search',
};

const useSegmentationDetailsFilter = () => {
	const dispatch = useDispatch();
	const { segmentationId } = useParams();

	const fetchData = (values) => {
		dispatch(
			fetchSegmentationDetails({
				id: segmentationId,
				perPage: itemsPerPage,
				page: 1,
				...values,
			})
		);
	};

	const handleFilter = (values) => {
		fetchData(values);
	};

	const { validation } = useForm({
		initialValues: filterValues(),
		validationSchema: filterValidationSchema(),
	});

	const filterFormatter = (key, value) => {
		const formattedKey = keyMapping[key] || key;
		return `${formattedKey}: ${value}`;
	};

	const selectedFiltersComponent = (
		<SelectedFilters
			validation={validation}
			filterFormatter={filterFormatter}
		/>
	);

	const filterComponent = (
		<CustomFilters
			validation={validation}
			handleFilter={handleFilter}
			searchInputPlaceHolder="Search by username or email"
		/>
	);

	return {
		filterValidation: validation,
		filterComponent,
		selectedFiltersComponent,
	};
};

export default useSegmentationDetailsFilter;
