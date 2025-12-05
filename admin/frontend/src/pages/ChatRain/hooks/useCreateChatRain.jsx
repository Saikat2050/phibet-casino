import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetChatrain } from '../../../store/chatRain/actions';
import { getChannels } from '../../../store/actions';

const useCreateChatRain = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const [activeTab, setActiveTab] = useState('general');
	const [allFields, setAllFields] = useState({});
	const [nextPressed, setNextPressed] = useState({});

	const {
		createChatrainSuccess,
		createChatrainError,
		updateChatrainSuccess,
		updateChatrainError,
	} = useSelector((state) => state.Chatrain);

	const chatRainDetails = location?.state?.chatRainDetails;

	useEffect(() => {
		dispatch(
			getChannels({
				limit: 20,
				pageNo: 1,
			})
		);
	}, []);

	useEffect(() => {
		if (createChatrainSuccess) {
			navigate('/chat/chat-rain');
		}
		if (createChatrainError) {
			setActiveTab('general');
		}
		dispatch(resetChatrain());
	}, [createChatrainSuccess, createChatrainError]);

	useEffect(() => {
		if (updateChatrainSuccess) {
			navigate('/chat/chat-rain');
		}
		if (updateChatrainError) {
			setActiveTab('general');
		}
		dispatch(resetChatrain());
	}, [updateChatrainSuccess, updateChatrainError]);

	return {
		activeTab,
		allFields,
		nextPressed,
		chatRainDetails,
		setAllFields,
		setNextPressed,
		setActiveTab,
	};
};

export default useCreateChatRain;
