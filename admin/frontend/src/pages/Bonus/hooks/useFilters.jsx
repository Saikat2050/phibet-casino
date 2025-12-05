/* eslint-disable eqeqeq */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import {
	filterValidationSchema,
	filterValues,
	staticFiltersFields,
} from '../formDetails';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { getAllTags, getBonusesStart } from '../../../store/actions';
import { itemsPerPage } from '../../../constants/config';
import SelectedFilters from '../../../components/Common/SelectedFilters';
import CustomFilters from '../../../components/Common/CustomFilters';
import { ACTIVE_KEY_MAP } from '../../../constants/common';
import { BONUS_TYPES } from '../constants';
import { modules } from '../../../constants/permissions';
import usePermission from '../../../components/Common/Hooks/usePermission';

const keyMapping = {
	bonusType: 'Bonus Type',
	search: 'Search',
	isActive: 'Active',
	// tagIds: 'Segments',
};

const bonusTypesMapper = {
	[BONUS_TYPES.AMOE_CODE]: 'Amoe Code',
	[BONUS_TYPES.JOINING]: 'Joining',
	[BONUS_TYPES.DAILY]: 'Daily',
	[BONUS_TYPES.REFERRAL]: 'Referral',
};

const useFilters = () => {
	const { isGranted } = usePermission();
	const dispatch = useDispatch();
	const { userTags } = useSelector((state) => state.UserDetails);

	const fetchData = (values) => {
		dispatch(
			getBonusesStart({
				perPage: itemsPerPage,
				page: 1,
				...values,
			})
		);
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
			// const tags = userTags?.tags?.map((userTag) => ({
			// 	optionLabel: userTag?.tag,
			// 	value: userTag.id,
			// }));
			setFormFields([
				...staticFiltersFields(),
				// {
				// 	name: 'tagIds',
				// 	fieldType: 'select',
				// 	label: '',
				// 	placeholder: 'Select Segment',
				// 	optionList: tags,
				// },
			]);
		}
	}, [userTags]);

	const filterFormatter = (key, value) => {
		const formattedKey = keyMapping[key] || key;

		let formattedValue = value;

		switch (key) {
			case 'isActive':
				formattedValue = ACTIVE_KEY_MAP[value];
				break;
			// case 'tagIds':
			// 	formattedValue =
			// 		userTags?.tags?.find((tag) => tag.id == value)?.tag || '';
			// 	break;
			case 'bonusType':
				formattedValue = bonusTypesMapper[value];
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
			searchInputPlaceHolder="Search by Title"
			searchInputName="search"
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
