import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
	deleteSeoRouteStart,
	getAllSeoRoutesStart,
} from '../../../store/actions';

const useSeoListing = (filterValues = {}) => {
	const {
		seoRoutesLoading,
		seoRoutes,
		createRouteSuccess,
		updateRouteSuccess,
		deleteRouteSuccess,
		deleteRouteInprogress,
	} = useSelector((state) => state.SeoData);

	const navigate = useNavigate();
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [page, setPage] = useState(1);
	const [modal, setModal] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [job, setJob] = useState(null);
	const dispatch = useDispatch();

	const onChangeRowsPerPage = (value) => {
		setPage(1);
		setItemsPerPage(value);
	};

	const fetchData = () => {
		dispatch(
			getAllSeoRoutesStart({
				perPage: itemsPerPage,
				page,
				...filterValues,
			})
		);
	};

	useEffect(() => {
		fetchData();
	}, [page, itemsPerPage]);

	useEffect(() => {
		if (createRouteSuccess || updateRouteSuccess || deleteRouteSuccess)
			fetchData();
	}, [createRouteSuccess, updateRouteSuccess, deleteRouteSuccess]);

	const handleAddGameClick = ({ e, categoryId, categoryName }) => {
		e.preventDefault();
		navigate(`addGames/${categoryId}`, {
			state: { categoryName },
		});
	};

	const onClickDelete = (seoPageId) => {
		dispatch(
			deleteSeoRouteStart({
				seoPageId,
			})
		);
	};

	return {
		formattedCasinoCategoriesData: seoRoutes?.pages || [],
		seoRoutesLoading,
		page,
		setPage,
		itemsPerPage,
		totalPages: seoRoutes?.totalPages,
		modal,
		setModal,
		isEdit,
		setIsEdit,
		job,
		setJob,
		// handleStatus,
		onChangeRowsPerPage,
		handleAddGameClick,
		onClickDelete,
		deleteRouteInprogress,
	};
};

export default useSeoListing;
