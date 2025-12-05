/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-expressions */
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button, UncontrolledTooltip } from 'reactstrap';
import { modules } from '../../../constants/permissions';
import { getBonusesStart, reorderBonusStart } from '../../../store/actions';
import { BonusId, BonusType } from '../BonusListCol';

const useBonusReorder = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { bonusDetails, isBonusDetailsLoading } = useSelector(
		(state) => state.AllBonusDetails
	);

	const [bonuses, setBonuses] = useState({ rows: [], count: 0 });
	const [state, setState] = useState({ rows: [], count: 0 });

	const fetchData = () => {
		dispatch(
			getBonusesStart({
				reorder: true,
			})
		);
	};

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		if (state?.rows && bonusDetails?.bonus?.length) {
			const filteredArray = bonusDetails?.bonus?.filter((item) => {
				const exist = state?.rows.find((common) => common.id === item.id);
				if (exist) {
					return false;
				}
				return true;
			});
			setBonuses({ rows: filteredArray, count: filteredArray?.length || 0 });
		} else {
			setBonuses({
				rows: bonusDetails?.bonus,
				count: bonusDetails?.bonus?.length || 0,
			});
		}
	}, [bonusDetails]);

	const handleAddBonus = (item) => {
		setState((oldItem) => {
			const newArray = [...oldItem?.rows, item];
			return { rows: newArray, count: newArray.length };
		});
		setBonuses((oldItem) => {
			const newArray = oldItem?.rows.filter((bonus) => bonus.id !== item.id);
			return { rows: newArray, count: newArray.length };
		});
	};

	const handleRemoveBonus = (item) => {
		setBonuses((oldItem) => {
			const newArray = [...oldItem.rows, item];
			return { rows: newArray, count: newArray.length };
		});
		setState((oldItem) => {
			const newArray = oldItem?.rows.filter((bonus) => bonus.id !== item.id);
			return { rows: newArray, count: newArray.length };
		});
	};

	const handleSave = () => {
		const orderedBonus = [];
		const unOrderedBonus = [];
		state && state.rows.map((list) => orderedBonus.push(list.id));
		bonuses && bonuses.rows.map((list) => unOrderedBonus.push(list.id));

		const data = {
			order: [...orderedBonus, ...unOrderedBonus],
		};
		dispatch(reorderBonusStart({ data, navigate }));
		setState({ rows: [], count: 0 });
		setBonuses({ rows: [], count: 0 });
	};

	const formattedBonus = useMemo(() => {
		const formattedData = [];
		if (bonuses?.rows?.length) {
			return bonuses?.rows?.map((item) => ({
				...item,
				orderId: item.orderId,
				bonusName: `${item.promotionTitle?.EN} ${item.id}`,
			}));
		}
		return formattedData;
	}, [bonuses]);

	const formattedState = useMemo(
		() =>
			state?.rows?.map((item) => ({
				reorderId: item.orderId || '-',
				bonusName: item.promotionTitle?.EN,
				action: (
					<ul className="list-unstyled hstack gap-1 mb-0">
						<li data-bs-toggle="tooltip" data-bs-placement="top">
							<Button
								type="button"
								className="btn btn-sm btn-soft-danger"
								onClick={(e) => {
									e.preventDefault();
									handleRemoveBonus(item);
								}}
							>
								<i className="mdi mdi-minus-box" id={`minus-${item.id}`} />
								<UncontrolledTooltip
									placement="top"
									target={`minus-${item.id}`}
								>
									Remove this Bonus
								</UncontrolledTooltip>
							</Button>
						</li>
					</ul>
				),
			})),
		[state]
	);

	const columns = useMemo(
		() => [
			{
				Header: 'ORDER ID',
				accessor: 'orderId',
				filterable: true,
				Cell: ({ cell }) => <BonusId value={cell.value} />,
			},
			{
				Header: 'BONUS NAME (ID)',
				accessor: 'bonusName',
				filterable: true,
				Cell: ({ cell }) => <BonusType value={cell.value} />,
			},
			{
				Header: 'ACTION',
				accessor: 'action',
				disableSortBy: true,
				disableFilters: true,
				Cell: ({ cell }) => {
					const id = cell?.row?.original?.id;
					return (
						<ul className="list-unstyled hstack gap-1 mb-0">
							<li data-bs-toggle="tooltip" data-bs-placement="top">
								<Button
									type="button"
									className="btn btn-sm btn-soft-success"
									onClick={(e) => {
										e.preventDefault();
										handleAddBonus(cell?.row?.original);
									}}
								>
									<i className="mdi mdi-plus-box" id={`plus-${id}`} />
									<UncontrolledTooltip placement="top" target={`plus-${id}`}>
										Add this Bonus
									</UncontrolledTooltip>
								</Button>
							</li>
						</ul>
					);
				},
			},
		],
		[bonusDetails]
	);

	const buttonList = [
		{
			label: 'Save',
			handleClick: handleSave,
			link: '#!',
			module: modules.bonus,
			operation: 'U',
		},
	];

	return {
		state,
		setState,
		formattedBonus,
		buttonList,
		handleSave,
		formattedState,
		handleAddBonus,
		handleRemoveBonus,
		isBonusDetailsLoading,
		columns,
	};
};

export default useBonusReorder;
