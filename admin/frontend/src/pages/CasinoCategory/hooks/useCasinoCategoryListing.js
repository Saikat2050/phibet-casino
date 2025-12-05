import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { formatDateYMD } from '../../../utils/dateFormatter';
import {
	deleteCasinoCategoryStart,
	getCasinoCategoryDetailStart,
	getLanguagesStart,
	updateCasinoStatusStart,
} from '../../../store/casinoManagement/actions';
import { useConfirmModal } from '../../../components/Common/ConfirmModal';

const useCasinoCategoryListing = (filterValues = {}) => {
	const {
		casinoCategoryDetails,
		iscasinoCategoryDetailsLoading,
		languageData,
		isCreateCategorySuccess,
		isEditCategorySuccess,
	} = useSelector((state) => state.CasinoManagementData);
	const navigate = useNavigate();
	const { openConfirmModal } = useConfirmModal();
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

	const formattedCasinoCategoriesData = useMemo(() => {
		if (casinoCategoryDetails?.categories) {
			return casinoCategoryDetails?.categories.map((category) => ({
				...category,
				nameEN: category?.name?.EN,
				createdAt: formatDateYMD(category?.createdAt),
				updatedAt: formatDateYMD(category?.updatedAt),
			}));
		}
		return [];
	}, [casinoCategoryDetails]);

	const fetchData = () => {
		dispatch(
			getCasinoCategoryDetailStart({
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
		if (isCreateCategorySuccess || isEditCategorySuccess) fetchData();
	}, [isCreateCategorySuccess, isEditCategorySuccess]);

	useEffect(() => {
		dispatch(getLanguagesStart());
	}, []);

	const handleStatus = (props) => {
		const { id } = props;
		dispatch(
			updateCasinoStatusStart({
				type: 'category',
				id,
			})
		);
	};

	const handleAddGameClick = ({ id, categoryName }) => {
		navigate(`addGames/${id}`, {
			state: { categoryName },
		});
	};

	const onClickConfirmDelete = (categoryId) => {
		dispatch(
			deleteCasinoCategoryStart({
				categoryId,
			})
		);
	};

	const handleDeleteClick = (row) => {
		openConfirmModal('Do you really want to delete the Category?', () =>
			onClickConfirmDelete(row?.id)
		);
	};

	return {
		formattedCasinoCategoriesData,
		iscasinoCategoryDetailsLoading,
		languageData,
		page,
		setPage,
		itemsPerPage,
		totalPages: casinoCategoryDetails?.totalPages,
		modal,
		setModal,
		isEdit,
		setIsEdit,
		job,
		setJob,
		handleStatus,
		onChangeRowsPerPage,
		handleAddGameClick,
		onClickConfirmDelete,
		handleDeleteClick,
	};
};

export default useCasinoCategoryListing;
