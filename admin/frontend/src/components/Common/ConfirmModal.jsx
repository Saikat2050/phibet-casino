/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { createContext, useState, useContext } from 'react';
import YesNoModal from './YesNoModal';

const ConfirmModalContext = createContext();

export const useConfirmModal = () => useContext(ConfirmModalContext);

export const ConfirmModalProvider = ({ children }) => {
	const [confirmModalState, setConfirmModalState] = useState({
		show: false,
		content: '',
		handleYes: null,
		handleClose: () =>
			setConfirmModalState((prev) => ({ ...prev, show: false })),
	});

	const openConfirmModal = (content, handleYes) => {
		setConfirmModalState({
			show: true,
			content,
			handleYes,
			handleClose: () =>
				setConfirmModalState((prev) => ({ ...prev, show: false })),
		});
	};

	return (
		<ConfirmModalContext.Provider value={{ openConfirmModal }}>
			{children}
			<YesNoModal {...confirmModalState} />
		</ConfirmModalContext.Provider>
	);
};
