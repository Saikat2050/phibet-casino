import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import moment from 'moment';
import {
	filterValidationSchema,
	filterValues,
	staticFiltersFields,
} from '../formDetails';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { getTournamentDetailsStart } from '../../../store/tournaments/actions';
import { getAllTags } from '../../../store/actions';
import SelectedFilters from '../../../components/Common/SelectedFilters';
import CustomFilters from '../../../components/Common/CustomFilters';
import { modules } from '../../../constants/permissions';
import usePermission from '../../../components/Common/Hooks/usePermission';

const keyMapping = {
	endDate: 'To',
	startDate: 'From',
	search: 'Search',
	status: 'Status',
	tagIds: 'Segment',
};

const statusMapping = {
	active: 'Active',
	'in-active': 'In-Active',
	settled: 'Settled',
	cancelled: 'Cancelled',
};

// const statusMapping = {
// 	active: 'Active',
// 	'in-active': 'In-Active',
// 	settled: 'Settled',
// 	cancelled: 'Cancelled',
// };

const useFilters = (itemsPerPage) => {
	const { isGranted } = usePermission();
	const dispatch = useDispatch();
	const { userTags } = useSelector((state) => state.UserDetails);

	const fetchData = (values) => {
		const data = {
			perPage: itemsPerPage,
			page: 1,
			...values,
		};

		if (values?.endDate) {
			data.endDate =
				moment(values?.endDate).utc().clone().add(1, 'days').format() || '';
		}
		dispatch(getTournamentDetailsStart(data));
	};

	const handleFilter = (values) => {
		fetchData(values);
	};

	useEffect(() => {
		if (!userTags && isGranted(modules.segmentation, 'R')) {
			dispatch(getAllTags());
		}
	}, []);

	const { validation, formFields, setFormFields } = useForm({
		initialValues: filterValues(),
		validationSchema: filterValidationSchema(),
		staticFormFields: staticFiltersFields(),
	});

	useEffect(() => {
		if (!isEmpty(userTags)) {
			const tags = userTags?.tags?.map((userTag) => ({
				optionLabel: userTag?.tag,
				value: userTag.id,
			}));
			setFormFields([
				...staticFiltersFields(),
				{
					name: 'tagIds',
					fieldType: 'select',
					label: '',
					placeholder: 'Select Segment',
					optionList: tags,
				},
			]);
		}
	}, [userTags]);

	const filterFormatter = (key, value) => {
		const formattedKey = keyMapping[key] || key;

		let formattedValue = value;

		switch (key) {
			case 'status':
				formattedValue = statusMapping[value];
				break;
			case 'startDate':
			case 'endDate': {
				const date = new Date(value);
				formattedValue = date.toLocaleDateString('en-GB');
				break;
			}
			case 'tagIds':
				formattedValue =
					userTags?.tags?.find((tag) => tag.id === value)?.tag || '';
				break;
			default:
				break;
		}

		return `${formattedKey}: ${formattedValue}`;
	};

	const selectedFiltersComponent = (
		<SelectedFilters
			validation={validation}
			filterFormatter={filterFormatter}
		/>
	);

	const filterComponent = (
		<CustomFilters
			filterFields={formFields}
			validation={validation}
			handleFilter={handleFilter}
			searchInputName="search"
			searchInputPlaceHolder="Search by tournament"
		/>
	);

	return {
		filterFields: formFields,
		filterValidation: validation,
		filterComponent,
		selectedFiltersComponent,
	};
};

export default useFilters;
