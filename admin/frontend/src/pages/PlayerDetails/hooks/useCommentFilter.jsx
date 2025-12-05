import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { isEqual } from 'lodash';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import {
	commentsFilterValidationSchema,
	commentsFilterValues,
	commentsFiltersFields,
} from '../formDetails';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { getUserComments } from '../../../store/actions';
import { debounceTime, itemsPerPage } from '../../../constants/config';

let debounce;
const useCommentFilter = () => {
	const dispatch = useDispatch();
	const [isAdvanceOpen, setIsAdvanceOpen] = useState(false);
	const toggleAdvance = () => setIsAdvanceOpen((pre) => !pre);
	const { playerId } = useParams();
	const prevValues = useRef(null);
	const isFirst = useRef(true);
	const [isFilterChanged, setIsFilterChanged] = useState(false);

	const fetchData = (values) => {
		dispatch(
			getUserComments({
				perPage: itemsPerPage,
				page: 1,
				userId: playerId,
				...values,
			})
		);
	};

	const handleFilter = (values) => {
		const payload = { ...values };

		if (payload.fromDate) {
			payload.fromDate = moment(payload.fromDate).format(
				'YYYY-MM-DDTHH:mm:ss.SSS[Z]'
			);
		}
		if (payload.toDate) {
			payload.toDate = moment(payload.toDate).format(
				'YYYY-MM-DDTHH:mm:ss.SSS[Z]'
			);
		}
		fetchData(payload);
	};

	const { validation, formFields } = useForm({
		initialValues: commentsFilterValues(),
		validationSchema: commentsFilterValidationSchema(),
		// onSubmitEntry: handleFilter,
		staticFormFields: commentsFiltersFields(),
	});

	// const handleAdvance = () => {
	// 	toggleAdvance();
	// };

	const handleClear = () => {
		const initialValues = commentsFilterValues();
		validation.resetForm(initialValues);
	};

	useEffect(() => {
		if (!isFirst.current && !isEqual(validation.values, prevValues.current)) {
			setIsFilterChanged(true);
			debounce = setTimeout(() => {
				handleFilter(validation.values);
			}, debounceTime);
			prevValues.current = validation.values;
		}
		isFirst.current = false;
		if (isEqual(commentsFilterValues(), validation.values)) {
			setIsFilterChanged(false);
		}
		return () => clearTimeout(debounce);
	}, [validation.values]);

	const actionButtons = useMemo(() => [
		{
			type: 'button', // if you pass type button handle the click event
			label: '',
			icon: 'mdi mdi-refresh',
			handleClick: handleClear,
			tooltip: 'Clear filter',
			id: 'clear',
		},
	]);

	return {
		toggleAdvance,
		isAdvanceOpen,
		filterFields: formFields,
		actionButtons,
		filterValidation: validation,
		isFilterChanged,
	};
};

export default useCommentFilter;
