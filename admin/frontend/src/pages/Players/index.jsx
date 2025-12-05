/* eslint-disable no-param-reassign */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Container, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { useSelector } from 'react-redux';
import TableContainer from '../../components/Common/Table';
import Breadcrumb from '../../components/Common/Breadcrumb';
import usePlayersListing from './hooks/usePlayersListing';
import { projectName } from '../../constants/config';
import useFilters from './hooks/useFilters';
import BulkUpdatePlayers from './BulkUpdatePlayers';

// userIds and toggleUserId can be used while importing player page on another form like in notify player.
const PlayersList = ({
	userIds = null,
	toggleUserId = null,
	toggleAllUsers = null,
	customContainerClass,
}) => {
	const [userIdsForLocalOperation, setUserIdsForLocalOperation] = useState({});

	const toggleLocalUserId = (userId, isClear) => {
		if (isClear) {
			setUserIdsForLocalOperation({});
		} else if (userIdsForLocalOperation[userId]) {
			setUserIdsForLocalOperation((prev) => {
				delete prev[userId];
				return { ...prev };
			});
		} else {
			setUserIdsForLocalOperation((prev) => ({
				...prev,
				[userId]: true,
			}));
		}
	};

	const toggleLocalAllUsers = (allUserIds) => {
		setUserIdsForLocalOperation((prev) => {
			const newUserIds = { ...prev };
			const areAllSelected = allUserIds.every((userId) => newUserIds[userId]);
			if (areAllSelected) {
				allUserIds.forEach((userId) => {
					delete newUserIds[userId];
				});
			} else {
				allUserIds.forEach((userId) => {
					newUserIds[userId] = true;
				});
			}
			return newUserIds;
		});
	};

	document.title = projectName;
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);

	const { filterValidation, filterComponent, selectedFiltersComponent } =
		useFilters();

	const {
		currentPage,
		setCurrentPage,
		totalPlayerPages,
		isPlayersLoading,
		formattedPlayers,
		itemsPerPage,
		onChangeRowsPerPage,
		columns,
		isOpen,
		setIsOpen,
		selectedPlayers,
		onSuccess,
		actionList,
	} = usePlayersListing(
		filterValidation.values,
		userIds || userIdsForLocalOperation,
		toggleUserId || toggleLocalUserId,
		toggleAllUsers || toggleLocalAllUsers,
		!userIds
	);
	return (
		<div className={userIds ? '' : 'page-content'}>
			<Container fluid>
				{/* Render Breadcrumb */}
				{!userIds && showBreadcrumb ? (
					<Breadcrumb title="Player" breadcrumbItem="Players" />
				) : null}
				<div className={`${customContainerClass}`}>
					<TableContainer
						isLoading={isPlayersLoading}
						columns={columns}
						data={formattedPlayers}
						customPageSize={itemsPerPage}
						totalPageCount={totalPlayerPages}
						isManualPagination
						onChangePagination={setCurrentPage}
						currentPage={currentPage}
						changeRowsPerPageCallback={onChangeRowsPerPage}
						isShowColSettings={!userIds}
						filterComponent={filterComponent}
						selectedFiltersComponent={selectedFiltersComponent}
						actionList={actionList}
					/>
				</div>
			</Container>
			<Modal
				isOpen={isOpen}
				toggle={() => {
					setIsOpen((prev) => !prev);
				}}
				className="col-md-12"
				backdrop="static"
				size="xl"
			>
				<ModalHeader
					toggle={() => {
						setIsOpen((prev) => !prev);
					}}
					tag="h4"
				>
					{`Update info for selected players (${selectedPlayers?.length})`}
				</ModalHeader>
				<ModalBody>
					<BulkUpdatePlayers
						selectedPlayers={selectedPlayers}
						onSuccess={onSuccess}
					/>
				</ModalBody>
			</Modal>
		</div>
	);
};

PlayersList.propTypes = {
	userIds: PropTypes.objectOf({
		key: PropTypes.string,
	}),
	toggleUserId: PropTypes.func,
	toggleAllUsers: PropTypes.func,
	customContainerClass: PropTypes.string,
};

PlayersList.defaultProps = {
	userIds: null,
	toggleUserId: null,
	toggleAllUsers: null,
	customContainerClass: '',
};

export default PlayersList;
