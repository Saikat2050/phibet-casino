/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-script-url */
/* eslint-disable react/jsx-no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
	Button,
	Card,
	Col,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Row,
	UncontrolledDropdown,
	UncontrolledTooltip,
} from 'reactstrap';
import { map } from 'lodash';
import SimpleBar from 'simplebar-react';
import moment from 'moment';
import EmojiPicker from 'emoji-picker-react';
import { showToastr } from '../../../utils/helpers';
import { DISPUTE_STATUS } from '../constants';
import Spinners from '../../../components/Common/Spinner';

const DisputeDetails = ({
	disputeDetails,
	updateStatus,
	detailsLoading,
	handleSendMessage,
	sendMessageLoading,
	sendMessageSuccess,
}) => {
	const [info, setLocalInfo] = useState({
		emoji: false,
		emojiArray: [],
		attachment: [],
		message: '',
		statusDropDown: false,
		username: '',
	});
	const scrollRef = useRef();
	const setInfo = (key, value) => {
		setLocalInfo((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const handleImageChange = (event) => {
		event.preventDefault();
		const file = event.target.files[0];
		if (file && file.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setInfo('attachment', [reader.result, file]); // For showing and sending on BE
			};
			reader.readAsDataURL(file);
		}
	};

	const copyMsg = (ele) => {
		const copyText = ele
			.closest('.conversation-list')
			.querySelector('p').innerHTML;

		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard
				.writeText(copyText)
				.then(() => {
					showToastr({
						message: 'Copied!',
						type: 'success',
					});
				})
				.catch((err) => {
					console.error('Failed to copy: ', err);
				});
		} else {
			// Fallback for non-secure contexts or unsupported browsers
			const textarea = document.createElement('textarea');
			textarea.value = copyText;
			document.body.appendChild(textarea);
			textarea.select();
			try {
				document.execCommand('copy');
				showToastr({
					message: 'Copied!',
					type: 'success',
				});
			} catch (err) {
				console.error('Fallback copy failed: ', err);
			} finally {
				document.body.removeChild(textarea);
			}
		}
	};

	const onEmojiClick = (event, emojiObject) => {
		setInfo('emojiArray', [...info.emojiArray, emojiObject.emoji]);
		setInfo('message', info.message + event.emoji);
	};

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollIntoView({ behavior: 'smooth' });
		}

		for (let i = 0; i < disputeDetails?.threadMessages?.length; i += 1) {
			if (disputeDetails?.threadMessages?.[i]?.user?.username) {
				setInfo(
					'username',
					disputeDetails?.threadMessages?.[i]?.user?.username
				);
				break;
			}
		}
	}, [disputeDetails?.threadMessages]);

	useEffect(() => {
		if (sendMessageSuccess) {
			setLocalInfo((prev) => ({
				...prev,
				emoji: false,
				emojiArray: [],
				attachment: '',
				message: '',
				statusDropDown: false,
			}));
		}
	}, [sendMessageSuccess]);

	return (
		<div className="w-100 user-chat">
			<Card>
				<div className="p-4 border-bottom ">
					<Row>
						<Col md="9" xs="9">
							<h5 className="font-size-15 mb-1">{info.username}</h5>
							<p className="text-muted mb-0">
								<i className="mdi mdi-circle text-success align-middle me-1" />{' '}
								Active now
							</p>
							<p className="font-size-15 mt-3 pb-0 mb-0">
								Subject: {disputeDetails?.subject}
							</p>
						</Col>
						<Col md="3" xs="3">
							<ul className="list-inline user-chat-nav text-end mb-0">
								<li className="list-inline-item">
									<Dropdown
										isOpen={info.statusDropDown}
										toggle={() =>
											setLocalInfo((prev) => ({
												...prev,
												statusDropDown: !prev.statusDropDown,
											}))
										}
									>
										<DropdownToggle className="btn nav-btn" tag="a">
											<i className="bx bx-dots-horizontal-rounded" />
										</DropdownToggle>
										<DropdownMenu className="dropdown-menu-end">
											{DISPUTE_STATUS?.map(({ label, value }) => (
												<DropdownItem
													onClick={() => {
														updateStatus({
															threadId: disputeDetails?.id,
															status: value,
														});
														setInfo('statusDropDown', false);
													}}
												>
													{label}{' '}
													{disputeDetails?.status === value ? (
														<i className="mdi mdi-check font-size-16 text-success me-1" />
													) : (
														''
													)}
												</DropdownItem>
											))}
										</DropdownMenu>
									</Dropdown>
								</li>
							</ul>
						</Col>
					</Row>
				</div>

				<div>
					<div className="chat-conversation p-3">
						<SimpleBar style={{ height: '486px' }}>
							{detailsLoading ? (
								<Spinners />
							) : (
								<ul className="list-unstyled mb-0">
									{map(
										disputeDetails?.threadMessages,
										(
											{
												id,
												content,
												threadAttachements,
												user,
												adminId,
												createdAt,
											},
											idx
										) => (
											<li
												key={id}
												className={adminId ? 'right' : ''}
												ref={
													(disputeDetails?.threadMessages?.length || 0) - 1 ===
													idx
														? scrollRef
														: null
												}
											>
												<div className="conversation-list">
													<UncontrolledDropdown>
														<DropdownToggle
															href="#!"
															tag="a"
															className="dropdown-toggle"
														>
															<i className="bx bx-dots-vertical-rounded" />
														</DropdownToggle>
														<DropdownMenu>
															<DropdownItem
																onClick={(e) => copyMsg(e.target)}
																href="#"
															>
																Copy
															</DropdownItem>
														</DropdownMenu>
													</UncontrolledDropdown>
													<div className="ctext-wrap">
														<div className="conversation-name d-flex">
															{adminId
																? 'You'
																: user?.username || info.username}
														</div>
														<p className="mb-0" id="">
															{content}
														</p>
														{threadAttachements?.length
															? threadAttachements.map(({ filePath }) => (
																	<img src={filePath} alt="" width="150px" />
															  ))
															: null}
														<div className="d-flex justify-content-end mt-2">
															{createdAt && (
																<p className="chat-time mb-0">
																	<i className="bx bx-time-five align-middle me-1" />
																	{moment(createdAt).format('lll')}
																</p>
															)}
														</div>
													</div>
												</div>
											</li>
										)
									)}
								</ul>
							)}
						</SimpleBar>
					</div>
					{info.attachment?.[0] && (
						<div className="replymessage-block mb-0 d-flex align-items-start">
							<div className="flex-grow-1">
								<img
									src={info.attachment?.[0]}
									alt="select img"
									style={{ width: '150px', height: 'auto' }}
								/>
							</div>
							<div className="flex-shrink-0">
								<button
									type="button"
									id="close_toggle"
									className="btn btn-sm btn-link mt-n2 me-n3 fs-3"
									onClick={() => setInfo('attachment', [])}
								>
									<i className="bx bx-x align-middle" />
								</button>
							</div>
						</div>
					)}

					{info.emoji && (
						<EmojiPicker onEmojiClick={onEmojiClick} width={250} height={382} />
					)}
					<div className="p-3 chat-input-section">
						<form>
							<Row>
								<Col>
									<div className="position-relative">
										<input
											type="text"
											value={info.message}
											// onKeyPress={onKeyPress}
											onChange={(e) => setInfo('message', e.target.value)}
											className="form-control chat-input"
											placeholder="Enter Message..."
										/>
										<div className="chat-input-links">
											<ul className="list-inline mb-0">
												{/* <li className="list-inline-item" onClick={() => setInfo('emoji', !info.emoji)}>
												<Link to="javascript:void(0)">
													<i className="mdi mdi-emoticon-happy-outline me-1 fs-4" id="Emojitooltip" />
													<UncontrolledTooltip
														placement="top"
														target="Emojitooltip"
													>
														Emojis
													</UncontrolledTooltip>
												</Link>
											</li> */}
												<li className="list-inline-item">
													<label
														htmlFor="imageInput"
														style={{ color: '#c48e48', fontSize: 16 }}
													>
														<i
															className="mdi mdi-file-image-outline me-1 fs-3 position-relative"
															id="Imagetooltip"
															style={{ top: '2px' }}
														/>
														<UncontrolledTooltip
															placement="top"
															target="Imagetooltip"
														>
															Images
														</UncontrolledTooltip>
													</label>
													<input
														type="file"
														id="imageInput"
														className="d-none"
														onChange={handleImageChange}
													/>
												</li>
											</ul>
										</div>
									</div>
								</Col>
								<Col className="col-auto">
									<Button
										type="submit"
										color="primary"
										disabled={sendMessageLoading || info.message.length === 0}
										onClick={(e) => handleSendMessage(info, e)}
										className="btn btn-primary btn-rounded chat-send w-md "
									>
										<span className="d-none d-sm-inline-block me-2">
											{sendMessageLoading && (
												<i className="bx bx-hourglass bx-spin font-size-16 align-middle me-2" />
											)}
											Send
										</span>{' '}
										<i className="mdi mdi-send" />
									</Button>
								</Col>
							</Row>
						</form>
					</div>
				</div>
			</Card>
		</div>
	);
};

export default DisputeDetails;

DisputeDetails.propTypes = {
	disputeDetails: PropTypes.objectOf({
		disputeMessages: PropTypes.objectOf({
			id: PropTypes.string,
		}),
	}),
	detailsLoading: PropTypes.bool,
	updateStatus: PropTypes.func.isRequired,
	sendMessageLoading: PropTypes.bool.isRequired,
	handleSendMessage: PropTypes.func.isRequired,
	sendMessageSuccess: PropTypes.bool.isRequired,
};

DisputeDetails.defaultProps = {
	disputeDetails: null,
	detailsLoading: false,
};
