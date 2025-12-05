/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row } from 'reactstrap';
import TableContainer from '../../../components/Common/Table';
import { getTournamentLeaderBoardDetailStart } from '../../../store/tournaments/actions';

const KeyValueCell = ({ value }) => value || 0;

const UserName = ({ cell }) => cell?.value ?? '';

const LeaderBoard = ({ tournamentDetail, currencyId, currencyWise }) => {
	const dispatch = useDispatch();
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);

	const { leaderBoardInfo } = useSelector((state) => state.Tournament);

	useEffect(() => {
		if (tournamentDetail?.id && currencyId)
			dispatch(
				getTournamentLeaderBoardDetailStart({
					page: currentPage,
					perPage: itemsPerPage,
					tournamentId: tournamentDetail?.id,
					currencyId,
				})
			);
	}, [itemsPerPage, currentPage, tournamentDetail?.id, currencyId]);

	const formattedLeaderBoardData = useMemo(() => {
		if (leaderBoardInfo?.leaderBoard?.length > 0) {
			return leaderBoardInfo?.leaderBoard?.map((info, index) => ({
				...info,
				name: info?.user?.username,
				winPrize: `${currencyWise?.symbol || ''} ${info?.winPrize ?? 0}`,
				leaderBoardId: index + 1,
			}));
		}
		return [];
	}, [leaderBoardInfo]);

	const onChangeRowsPerPage = (value) => {
		setItemsPerPage(value);
	};

	const columns = useMemo(
		() => [
			{
				Header: 'POSITION',
				accessor: 'leaderBoardId',
				Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
			},
			{
				Header: 'USERNAME',
				accessor: 'name',
				Cell: ({ cell }) => <UserName cell={cell} />,
			},
			{
				Header: 'AMOUNT SPENT',
				accessor: 'amountSpent',
				Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
			},
			{
				Header: 'WIN POINTS',
				accessor: 'winPoints',
				filterable: true,
				Cell: ({ cell }) => (
					<KeyValueCell value={parseFloat(cell?.value).toFixed(2) || 0} />
				),
			},
			{
				Header: 'POINTS',
				accessor: 'points',
				filterable: true,
				Cell: ({ cell }) => (
					<KeyValueCell value={parseFloat(cell?.value).toFixed(2) || 0} />
				),
			},
			{
				Header: 'PRIZE',
				accessor: 'winPrize',
				filterable: true,
				Cell: ({ cell }) => <KeyValueCell value={cell.value || 0} />,
			},
		],
		[]
	);
	return (
		<Row lg={12}>
			<TableContainer
				columns={columns || []}
				data={formattedLeaderBoardData || []}
				isPagination
				customPageSize={itemsPerPage}
				paginationDiv="justify-content-center"
				pagination="pagination justify-content-start pagination-rounded"
				totalPageCount={leaderBoardInfo?.totalPages || 1}
				isManualPagination
				onChangePagination={setCurrentPage}
				currentPage={currentPage}
				changeRowsPerPageCallback={onChangeRowsPerPage}
				tableClass="table-striped table-hover "
			/>
		</Row>
	);
};

export default LeaderBoard;
