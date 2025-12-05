/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { highlight, languages } from 'prismjs';
import { Button } from 'reactstrap';
import uuid from 'react-uuid';
import Editor from 'react-simple-code-editor';
import { CreateDynamicStyles } from '../../pages/Cms/style';
import '../../assets/scss/custom/pages/_cms.scss';

const CodeEditor = ({
	HTML,
	setTemplate,
	initial,
	resettable,
	height,
	themeTransitionSpeed,
	mobileQuery,
	details = false,
	disabled,
	setContent,
	selectedTab,
}) => {
	const DynamicStyles = CreateDynamicStyles(themeTransitionSpeed, mobileQuery);
	const _resettable = resettable !== undefined ? resettable : true;
	const [_HTML, setHTML] = useState(HTML || '');

	useEffect(() => {
		setTemplate(_HTML);
	}, [_HTML]);

	const [selected, setSelected] = useState(initial || 'HTML');
	const iFrameId = uuid();
	const [iFrame, setIFrame] = useState(null);

	useEffect(() => {
		if (document) {
			const frame = document.getElementById(`codepen-iframe-${iFrameId}`)
				.contentWindow.document;

			setIFrame(frame);
			writeInFrame(frame, _HTML);
		}
		writeInFrame(iFrame, HTML);
	}, [HTML]);

	const resetIFrame = () => {
		const resetButton = document.getElementById(`codepen-reset-${iFrameId}`);

		resetButton.classList.add('codepen-reset-active');
		setTimeout(() => {
			resetButton.classList.remove('codepen-reset-active');
		}, 400);

		setHTML('');
		setContent((prev) => ({
			...prev,
			[selectedTab]: '',
		}));
		writeInFrame(iFrame, '');
	};

	const writeInFrame = async (frame, HTML) => {
		if (frame) {
			frame.open();
			frame.writeln(HTML);
			frame.close();
		}
	};

	const updateTextArea = (val) => {
		setHTML(val);
	};

	return (
		<div className="codepen">
			<DynamicStyles />
			<div className="codepen-title-flex td">
				{_resettable && (
					<Button
						type="button"
						to="#"
						className="btn btn-sm btn-soft-primary .btn-rounded"
						onClick={resetIFrame}
					>
						<i className="mdi mdi-reload" id={`codepen-reset-${iFrameId}`} />
					</Button>
				)}
			</div>

			<div style={{ height: height || '350px' }} className="codepen-display td">
				<div className="codepen-editors">
					<div className="codepen-editor-picker td">
						<Button
							type="button"
							disabled={details}
							className={`td ${
								selected === 'HTML' ? 'codepen-title-selected ' : ''
							}`}
							onClick={() => setSelected('HTML')}
						>
							HTML
						</Button>
					</div>

					<div
						className={`codepen-editor td ${
							selected === 'HTML' ? '' : 'codepen-editor-inactive'
						}`}
					>
						{selected === 'HTML' && (
							<Editor
								disabled={details || disabled}
								className="textarea-editor"
								value={HTML}
								onValueChange={(newVal) => updateTextArea(newVal)}
								highlight={(code) => highlight(code, languages.html, 'html')}
							/>
						)}
					</div>
				</div>

				<div className="codepen-results td">
					<div className="codepen-results-title td">Results</div>
					<div className="codepen-iframe-container td">
						<iframe
							disabled={details}
							scrolling="yes"
							title="react-codepen-editor"
							marginWidth="0"
							marginHeight="0"
							className="td"
							id={`codepen-iframe-${iFrameId}`}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CodeEditor;
