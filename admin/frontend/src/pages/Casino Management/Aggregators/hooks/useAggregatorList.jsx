/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import {
	// ID,
	Name,
	Status,
} from '../AggregatorListCol';
import usePermission from '../../../../components/Common/Hooks/usePermission';
import { modules } from '../../../../constants/permissions';
import { ICON_CLASS, TEXT_COLORS } from '../../../../utils/constant';
import Actions from '../../../../components/Common/Actions';

const useAggregatorList = (handleStatus) => {
	const { isGranted } = usePermission();

	const actionsList = [
		{
			actionName: 'Toggle Status',
			actionHandler: handleStatus,
			isHidden: !isGranted(modules.casinoManagement, 'TS'),
			icon: ICON_CLASS.toggleStatus,
			iconColor: TEXT_COLORS.success,
		},
	];

	const columns = useMemo(
		() => [
			// {
			// 	Header: 'ID',
			// 	accessor: 'id',
			// 	notHidable: true,
			// 	filterable: true,
			// 	Cell: ({ cell }) => <ID value={cell.value} />,
			// },
			{
				Header: 'NAME',
				accessor: 'name',
				filterable: true,
				Cell: ({ cell }) => <Name value={cell.value} />,
			},
			{
				Header: 'STATUS',
				accessor: 'isActive',
				disableSortBy: true,
				disableFilters: true,
				Cell: ({ cell }) => <Status value={cell.value} />,
			},
			{
				Header: 'ACTION',
				accessor: 'action',
				disableSortBy: true,
				disableFilters: true,
				Cell: ({ cell }) => {
					const onlyReadPermission = !isGranted(modules.casinoManagement, 'TS');

					return (
						<Actions
							cell={cell}
							actionsList={actionsList}
							disabled={onlyReadPermission}
						/>
					);
				},
			},
		],
		[isGranted(modules.casinoManagement, 'TS')]
	);
	return columns;
};

export default useAggregatorList;
