/* eslint-disable react/prop-types */
/* eslint-disable no-unused-expressions */
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button, UncontrolledTooltip } from 'reactstrap';
import { modules } from '../../../constants/permissions';
import {
	getCasinoCategoryDetailStart,
	getCasinoGamesStart,
	reorderCasinoGamesStart,
	resetCasinoState,
} from '../../../store/actions';
import { CasinoGameId, Custom } from '../CasinoGamesListCol';
import { selectedLanguage } from '../../../constants/config';

const useReorderGames = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const {
		casinoCategoryDetails,
		casinoGames = null,
		isCasinoGamesLoading,
	} = useSelector((state) => state.CasinoManagementData);

	const [state, setState] = useState({ rows: [], count: 0 });
	const [games, setGames] = useState({ rows: [], count: 0 });
	const [selectedCategory, setSelectedCategory] = useState('');
	const [page, setPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [search, setSearch] = useState('');

	const fetchData = () => {
		dispatch(getCasinoCategoryDetailStart({}));
	};

	useEffect(() => {
		fetchData();
		return () => {
			dispatch(resetCasinoState());
		};
	}, []);

	useEffect(() => {
		if (selectedCategory) {
			dispatch(
				getCasinoGamesStart({
					perPage: itemsPerPage,
					page,
					casinoCategoryId: selectedCategory,
					searchString: search,
					reorder: 'true',
				})
			);
		}
	}, [selectedCategory, itemsPerPage, page, search]);

	const formattedGames = useMemo(() => {
		let formattedData = [];
		if (casinoGames?.games?.length && selectedCategory) {
			formattedData = casinoGames?.games?.map((item, index) => ({
				...item,
				reorderId: itemsPerPage * (page - 1) + index + 1,
				gameName: `${item?.name[selectedLanguage]} (${item?.id})`,
			}));
		}
		return {
			rows: formattedData,
			count: casinoGames?.count,
		};
	}, [casinoGames]);

	useEffect(() => {
		if (formattedGames && formattedGames?.rows?.length) {
			if (state?.rows) {
				const filteredArray = formattedGames?.rows?.filter(
					(item) => !state?.rows.find((common) => common.id === item.id)
				);
				setGames({ rows: filteredArray, count: formattedGames?.count });
			} else {
				setGames({ rows: formattedGames?.rows, count: formattedGames?.count });
			}
		}
	}, [formattedGames, state]);

	const handleAddGame = (item) => {
		setState((oldItem) => {
			const newArray = [...oldItem.rows, item];
			return { rows: newArray, count: newArray.length };
		});
		setGames((oldItem) => {
			const newArray = oldItem?.rows.filter(
				(gameItem) => gameItem.id !== item.id
			);
			return { rows: newArray, count: newArray.length };
		});
	};

	const handRemoveGame = (item) => {
		setState((oldItem) => {
			const newArray = oldItem?.rows.filter(
				(gameItem) => gameItem.id !== item.id
			);
			return { rows: newArray, count: newArray.length };
		});
	};

	const handleSave = () => {
		const orderedGames = [];
		const unOrderedGames = [];
		state && state.rows.map((list) => orderedGames.push(list.id));
		games && games?.rows?.map((list) => unOrderedGames.push(list.id));

		const data = {
			gameIds: [...orderedGames, ...unOrderedGames],
		};

		dispatch(
			reorderCasinoGamesStart({
				data,
				navigate,
			})
		);

		setState({
			rows: [],
			count: 0,
		});
	};

	const formattedState = useMemo(
		() =>
			state?.rows?.map((item, index) => ({
				reorderId: index + 1,
				gameName: item?.name[selectedLanguage],
				action: (
					<ul className="list-unstyled hstack gap-1 mb-0">
						<li data-bs-toggle="tooltip" data-bs-placement="top">
							<Button
								type="button"
								className="btn btn-sm btn-soft-danger"
								onClick={(e) => {
									e.preventDefault();
									handRemoveGame(item);
								}}
							>
								<i className="mdi mdi-minus-box" id={`minus-${item.id}`} />
								<UncontrolledTooltip
									placement="top"
									target={`minus-${item.id}`}
								>
									Remove this Game
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
				accessor: 'reorderId',
				filterable: true,
				Cell: ({ cell }) => <CasinoGameId value={cell.value} />,
			},
			{
				Header: 'GAME NAME (ID)',
				accessor: 'gameName',
				filterable: true,
				Cell: ({ cell }) => <Custom value={cell.value} />,
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
										handleAddGame(cell?.row?.original);
									}}
								>
									<i className="mdi mdi-plus-box" id={`plus-${id}`} />
									<UncontrolledTooltip placement="top" target={`plus-${id}`}>
										Add this Game
									</UncontrolledTooltip>
								</Button>
							</li>
						</ul>
					);
				},
			},
		],
		[games]
	);

	const onChangeRowsPerPage = (value) => {
		setItemsPerPage(value);
	};

	const buttonList = [
		{
			label: 'Save',
			handleClick: handleSave,
			link: '#!',
			module: modules.casinoManagement,
			operation: 'U',
		},
	];

	return {
		state,
		columns,
		page,
		setPage,
		setState,
		search,
		setSearch,
		games,
		setGames,
		buttonList,
		itemsPerPage,
		totalPageCount: casinoGames?.totalPages,
		handleSave,
		handleAddGame,
		handRemoveGame,
		formattedGames,
		formattedState,
		selectedCategory,
		onChangeRowsPerPage,
		setSelectedCategory,
		isCasinoGamesLoading,
		casinoCategoryDetails,
	};
};

export default useReorderGames;
