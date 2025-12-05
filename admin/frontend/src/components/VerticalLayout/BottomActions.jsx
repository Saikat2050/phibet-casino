import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ListGroup, ListGroupItem, UncontrolledTooltip } from 'reactstrap';
import { removeLoginToken } from '../../network/storageUtils';
import { showRightSidebarAction } from '../../store/actions';

const BottomAction = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { layoutWidth } = useSelector((state) => state.Layout);
	const { superAdminUser } = useSelector((state) => state.PermissionDetails);
	let name = `${superAdminUser?.firstName || ''} ${
		superAdminUser?.lastName || ''
	}`;
	if (name === ' ') {
		name = superAdminUser?.username;
	}

	const logoutAdmin = () => {
		removeLoginToken();
		navigate('/login');
	};

	const toggleSideBar = () => {
		dispatch(showRightSidebarAction());
	};

	return (
		<ListGroup className="bottom-action">
			<ListGroupItem
				className={`d-flex align-items-center fs-6 p-2 ${
					layoutWidth === 'boxed' ? 'justify-content-center' : ''
				}`}
				onClick={() => {
					navigate('/profile');
				}}
				id={layoutWidth === 'boxed' ? 'account-tooltip' : ''}
			>
				<i className="bx bx-user-circle bx-md me-2 fs-3" />
				{layoutWidth !== 'boxed' ? <span>{name}</span> : ''}
				{layoutWidth === 'boxed' && (
					<UncontrolledTooltip placement="right" target="account-tooltip">
						Account
					</UncontrolledTooltip>
				)}
			</ListGroupItem>

			{/* Settings */}
			<ListGroupItem
				className={`d-flex align-items-center fs-6 p-2 ${
					layoutWidth === 'boxed' ? 'justify-content-center' : ''
				}`}
				onClick={toggleSideBar}
				id={layoutWidth === 'boxed' ? 'settings-tooltip' : ''}
			>
				<i className="bx bx-cog bx-md me-2 fs-3" />
				{layoutWidth !== 'boxed' ? <span>Settings</span> : ''}
				{layoutWidth === 'boxed' && (
					<UncontrolledTooltip placement="right" target="settings-tooltip">
						Settings
					</UncontrolledTooltip>
				)}
			</ListGroupItem>

			{/* Logout */}
			<ListGroupItem
				className={`d-flex align-items-center fs-6 p-2 ${
					layoutWidth === 'boxed' ? 'justify-content-center' : ''
				}`}
				onClick={logoutAdmin}
				id={layoutWidth === 'boxed' ? 'logout-tooltip' : ''}
			>
				<i className="bx bx-log-out bx-md me-2 fs-3" />
				{layoutWidth !== 'boxed' ? <span>Logout</span> : ''}
				{layoutWidth === 'boxed' && (
					<UncontrolledTooltip placement="right" target="logout-tooltip">
						Logout
					</UncontrolledTooltip>
				)}
			</ListGroupItem>
		</ListGroup>
	);
};

export default BottomAction;
