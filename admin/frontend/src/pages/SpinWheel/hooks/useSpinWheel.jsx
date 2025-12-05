/* eslint-disable react/prop-types */
/* eslint-disable no-use-before-define */
import { useDispatch, useSelector } from 'react-redux';
import { React, useEffect, useMemo, useState } from 'react';
import { KeyValueCell, Priority, Status } from '../SpinWheelListCol';
import {
	getSpinWheelData,
	updateSpinWheelDataStart,
} from '../../../store/actions';
import usePermission from '../../../components/Common/Hooks/usePermission';
import { modules } from '../../../constants/permissions';
import { ICON_CLASS, TEXT_COLORS } from '../../../utils/constant';
import Actions from '../../../components/Common/Actions';
import {
	getSpinwheelInitialValues,
	SpinWheelSchema,
	staticFormFields,
} from '../formDetails';
import useForm from '../../../components/Common/Hooks/useFormModal';

const useSpinWheel = () => {
	const dispatch = useDispatch();
	const { isGranted } = usePermission();
	const { spinWheelData, loading } = useSelector((state) => state.spinWheel);
	const [isEdit, setIsEdit] = useState({ open: false, selectedRow: '' });

	useEffect(() => {
		dispatch(getSpinWheelData());
	}, []);

	const formattedSegments = useMemo(
		() =>
			spinWheelData?.wheelConfiguration?.map((data) => ({
				id: data?.wheelDivisionId,
				gc: data?.gc,
				sc: data?.sc,
				isActive: data?.isAllow,
				playerLimit: data?.playerLimit,
				priority: data?.priority,
			})) || [],
		[spinWheelData]
	);

	const handleSpinWheel = (data) => {
		if (isEdit.cell.id) {
			dispatch(
				updateSpinWheelDataStart({ ...data, wheelDivisionId: isEdit.cell.id })
			);
			toggleFormModal();
		}
	};

	const { isOpen, setIsOpen, validation, setHeader, header, formFields } =
		useForm({
			header: '',
			initialValues: getSpinwheelInitialValues(),
			validationSchema: SpinWheelSchema,
			onSubmitEntry: handleSpinWheel,
			staticFormFields: staticFormFields(),
		});

	const toggleFormModal = () => {
		setIsOpen((prev) => !prev);
	};

	const onClickEdit = (cell) => {
		validation.setValues(getSpinwheelInitialValues(cell));
		setIsEdit({ open: true, cell });
		setHeader(`Update Segment ${cell?.id}`);
		setIsOpen((prev) => !prev);
	};

	const handleStatus = (cell) => {
		dispatch(
			updateSpinWheelDataStart({
				isAllow: !cell.isActive,
				wheelDivisionId: cell.id,
			})
		);
	};

	const actionsList = () => [
		{
			actionName: 'Edit',
			actionHandler: onClickEdit,
			isHidden: !isGranted(modules.spinWheelConfiguration, 'U'),
			icon: ICON_CLASS.edit,
			iconColor: TEXT_COLORS.primary,
		},
		{
			actionName: 'Toggle Status',
			actionHandler: handleStatus,
			isHidden: !isGranted(modules.spinWheelConfiguration, 'TS'),
			icon: ICON_CLASS.toggleStatus,
			iconColor: TEXT_COLORS.success,
		},
	];

	const columns = useMemo(
		() => [
			{
				Header: 'division id',
				accessor: 'id',
				filterable: true,
				Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
			},
			{
				Header: 'gc coin',
				accessor: 'gc',
				filterable: true,
				Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
			},
			{
				Header: 'sc coin',
				accessor: 'sc',
				filterable: true,
				Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
			},
			{
				Header: 'Player Limit',
				accessor: 'playerLimit',
				filterable: true,
				Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
			},
			{
				Header: 'priority',
				accessor: 'priority',
				filterable: true,
				Cell: ({ cell }) => <Priority value={cell.value} />,
			},
			{
				Header: 'Status',
				accessor: 'isActive',
				disableFilters: true,
				disableSortBy: true,
				Cell: ({ cell }) => <Status value={cell.value} />,
			},
			{
				Header: 'Actions',
				accessor: 'actions',
				disableSortBy: true,
				disableFilters: true,
				Cell: ({ cell }) => {
					const onlyReadPermission =
						!isGranted(modules.spinWheelConfiguration, 'U') &&
						!isGranted(modules.spinWheelConfiguration, 'C') &&
						!isGranted(modules.spinWheelConfiguration, 'TS');

					return (
						<Actions
							cell={cell}
							actionsList={actionsList(cell)}
							disabled={onlyReadPermission}
						/>
					);
				},
			},
		],
		[
			isGranted(modules.spinWheelConfiguration, 'U'),
			isGranted(modules.spinWheelConfiguration, 'C'),
			isGranted(modules.spinWheelConfiguration, 'TS'),
		]
	);

	return {
		columns,
		formattedSegments,
		totalPlayerPages: spinWheelData?.totalPages,
		loading,
		isOpen,
		toggleFormModal,
		header,
		validation,
		formFields,
	};
};

export default useSpinWheel;
