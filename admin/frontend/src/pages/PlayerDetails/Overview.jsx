/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { isEmpty } from 'lodash';
import {
	Card,
	CardBody,
	Col,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	Row,
	Spinner,
} from 'reactstrap';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import useUserOverview from './hooks/useUserOverview';
// import DisableReason from './modals/DisableReason';
import {
	resetUserProfileUpdateLimit,
	// markUserAsInternal,
	sendPasswordReset,
	updateSAUserStatus,
	verifyUserEmail,
	verifyUserKyc,
	verifyUserPhone,
} from '../../store/actions';
import ManageTagModal from './modals/ManageTagModal';
import Duplicates from './modals/Duplicates';
import GiveBonusModal from './modals/GiveBonus';
import UpdateUserInfo from './modals/UpdateUserInfo';
import ResetUserPassword from './modals/ResetUserPassword';
import { modules } from '../../constants/permissions';
import usePermission from '../../components/Common/Hooks/usePermission';
import { showToastr } from '../../utils/helpers';
import PlayerStats from './components/PlayerStats';
import { PLAYER_STATS_NOT_AVAILABLE } from '../../constants/messages';
import ActionButton from '../../components/Common/ActionButton';
import { useConfirmModal } from '../../components/Common/ConfirmModal';
import ManageMoney from './modals/ManageMoney';

const ColumnContainer = ({ hidden, children }) => (
	<Col xs={12} md={6} className="text-center mb-3" hidden={hidden}>
		{children}
	</Col>
);

