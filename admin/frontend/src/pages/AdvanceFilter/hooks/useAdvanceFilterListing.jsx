/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from 'react-redux';
import { React, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	IsActive,
	KeyValueCellNA,
	Date,
	KycStatus,
	UserName,
} from '../AdvanceFilterColList';
import {
	applyAdvanceFilter,
	downloadReport,
	//  updateSAUserStatus
} from '../../../store/actions';
// import usePermission from '../../../components/Common/Hooks/usePermission';
// import { modules } from '../../../constants/permissions';
import { ICON_CLASS, TEXT_COLORS } from '../../../utils/constant';
// import Actions from '../../../components/Common/Actions';
import { dateColumnsKey, filterDataKey } from '../constants';
import ExportList from '../../../components/Common/ExportList';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { downloadCsvSchema, staticFormFields } from '../formDetails';

const useAdvanceFilterListing = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { filterData, loading, storeFilterData, isDownloadLading } =
		useSelector((state) => state.advancedFilterReducer);
	const { superAdminUser } = useSelector((state) => state.PermissionDetails);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [isOpen, setIsOpen] = useState(false);
	// const { isGranted } = usePermission();

	const transformSubmittedData = (data) => ({
		condition: (data?.groups || []).map((group) => {
			const groupCondition = {};
			group.fields.forEach((field) => {
				groupCondition[field.field] = {
					op: field.operator,
					value1: field.value1,
					value2: field.value2,
				};
			});
			return groupCondition;
		}),
		perPage: itemsPerPage,
		page: currentPage,
	});
	const transformDownloadCsvSubmittedData = (data) => ({
		condition: (data?.groups || []).map((group) => {
			const groupCondition = {};
			group.fields.forEach((field) => {
				groupCondition[field.field] = {
					op: field.operator,
					value1: field.value1,
					value2: field.value2,
				};
			});
			return groupCondition;
		}),
		download: true,
	});

	const goBack = () => {
		navigate('/advance-filter');
	};
	useEffect(() => {
		if (storeFilterData?.groups?.length) {
			const transformedValues = transformSubmittedData(storeFilterData);
			dispatch(applyAdvanceFilter(transformedValues));
		} else {
			goBack();
		}
	}, [itemsPerPage, currentPage]);

	const onChangeRowsPerPage = (value) => {
		setCurrentPage(1);
		setItemsPerPage(value);
	};

	const handleEditClick = (row) => {
		navigate(`/player-details/${row?.id}`);
	};

	// const handleToggleStatus = (row) => {
	// 	dispatch(
	// 		updateSAUserStatus({
	// 			userIds: [row.id],
	// 			isActive: !row?.isActive,
	// 			pageType: 'PlayerListing',
	// 		})
	// 	);
	// };

	// const handleManageTag = (row) => setShowManageMoney(row?.id);

	const actionsList = [
		{
			actionName: 'Edit',
			actionHandler: handleEditClick,
			// isHidden: !isGranted(modules.player, 'U'),
			icon: ICON_CLASS.edit,
			iconColor: TEXT_COLORS.primary,
		},
		// {
		// 	actionName: 'Toggle Status',
		// 	actionHandler: handleToggleStatus,
		// 	isHidden: !isGranted(modules.player, 'TS'),
		// 	icon: ICON_CLASS.toggleStatus,
		// 	iconColor: TEXT_COLORS.success,
		// },
		// {
		// 	actionName: 'Manage Money',
		// 	actionHandler: handleManageTag,
		// 	isHidden: !isGranted(modules.player, 'U'),
		// 	icon: ICON_CLASS.moneyMultiple,
		// 	iconColor: TEXT_COLORS.info,
		// },
	];

	const formatHeader = (key) =>
		key
			.replace(/_/g, ' ') // Replace underscores with spaces
			.replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word

	const columns = useMemo(() => {
		if (!filterData?.segmentationDetailsData || filterData?.segmentationDetailsData?.length === 0) {
			return [];
		}
		const dynamicColumns = Object.keys(filterData.segmentationDetailsData[0])
			.filter((key) => key !== filterDataKey[key])
			.map((key) => {
				if (key === 'is_active') {
					return {
						Header: formatHeader(key),
						accessor: key,
						filterable: true,
						Cell: ({ cell }) => <IsActive value={cell.value} />,
					};
				}
				if (key === dateColumnsKey[key]) {
					return {
						Header: formatHeader(key),
						accessor: key,
						filterable: true,
						Cell: ({ cell }) => <Date value={cell.value} />,
					};
				}
				if (key === 'kyc_status') {
					return {
						Header: formatHeader(key),
						accessor: key,
						filterable: true,
						Cell: ({ cell }) => <KycStatus value={cell.value} />,
					};
				}
				return {
					Header: formatHeader(key),
					accessor: key,
					filterable: true,
					Cell: ({ cell }) => <KeyValueCellNA value={cell.value} />,
				};
			});
		return [
			{
				Header: 'Username',
				accessor: 'username',
				filterable: true,
				Cell: ({ cell }) => <UserName cell={cell} />,
			},
			...dynamicColumns,
			// {
			// 	Header: 'Action',
			// 	accessor: 'action',
			// 	disableFilters: true,
			// 	disableSortBy: true,
			// 	Cell: ({ cell }) => <Actions cell={cell} actionsList={actionsList} />,
			// },
		];
	}, [filterData?.segmentationDetailsData, actionsList]);

	const closeDownloadModel = () => {
		setIsOpen(false);
	};

	const handleDownload = (value) => {
		if (storeFilterData?.groups?.length) {
			const transformedValues =
				transformDownloadCsvSubmittedData(storeFilterData);
			const updatedValues = { ...transformedValues, ...value };
			dispatch(downloadReport({ updatedValues, callBack: closeDownloadModel }));
		} else {
			goBack();
		}
		downloadReport();
	};

	const { validation, formFields, header } = useForm({
		header: 'Export CSV Report',
		validationSchema: downloadCsvSchema,
		initialValues: {
			email: superAdminUser?.email ?? '',
		},
		onSubmitEntry: handleDownload,
		staticFormFields: staticFormFields(),
	});

	const showDownloadModel = () => {
		setIsOpen(true);
	};

	// const exportList = useMemo(
	// 	() => [
	// 		{
	// 			label: 'Export',
	// 			isDownload: true,
	// 			isCsv: true,
	// 			tooltip: 'Export CSV Report',
	// 			icon: <i className="mdi mdi-file-document-multiple" />,
	// 			buttonColor: 'primary',
	// 			type: 'fullCsv',
	// 			handleDownload: showDownloadModel,
	// 			isDownloading: isDownloadLading,
	// 			disabled: !filterData?.segmentationDetailsData?.length,
	// 		},
	// 	],
	// 	[filterData]
	// );

	// const actionList = <ExportList exportList={exportList} />;

	return {
		columns,
		formattedSegments: filterData?.segmentationDetailsData ?? [],
		itemsPerPage,
		totalPlayerPages: filterData?.totalPages,
		setCurrentPage,
		currentPage,
		onChangeRowsPerPage,
		loading,
		// actionList,
		isOpen,
		setIsOpen,
		validation,
		formFields,
		header,
		isDownloadLading,
	};
};

export default useAdvanceFilterListing;
