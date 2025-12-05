/* eslint-disable react/prop-types */
/* eslint-disable react/no-unstable-nested-components */
import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { Row } from 'reactstrap';
import TableContainer from '../../../components/Common/Table';
import { getTournamentTransactionStart } from '../../../store/tournaments/actions';

const KeyValueCell = ({ value }) => value || 0;

const Transactions = ({ tournamentDetail, currencyId }) => {
	const dispatch = useDispatch();
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);

	const { tournamentTransactions, tournamentTransactionsLoading } = useSelector(
		(state) => state.Tournament
	);

	useEffect(() => {
		if (tournamentDetail?.id && currencyId)
			dispatch(
				getTournamentTransactionStart({
					perPage: itemsPerPage,
					page: currentPage,
					tournamentId: tournamentDetail?.id,
					currencyId,
				})
			);
	}, [itemsPerPage, currentPage, tournamentDetail?.id, currencyId]);

	const formattedTransactions = useMemo(() => {
		if (tournamentTransactions?.tournamentTransactions?.length > 0) {
			return tournamentTransactions?.tournamentTransactions?.map((info) => ({
				...info,
				userName: info?.user?.username,
				createdAt: moment(info?.createdAt).format('YYYY-MM-DD hh:mm A'),
				gameName: info?.casinoGame?.name,
			}));
		}
		return [];
	}, [tournamentTransactions]);

	const onChangeRowsPerPage = (value) => {
		setItemsPerPage(value);
	};

	const columns = useMemo(
		() => [
			{
				Header: 'TRANSACTION ID',
				accessor: 'id',
				Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
			},
			{
				Header: 'USERNAME',
				accessor: 'userName',
				Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
			},
			{
				Header: 'GAME NAME',
				accessor: 'gameName',
				filterable: true,
				Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
			},
			{
				Header: 'POINTS',
				accessor: 'points',
				filterable: true,
				Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
			},
			{
				Header: 'Purpose',
				accessor: 'purpose',
				filterable: true,
				Cell: ({ cell }) => <KeyValueCell value={cell.value || 0} />,
			},
			{
				Header: 'Type',
				accessor: 'type',
				filterable: true,
				Cell: ({ cell }) => <KeyValueCell value={cell.value || 0} />,
			},
			{
				Header: 'DATE',
				accessor: 'createdAt',
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
				data={formattedTransactions || []}
				isPagination
				isLoading={tournamentTransactionsLoading}
				customPageSize={itemsPerPage}
				paginationDiv="justify-content-center"
				pagination="pagination justify-content-start pagination-rounded"
				totalPageCount={tournamentTransactions?.totalPages || 1}
				isManualPagination
				onChangePagination={setCurrentPage}
				currentPage={currentPage}
				changeRowsPerPageCallback={onChangeRowsPerPage}
				tableClass="table-striped table-hover "
			/>
		</Row>
	);
};

export default Transactions;