const Overview = ({ userDetails, userDetailsLoading, duplicateUsers }) => {
	const { isGranted } = usePermission();
	const dispatch = useDispatch();
	const { openConfirmModal } = useConfirmModal();
	const { playerId } = useParams();
	const [openResetMenu, setOpenResetMenu] = useState(false);
	const [modalStates, setModalStates] = useState({
		// internalModal: false,
		manageTagModal: false,
		duplicatesModal: false,
		giveBonusModal: false,
		editUserModal: false,
		resetUserPassword: false,
		manageMoneyModal: false,
	});
	const openModal = (modalName) => {
		setModalStates((prev) => ({ ...prev, [modalName]: true }));
	};

	const closeModal = (modalName) => {
		setModalStates((prev) => ({ ...prev, [modalName]: false }));
	};

	const { basicInfo, contactInfo, kycInfo, userStatsData, otherInfo } =
		useUserOverview({
			user: userDetails,
		});

	const updateUserStatus = () => {
		dispatch(
			updateSAUserStatus({
				userIds: [playerId],
				isActive: !userDetails?.isActive,
			})
		);
	};

	// const handleInternalChange = () => {
	// 	dispatch(
	// 		markUserAsInternal({
	// 			userId: playerId,
	// 		})
	// 	);
	// };

	const handleVerifyEmail = () => {
		dispatch(
			verifyUserEmail({
				userId: playerId,
			})
		);
	};

	const handleVerifyPhone = () => {
		dispatch(
			verifyUserPhone({
				userId: playerId,
			})
		);
	};

	const handleSendResetPasswordEmail = () => {
		dispatch(
			sendPasswordReset({
				userId: parseInt(playerId, 10),
			})
		);
	};

	const handleVerifyKYC = () => {
		dispatch(verifyUserKyc({ userId: playerId }));
	};

	const handleresetProfileDataUpdateCount = () => {
		dispatch(resetUserProfileUpdateLimit({ userId: playerId }));
	};

	const toggleUserStatus = () => {
		openConfirmModal(
			`Are you sure you want to mark ${userDetails?.firstName} ${
				userDetails?.lastName
			} (${userDetails?.email}) ${
				userDetails?.isActive ? 'Inactive' : 'Active'
			}?`,
			updateUserStatus
		);
	};

	const toggleEmailVerification = () => {
		openConfirmModal(
			`Do you really want to mark ${userDetails?.firstName} ${userDetails?.lastName} (${userDetails?.email}) as Verified?`,
			handleVerifyEmail
		);
	};

	const togglePhoneVerification = () => {
		openConfirmModal(
			`Do you really want to mark ${userDetails?.firstName} ${userDetails?.lastName} (${userDetails?.phone}) as Verified?`,
			handleVerifyPhone
		);
	};

	const confirmResetPasswordEmail = () => {
		openConfirmModal(
			`Send Password Reset Email to ${userDetails?.firstName} ${userDetails?.lastName} (${userDetails?.email})`,
			handleSendResetPasswordEmail
		);
	};

	const toggleKycVerification = () => {
		openConfirmModal(
			`Do you really want to mark ${userDetails?.firstName} ${userDetails?.lastName} KYC as Verified?`,
			handleVerifyKYC
		);
	};

	const resetProfileDataUpdateCount = () => {
		openConfirmModal(
			`Do you really want to reset profile update count of ${userDetails?.username}?`,
			handleresetProfileDataUpdateCount
		);
	};

	return (
		<div>
			{userDetailsLoading ? (
				<Spinner
					color="primary"
					className="position-absolute top-50 start-50"
				/>
			) : (
				<>
					{!isEmpty(userStatsData) ? (
						<Row className="d-flex m-0 p-0">
							<PlayerStats
								dataColors='["--bs-success","--bs-primary", "--bs-danger","--bs-info", "--bs-warning"]'
								data={userStatsData}
							/>
						</Row>
					) : (
						<Col xl="12">
							<Card>
								<CardBody className="d-flex justify-content-center">
									<h6>{PLAYER_STATS_NOT_AVAILABLE}</h6>
								</CardBody>
							</Card>
						</Col>
					)}
					<Row>
						<Col xs={12} lg={4} className="col-padding">
							<Card className="card-overview">
								<h4 className="h4-overview text-center mt-3">
									Basic Info <hr className="h4-hr" />
								</h4>
								<div className="div-overview">
									{basicInfo?.map(({ label, value, subValue }) =>
										userDetails?.kycMethod !== 1 && label === 'Applicant Id'
											? ''
											: (label === 'Reason' && value
													? true
													: label !== 'Reason') && (
													<div
														key={label}
														className="d-flex align-items-center justify-content-between rounded bg-light bg-opacity-50 mb-2 px-3 py-2 mx-2"
													>
														<h6 className="px-2">{label}</h6>
														<span
															style={{ wordBreak: 'break-word' }}
															className={`${subValue} px-2 w-75 text-end`}
														>
															{value || 'NA'}
														</span>
													</div>
											  )
									)}
								</div>
							</Card>
						</Col>
						<Col xs={12} lg={4} className="col-padding">
							<Card className="p-2">
								<h4 className="h4-overview text-center mt-3">
									Account Actions <hr className="h4-hr" />
								</h4>
								<div className="div-overview">
									<Row>
										{isGranted(modules.player, 'TS') && (
											<ColumnContainer>
												<ActionButton
													className="actionButton w-100"
													variant={
														userDetails?.isActive
															? 'outline-danger'
															: 'outline-success'
													}
													onClick={toggleUserStatus}
													iconClass="bx bxs-edit"
												>
													{userDetails && userDetails?.isActive
														? 'Inactive'
														: 'Active'}
												</ActionButton>
											</ColumnContainer>
										)}
										{/* {(isGranted(modules.player, 'U') ||
										userDetails?.tags?.includes('Internal')) && (
										<ColumnContainer
											hidden={userDetails?.tags?.includes('Internal')}
										>
											<ActionButton
												className="actionButton w-100"
												variant="outline-warning"
												onClick={() => openModal('internalModal')}
											>
												Internal
											</ActionButton>
										</ColumnContainer>
									)} */}
										{isGranted(modules.player, 'VE') &&
											userDetails?.emailVerified !== true && (
												<ColumnContainer>
													<ActionButton
														className="actionButton w-100"
														variant="outline-success"
														iconClass="bx bxs-envelope fs-4"
														onClick={() => {
															if (userDetails?.emailVerified) {
																showToastr({
																	message: 'Email already verified',
																	type: 'info',
																});
															} else {
																toggleEmailVerification();
															}
														}}
													>
														{userDetails?.emailVerified
															? 'Email verified'
															: 'Verify email'}
													</ActionButton>
												</ColumnContainer>
											)}
										{isGranted(modules.player, 'VP') &&
											userDetails?.phoneVerified !== true && (
												<ColumnContainer>
													<ActionButton
														className="actionButton w-100"
														variant="outline-success"
														iconClass="bx bxs-phone fs-4"
														onClick={() => {
															if (userDetails?.phoneVerified) {
																showToastr({
																	message: 'Phone already verified',
																	type: 'info',
																});
															} else if (!userDetails?.phone) {
																showToastr({
																	message: 'Phone number not exist',
																	type: 'info',
																});
															} else {
																togglePhoneVerification();
															}
														}}
													>
														{userDetails?.phoneVerified
															? 'Phone verified'
															: 'Verify phone'}
													</ActionButton>
												</ColumnContainer>
											)}
										{isGranted(modules.player, 'VP') && (
											<ColumnContainer>
												<ActionButton
													variant="outline-warning"
													onClick={() => openModal('manageTagModal')}
													className="actionButton w-100"
													iconClass="bx bxs-purchase-tag-alt fs-4"
												>
													Manage Segment
												</ActionButton>
											</ColumnContainer>
										)}
										{/* {isGranted(modules.bonus, 'Issue') && (
										<ColumnContainer>
											<ActionButton
												className="actionButton w-100"
												variant="outline-secondary"
												onClick={() => openModal('giveBonusModal')}
											>
												Give Bonus
											</ActionButton>
										</ColumnContainer>
									)} */}
										{isGranted(modules.player, 'MM') && (
											<ColumnContainer>
												<ActionButton
													className="actionButton w-100"
													variant="outline-success"
													onClick={() => openModal('manageMoneyModal')}
													iconClass="bx bx-money fs-4"
												>
													Manage Money
												</ActionButton>
											</ColumnContainer>
										)}
										{isGranted(modules.player, 'VK') &&
											userDetails?.kycStatus !== 'COMPLETED' && (
												<ColumnContainer>
													<ActionButton
														className="actionButton w-100"
														variant="outline-success"
														iconClass="bx bxs-file-doc fs-4"
														onClick={() => {
															toggleKycVerification();
														}}
													>
														Verify KYC
													</ActionButton>
												</ColumnContainer>
											)}
										{isGranted(modules.player, 'VP') && (
											<ColumnContainer hidden>
												{userDetails?.trackingToken &&
													userDetails?.isAffiliateUpdated === false && (
														<ActionButton
															className="actionButton w-100"
															variant="outline-success"
															// onClick={() => setShowAddAffiliate(prev => true)}
														>
															Add Affiliate
															{/* {addUserAffiliateLoading && ( */}
															<Spinner
																as="span"
																animation="border"
																role="status"
																aria-hidden="true"
															/>
															{/* )} */}
														</ActionButton>
													)}
											</ColumnContainer>
										)}
										{isGranted(modules.player, 'VP') && (
											<ColumnContainer hidden>
												{userDetails?.trackingToken &&
													userDetails?.isAffiliateUpdated &&
													userDetails?.affiliateStatus && (
														<ActionButton
															className="actionButton w-100"
															variant="outline-danger"
															// onClick={() => setShowRemoveAffiliate(true)}
														>
															Remove Affiliate
															{/* {updateUserAffiliateLoading && ( */}
															<Spinner
																as="span"
																animation="border"
																role="status"
																aria-hidden="true"
															/>
															{/* )} */}
														</ActionButton>
													)}
											</ColumnContainer>
										)}
										{isGranted(modules.player, 'U') && (
											<ColumnContainer>
												<ActionButton
													className="actionButton w-100"
													variant="outline-warning"
													onClick={() => openModal('editUserModal')}
													iconClass="bx bxs-user-detail fs-4"
												>
													Edit User Info
												</ActionButton>
											</ColumnContainer>
										)}
										{isGranted(modules.player, 'U') && (
											<ColumnContainer>
												<Dropdown
													isOpen={openResetMenu}
													toggle={() => setOpenResetMenu((prev) => !prev)}
												>
													<ActionButton
														className="actionButton w-100"
														variant="outline-warning"
														onClick={() => setOpenResetMenu((prev) => !prev)}
														iconClass="bx bxs-lock-open-alt fs-4"
													>
														Reset Password
													</ActionButton>
													<DropdownMenu className="dropdown-menu-end">
														<DropdownItem onClick={confirmResetPasswordEmail}>
															Send Email
														</DropdownItem>
														<DropdownItem
															onClick={() => openModal('resetUserPassword')}
														>
															Reset Password
														</DropdownItem>
													</DropdownMenu>
												</Dropdown>
											</ColumnContainer>
										)}
										<ColumnContainer>
											<ActionButton
												variant="outline-secondary"
												onClick={() => openModal('duplicatesModal')}
												className="actionButton w-100"
												iconClass="bx bx-user-pin fs-4"
											>
												Fraud Detection ({duplicateUsers?.players?.length || 0})
											</ActionButton>
										</ColumnContainer>
										{isGranted(modules.player, 'U') && (
											<ColumnContainer>
												<ActionButton
													variant="outline-warning"
													className="actionButton w-100"
													iconClass="bx  bx-reset fs-4"
													disabled={
														!(userDetails?.moreDetails?.idComplyCount >= 3)
													}
													onClick={() => {
														resetProfileDataUpdateCount();
													}}
												>
													Reset Profile Data Update
												</ActionButton>
											</ColumnContainer>
										)}
									</Row>
								</div>
							</Card>
						</Col>
						<Col xs={12} lg={4} className="col-padding">
							<Card className="card-overview">
								<h4 className="h4-overview text-center mt-3">
									Other Info <hr className="h4-hr" />
								</h4>
								<div className="div-overview">
									<h5 className="px-2 mx-3">
										Contact <hr className="h5-hr m-0 mt-2" />
									</h5>
									{contactInfo?.map(({ label, value, subValue }) => (
										<div
											key={label}
											className="d-flex align-items-center justify-content-between rounded bg-light bg-opacity-50 mb-2 px-3 py-2 mx-2"
											style={{ wordBreak: 'break-word' }}
										>
											<h6 className="px-2 overview-leftlabel">{label}</h6>
											<span className={`${subValue} px-2`}>
												{value || 'NA'}
											</span>
										</div>
									))}

									<h5 className="px-2 mx-3 mt-2">
										KYC <hr className="h5-hr m-0 mt-2" />
									</h5>
									{kycInfo?.map(({ label, value, subValue }) => (
										<div
											key={label}
											className="d-flex align-items-center justify-content-between rounded bg-light bg-opacity-50 mb-2 px-3 py-2 mx-2"
											style={{ wordBreak: 'break-word' }}
										>
											<h6 className="px-2 overview-leftlabel">{label}</h6>
											<span className={`${subValue} px-2`}>
												{value || 'NA'}
											</span>
										</div>
									))}
									<h5 className="px-2 mx-3 mt-2">
										Other <hr className="h5-hr m-0 mt-2" />
									</h5>
									{otherInfo?.map(({ label, value, subValue }) => (
										<div
											key={label}
											className="d-flex align-items-center justify-content-between rounded bg-light bg-opacity-50 mb-2 px-3 py-2 mx-2"
											style={{ wordBreak: 'break-word' }}
										>
											<h6 className="px-2 overview-leftlabel">{label}</h6>
											<span className={`${subValue} px-2`}>
												{value || 'NA'}
											</span>
										</div>
									))}
									{userDetails?.affiliateId && userDetails?.affiliateCode && (
										<>
											<h5 className="px-2 mx-3">
												Affiliate Details <hr className="h5-hr m-0 mt-2" />
											</h5>
											<div
												className="d-flex align-items-center justify-content-between rounded bg-light bg-opacity-50 mb-2 px-3 py-2 mx-2"
												style={{ wordBreak: 'break-word' }}
											>
												<h6 className="px-2 overview-leftlabel">
													Affiliate ID
												</h6>
												<span className={`${'subValue'} px-2`}>
													{userDetails?.affiliateId || 'NA'}
												</span>
											</div>
											<div
												className="d-flex align-items-center justify-content-between rounded bg-light bg-opacity-50 mb-2 px-3 py-2 mx-2"
												style={{ wordBreak: 'break-word' }}
											>
												<h6 className="px-2 overview-leftlabel">Click ID</h6>
												<span className={`${'subValue'} px-2`}>
													{userDetails?.affiliateCode || 'NA'}
												</span>
											</div>
										</>
									)}
								</div>
							</Card>
						</Col>
						{/* <YesNoModal
							show={modalStates.internalModal}
							handleClose={() => closeModal('internalModal')}
							handleYes={handleInternalChange}
							content={`Do you really want to mark ${userDetails?.firstName} ${userDetails?.lastName} as Internal?`}
						/> */}
						<ManageTagModal
							show={modalStates.manageTagModal}
							userDetails={userDetails}
							handleClose={() => closeModal('manageTagModal')}
						/>
						<Duplicates
							show={modalStates.duplicatesModal}
							toggle={() => closeModal('duplicatesModal')}
							header="Fraud Detection"
						/>
						<GiveBonusModal
							show={modalStates.giveBonusModal}
							toggle={() => closeModal('giveBonusModal')}
							header={`Give Bonus To ${userDetails?.firstName} ${userDetails?.lastName}`}
						/>
						<ManageMoney // header set from manage money modal to use the component on listing page.
							show={modalStates.manageMoneyModal}
							toggle={() => closeModal('manageMoneyModal')}
							header={`Manage Money For '${
								userDetails?.firstName && userDetails?.lastName
									? `${userDetails?.firstName || ''} ${
											userDetails?.lastName || ''
									  }`
									: userDetails?.username
							}'`}
						/>
						<UpdateUserInfo
							show={modalStates.editUserModal}
							toggle={() => closeModal('editUserModal')}
							header={`Update ${userDetails?.firstName} ${userDetails?.lastName} (${userDetails?.email}) Info`}
						/>
						<ResetUserPassword
							show={modalStates.resetUserPassword}
							toggle={() => closeModal('resetUserPassword')}
							headerText={`Reset Password for ${userDetails?.firstName} ${userDetails?.lastName} (${userDetails?.email})`}
						/>
					</Row>
				</>
			)}
		</div>
	);
};

export default Overview;
