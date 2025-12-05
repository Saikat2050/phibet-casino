/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';

import { GameCategoryId, Status } from '../SeoRoutesListCol';
import usePermission from '../../../components/Common/Hooks/usePermission';
import { modules } from '../../../constants/permissions';
import { ICON_CLASS, TEXT_COLORS } from '../../../utils/constant';
import Actions from '../../../components/Common/Actions';
import { useNavigate } from 'react-router-dom';

const useSeoColumn = ({
	onClickEdit,
	onClickDelete,
	deleteRouteInprogress
}) => {
	const { isGranted, permissions } = usePermission();

	const navigate = useNavigate()

	const handleView = (cell) => {
		navigate(`/seo-slug/${cell.id}`)
	}

	const handleDelete = (cell) => {
		onClickDelete(cell.id)
	}

	const actionsList = () => [
		{
			actionName: 'View',
			actionHandler: handleView,
			isHidden: !isGranted(modules.seoPage, 'R'),
			icon: ICON_CLASS.view,
			iconColor: TEXT_COLORS.primary,
		},
		{
			actionName: 'Edit',
			actionHandler: onClickEdit,
			isHidden: !isGranted(modules.seoPage, 'U'),
			icon: ICON_CLASS.edit,
			iconColor: TEXT_COLORS.primary,
		},
		{
			actionName: 'Delete',
			actionHandler: handleDelete,
			isHidden: !isGranted(modules.seoPage, 'D'),
			icon: ICON_CLASS.delete,
			iconColor: TEXT_COLORS.danger,
		},
	];

	const columns = useMemo(
		() => [
			{
				Header: 'ID',
				accessor: 'id',
				notHidable: true,
				filterable: true,
				Cell: ({ cell }) => <GameCategoryId value={cell.value} />,
			},
			{
				Header: 'SLUG',
				accessor: 'slug',
				filterable: false,
				Cell: ({ cell }) => <span>{cell.value}</span>,
			},
			{
				Header: 'META TITLE',
				accessor: 'title',
				filterable: true,
				Cell: ({ cell }) => <span>{cell.value}</span>,
			},

			{
				Header: 'META DESCRIPTION',
				accessor: 'description',
				filterable: false,
				Cell: ({ cell }) => <span>{cell.value}</span>,
			},
			{
				Header: 'CANONICAL URL',
				accessor: 'canonicalUrl',
				filterable: false,
				Cell: ({ cell }) => (cell.value ? <span>{cell.value}</span> : '-'),
			},
			{
				Header: 'INDEX',
				accessor: 'noIndex',
				filterable: true,
				disableSortBy: true,
				Cell: ({ cell }) => <Status value={cell.value} />,
			},
			{
				Header: 'Action',
				accessor: 'action',
				disableFilters: true,
				disableSortBy: true,
				Cell: ({ cell }) => (
					<Actions cell={cell} actionsList={actionsList(cell?.row?.original)} />
				),
			}
		],
		[permissions]
	);
	return columns;
};

export default useSeoColumn;
