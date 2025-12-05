/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardBody, Container } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import TableContainer from '../../components/Common/Table';
import { Id, KeyValueCell, PromotionTitle } from './TableCol';
import { cancelUserBonus, getUserBonus } from '../../store/actions';
import { formatDateYMD } from '../../utils/dateFormatter';
import useBonusFilter from './hooks/useBonusFilter';
import Filters from '../../components/Common/Filters';
import BonusActionButtons from './BonusActionButtons';
import BonusDetails from './modals/BonusDetails';

const YourBonuses = ({ userId }) => {
	const dispatch = useDispatch();
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [bonusDetailsModal, setBonusDetailsModal] = useState({
		open: false,
		data: '',
	});
	const { userBonus, userBonusLoading } = useSelector(
		(state) => state.UserDetails
	);

	const onViewClick = ({ bonusDetails }) => {
		setBonusDetailsModal({ open: true, data: bonusDetails });
	};

	const formattedUserBonus = useMemo(() => {
		const formattedValues = [];
		if (userBonus) {
			userBonus?.rows?.map((bonus) =>
				formattedValues.push({
					...bonus,
					cancelledBy: bonus?.cancelledBy || '-',
					updatedAt: bonus?.updatedAt ? formatDateYMD(bonus?.updatedAt) : '-',
					wageredAmount:
						bonus?.wageredAmount || (bonus?.amountToWager ? '0' : '-'),
					amountToWager: bonus?.amountToWager || '-',
					issuedAt: formatDateYMD(bonus?.createdAt),
					issuedBy: bonus?.issuerRole
						? bonus?.issuerRole === 'user'
							? 'SYSTEM'
							: bonus?.issuerRole?.toUpperCase()
						: '-',
					isExpired:
						formatDateYMD(new Date(String(bonus?.expireAt))) <
						formatDateYMD(new Date())
							? 'Yes'
							: 'No',
					expiredAt: formatDateYMD(bonus?.expireAt),
					promotionTitle: bonus?.promotionTitle?.EN,
				})
			);
		}
		return formattedValues;
	}, [userBonus]);

	useEffect(() => {
		dispatch(
			getUserBonus({
				perPage: itemsPerPage,
				page: currentPage,
				userId,
			})
		);
	}, [currentPage, itemsPerPage]);

	const onCancelClick = ({ userBonusId }) => {
		dispatch(
			cancelUserBonus({
				userBonusId,
				userId,
			})
		);
	};

	const columns = useMemo(
		() => [
			{
				Header: 'ID',
				accessor: 'userBonusId',
				filterable: true,
				Cell: ({ cell }) => <Id value={cell.value} />,
			},
			{
				Header: 'PROMOTION TITLE',
				accessor: 'promotionTitle',
				filterable: true,
				Cell: ({ cell }) => <PromotionTitle value={cell.value} />,
			},
			{
				Header: 'BONUS TYPE',
				accessor: 'bonusType',
				filterable: true,
				Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
			},
			{
				Header: 'VALID TILL',
				accessor: 'expiredAt',
				filterable: true,
				Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
			},
			{
				Header: 'IS EXPIRED',
				accessor: 'isExpired',
				filterable: true,
				Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
			},
			{
				Header: 'STATUS',
				accessor: 'status',
				Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
			},
			{
				Header: 'ISSUED BY',
				accessor: 'issuedBy',
				Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
			},
			{
				Header: 'ISSUED AT',
				accessor: 'issuedAt',
				Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
			},
			{
				Header: 'AMOUNT TO WAGER',
				accessor: 'amountToWager',
				Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
			},
			{
				Header: 'WAGERED AMOUNT',
				accessor: 'wageredAmount',
				Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
			},
			{
				Header: 'CANCELLED BY',
				accessor: 'cancelledBy',
				Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
			},
			{
				Header: 'UPDATED AT',
				accessor: 'updatedAt',
				Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
			},
			{
				Header: 'ACTION',
				disableSortBy: true,
				Cell: ({ cell }) => (
					<BonusActionButtons
						onViewClick={onViewClick}
						onCancelClick={onCancelClick}
						cell={cell}
					/>
				),
			},
		],
		[]
	);

	const {
		toggleAdvance,
		isAdvanceOpen,
		filterFields,
		actionButtons,
		filterValidation,
		isFilterChanged,
	} = useBonusFilter();

	const onChangeRowsPerPage = (value) => {
		setItemsPerPage(value);
	};

	return (
		<Container fluid>
			<Card className="p-2">
				<CardBody>
					<Filters
						validation={filterValidation}
						filterFields={filterFields}
						actionButtons={actionButtons}
						isAdvanceOpen={isAdvanceOpen}
						toggleAdvance={toggleAdvance}
						isFilterChanged={isFilterChanged}
					/>
					<TableContainer
						isLoading={userBonusLoading}
						columns={columns}
						data={formattedUserBonus}
						isPagination
						customPageSize={itemsPerPage}
						tableClass="table-bordered align-middle nowrap mt-2"
						// paginationDiv="col-sm-12 col-md-7"
						paginationDiv="justify-content-center"
						pagination="pagination justify-content-start pagination-rounded"
						totalPageCount={userBonus?.count}
						isManualPagination
						onChangePagination={setCurrentPage}
						currentPage={currentPage}
						changeRowsPerPageCallback={onChangeRowsPerPage}
					/>
				</CardBody>
				<BonusDetails
					show={bonusDetailsModal.open}
					toggle={() => setBonusDetailsModal({ open: false, data: '' })}
					bonusId={bonusDetailsModal.data?.bonusId}
					bonusTitle={bonusDetailsModal.data?.promotionTitle}
					userBonusId={bonusDetailsModal.data?.userBonusId}
				/>
			</Card>
		</Container>
	);
};

export default YourBonuses;
