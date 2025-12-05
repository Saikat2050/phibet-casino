/* eslint-disable react/prop-types */
import { useDispatch } from 'react-redux';
import React, { useMemo } from 'react';

import { updateStateStatusStart } from '../../../store/actions';
import { StateCode, StateName, Status } from '../StatesListCol';
import { ICON_CLASS, TEXT_COLORS } from '../../../utils/constant';
import usePermission from '../../../components/Common/Hooks/usePermission';
import { modules } from '../../../constants/permissions';
import Actions from '../../../components/Common/Actions';

const useEditState = () => {
	const dispatch = useDispatch();
	const { isGranted } = usePermission();

	const handleStatus = (row) => {
		dispatch(
			updateStateStatusStart({
				stateId: row?.id,
			})
		);
	};

	const actionsList = [
		{
			actionName: 'Toggle Status',
			actionHandler: handleStatus,
			isHidden: false,
			icon: ICON_CLASS.toggleStatus,
			iconColor: TEXT_COLORS.success,
		},
	];

	const columns = useMemo(
		() => [
			{
				Header: 'State Code',
				accessor: 'code',
				Cell: ({ cell }) => <StateCode value={cell.value} />,
			},
			{
				Header: 'Name',
				accessor: 'name',
				Cell: ({ cell }) => <StateName value={cell.value} />,
			},
			{
				Header: 'Status',
				accessor: 'isActive',
				disableSortBy: true,
				Cell: ({ cell }) => <Status value={cell.value} />,
			},
			{
				Header: 'Actions',
				disableSortBy: true,
				accessor: 'actions',
				Cell: ({ cell }) => {
					const onlyReadPermission = !isGranted(modules.state, 'TS');

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
		[isGranted(modules.state, 'TS')]
	);

	return {
		columns,
	};
};

export default useEditState;
