/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from 'react-redux';
import { React, useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Date, IsActive, KeyValueCellNA, KycStatus, UserName } from '../SegmentColList';
import { fetchSegmentationDetails } from '../../../store/segmentation/actions';
import { dateColumnsKey, filterDataKey } from '../constants';

const useSegmentationDetails = (filterValues = {}) => {
	const dispatch = useDispatch();
	const { segmentationId } = useParams();
	const location = useLocation();
	const segmentationName = location.state?.name;
	const { segmentationDetailsData, loadingSegmentationDetails } = useSelector(
		(state) => state.Segmentation
	);

	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		dispatch(
			fetchSegmentationDetails({
				id: segmentationId,
				perPage: itemsPerPage,
				page: currentPage,
				...filterValues,
			})
		);
	}, [itemsPerPage, currentPage]);

	useEffect(() => {
		dispatch(
			fetchSegmentationDetails({
				id: segmentationId,
				perPage: itemsPerPage,
				page: currentPage
			})
		);
	}, [])

	const onChangeRowsPerPage = (value) => {
		setCurrentPage(1);
		setItemsPerPage(value);
	};

	const formatHeader = (key) =>
		key
			.replace(/_/g, ' ')
			.replace(/\b\w/g, (char) => char.toUpperCase());
	const columns = useMemo(() => {
		if (
			!segmentationDetailsData?.segmentationDetailsData||
			segmentationDetailsData?.segmentationDetailsData?.length === 0
		) {
			return [];
		}

		const keys = Object.keys(segmentationDetailsData?.segmentationDetailsData[0]).filter(
			(key) => key !== filterDataKey[key] && key !== 'username'
		);

		const dynamicColumns = keys.map((key) => {
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
		];
	}, [segmentationDetailsData, loadingSegmentationDetails]);

	return {
		columns,
		formattedSegments: segmentationDetailsData?.segmentationDetailsData ?? [],
		itemsPerPage,
		totalPlayerPages: segmentationDetailsData?.totalPages,
		setCurrentPage,
		currentPage,
		onChangeRowsPerPage,
		loadingSegmentationDetails,
		segmentationName,
	};
};

export default useSegmentationDetails;
