import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
	useTable,
	useGlobalFilter,
	useSortBy,
	useFilters,
	useExpanded,
	usePagination,
} from 'react-table';
import {
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Button,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDropdown } from '../../../store/actions';

const useTableCustom = (
	data,
	columns,
	isManualPagination,
	onChangePagination,
	customPageSize,
	totalPageCount,
	isLoading,
	columnType
) => {
	const dispatch = useDispatch();
	const openDropdownType = useSelector(
		(state) => state.Layout.openDropdownType
	);

	const filterableColumns = useMemo(() => {
  return columns.reduce((acc, column) => {
    acc[column.Header] = true;
    return acc;
  }, {});
}, [columns]);

const [filteredColumns, setFilteredColumns] = useState(filterableColumns);

useEffect(() => {
  setFilteredColumns(filterableColumns);
}, [filterableColumns]);

	useEffect(
		() => () => {
			dispatch(toggleDropdown(''));
		},
		[]
	);
	const tableHeaderClass = useSelector(
		(state) => state.Layout.tableHeaderClass
	);

	const visibleColumns = useMemo(
		() => columns.filter((column) => filteredColumns[column.Header] === true),
		[columns, filteredColumns]
	);

	const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } =
		useTable(
			{
				columns: visibleColumns,
				data,
				initialState: {
					pageIndex: 0,
					pageSize: customPageSize,
				},
				manualPagination: isManualPagination,
				pageCount: totalPageCount,
			},
			useGlobalFilter,
			useFilters,
			useSortBy,
			useExpanded,
			usePagination
		);

	const handlePagination = (newPage) => {
		if (isManualPagination) {
			onChangePagination((newPage?.selected || 0) + 1);
		}
	};

	const noDataFound = !isLoading && !page.length;

	const generateSortingIndicator = (column) => {
		if (column.isSorted) {
			return (
				<i
					className={`bx bx-${column.isSortedDesc ? 'down' : 'up'
						}-arrow-alt text-primary font-size-16`}
				/>
			);
		}
		if (!column.disableSortBy) {
			return <i className="bx bx-sort text-primary" />;
		}
		return null;
	};

	// Toggle column visibility
	const handleColumnHide = useCallback((header) => {
		setFilteredColumns((prevState) => ({
			...prevState,
			[header]: !prevState[header],
		}));
	}, []);

	const handleClose = () => {
		dispatch(toggleDropdown(''));
	};

	const customColSetting = (
		<UncontrolledDropdown isOpen={openDropdownType === columnType}>
			<DropdownToggle
				type="button"
				className="btn btn-light btn-outline-primary"
				onClick={() => {
					dispatch(
						toggleDropdown(openDropdownType === columnType ? '' : columnType)
					);
				}}
			>
				Columns
			</DropdownToggle>
			<DropdownMenu className="dropdown-menu px-2">
				<div role="menu">
					{columns
						?.filter(({ Header }) => typeof Header === 'string')
						?.map((column) => (
							<DropdownItem
								key={column.accessor}
								className="px-2 columns dropdown-item d-flex justify-content-between"
								tabIndex={0}
								onClick={() => {
									handleColumnHide(column.Header);
								}}
							>
								<span style={{ textTransform: 'uppercase' }}>
									{column.Header}
								</span>
								{filteredColumns[column.Header] && (
									<i className="bx bx-check me-2 text-primary" />
								)}
							</DropdownItem>
						))}
				</div>
				<div className="d-flex justify-content-end">
					<Button
						color="link"
						className="btn btn-link waves-effect"
						onClick={handleClose}
					>
						Close
					</Button>
				</div>
			</DropdownMenu>
		</UncontrolledDropdown>
	);

	return {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		page,
		prepareRow,
		generateSortingIndicator,
		noDataFound,
		tableHeaderClass,
		handlePagination,
		customColSetting,
	};
};

export default useTableCustom;
