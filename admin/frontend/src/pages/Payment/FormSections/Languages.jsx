/* eslint-disable react/prop-types */
import React, { useEffect, useMemo } from 'react';
import { Col, Row } from 'reactstrap';
import TabsPage from '../../../components/Common/TabsPage';
import { CustomInputField } from '../../../helpers/customForms';
import Actions from './Actions';

const SingleLangComponent = ({
	lang,
	setLangContent,
	langContent,
	// paymentDetails,
}) => (
	<>
		<Col className="mb-3" sm={6}>
			<CustomInputField
				placeholder="Enter Title"
				label="Title"
				max="50"
				value={langContent?.name?.[lang]}
				onChange={(e) =>
					setLangContent((prev) => ({
						...prev,
						name: { ...prev.name, [lang]: e.target.value },
					}))
				}
			/>
		</Col>

		<Col className="mb-3">
			<CustomInputField
				placeholder="Enter Purchase Description"
				value={langContent?.depositDescription?.[lang]}
				label="Purchase Description"
				type="textarea"
				max="300"
				onChange={(e) =>
					setLangContent((prev) => ({
						...prev,
						depositDescription: {
							...prev.depositDescription,
							[lang]: e.target.value,
						},
					}))
				}
			/>
		</Col>

		<Col className="mb-3">
			<CustomInputField
				placeholder="Enter Withdraw Description"
				value={langContent?.withdrawDescription?.[lang]}
				label="Withdraw Description"
				type="textarea"
				max="300"
				onChange={(e) =>
					setLangContent((prev) => ({
						...prev,
						withdrawDescription: {
							...prev.withdrawDescription,
							[lang]: e.target.value,
						},
					}))
				}
			/>
		</Col>
	</>
);

const Languages = ({
	activeLangTab,
	setActiveLangTab,
	langList,
	langContent,
	setLangContent,
	disableTabSwitching,
	activeTab,
	submitButtonLoading,
	toggleTab,
	tabsToShow,
	paymentDetails,
}) => {
	const toggle = (id) => setActiveLangTab(id);

	// const checkAllEmptyCondition = () =>
	// 	(langContent?.name?.[activeLangTab] === '' ||
	// 		langContent?.name?.[activeLangTab] === undefined) &&
	// 	(langContent?.description?.[activeLangTab] === '' ||
	// 		langContent?.description?.[activeLangTab] === undefined);

	// const checkAllFilled = () =>
	// 	langContent?.name?.[activeLangTab] &&
	// 	langContent?.description?.[activeLangTab];

	const tabData = useMemo(() => {
		const langArray = langList.filter((lang) => lang.code !== 'EN') || [];

		return langArray.map(({ id, name, code }) => ({
			id,
			title: code,
			component: (
				<SingleLangComponent
					lang={code}
					setLangContent={setLangContent}
					langContent={langContent}
					paymentDetails={paymentDetails}
				/>
			),
			tooltipText: name,
		}));
	}, [langList, langContent]);

	const handleNextClick = (nextTab) => {
		toggleTab(nextTab);
	};

	useEffect(() => {
		if (activeTab === 'languages') {
			setActiveLangTab(tabData[0]?.id);
		}
	}, [activeTab]);

	return (
		<Row>
			<Row className="text-info">
				<strong>
					All fields are required or cleared before switching to another
					language or moving Previous or Next/Submit.
				</strong>
			</Row>
			<Col lg="12">
				<TabsPage
					activeTab={activeLangTab}
					tabsData={tabData}
					toggle={toggle}
					disableTabSwitching={disableTabSwitching}
					customComponent={
						<Actions
							handleNextClick={handleNextClick}
							submitButtonLoading={submitButtonLoading}
							activeTab={activeTab}
							toggleTab={toggleTab}
							tabsToShow={tabsToShow}
						/>
					}
				/>
			</Col>
		</Row>
	);
};

export default Languages;
