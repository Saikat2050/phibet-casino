/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Card, Container } from 'reactstrap';
import TableContainer from '../../components/Common/Table';
import { KeyValueCell, WalletAmount } from './TableCol';

const PlayerWallet = ({ userDetails, heading = 'Player Wallet' }) => {
	const { currencies, defaultCurrency, currencyById } = useSelector(
		(state) => state.Currencies
	);

	const walletData = useMemo(() => {
		if (userDetails?.wallets?.length > 0) {
			return userDetails?.wallets?.map((wallet) => ({
				...wallet,
				currencyCode: wallet?.currency?.code,
			}));
		}
		return [];
	}, [userDetails]);

	const columns = useMemo(
		() => [
			{
				Header: 'Code',
				accessor: 'currencyCode',
				// filterable: true,
				Cell: ({ value }) => <KeyValueCell value={value} />,
			},
			{
				Header: 'Quantity',
				accessor: 'amount',
				Cell: ({ cell, row }) => (
					<WalletAmount
						value={cell.value}
						type={row.original.ledger?.fromWalletId}
						defaultCurrency={
							currencyById?.[row?.original?.currencyId] || defaultCurrency
						}
					/>
				),
			},
			{
				Header: 'Vault Quantity',
				accessor: 'vaultAmount',
				Cell: ({ cell, row }) => (
					<WalletAmount
						value={cell.value}
						type={row.original.ledger?.fromWalletId}
						defaultCurrency={
							currencyById?.[row?.original?.currencyId] || defaultCurrency
						}
					/>
				),
			},
		],
		[currencies, defaultCurrency]
	);

	return (
		<Container fluid>
			<Card className="p-2">
				<h4 className="border-bottom p-2">{heading}</h4>
				<TableContainer
					columns={columns}
					data={walletData}
					paginationDiv="justify-content-center"
					pagination="pagination justify-content-start pagination-rounded"
					customPageSize={50}
					tableClass="table-bordered align-middle nowrap mt-2"
					isShowColSettings={false}
				/>
			</Card>
		</Container>
	);
};

export default PlayerWallet;
