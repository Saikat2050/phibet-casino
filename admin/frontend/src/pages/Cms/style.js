/* eslint-disable import/prefer-default-export */
import { createGlobalStyle } from 'styled-components';

export const CreateDynamicStyles = (themeTransitionSpeed, mobileQuery) =>
	createGlobalStyle`
    .td {
        transition: background-color ${themeTransitionSpeed || 0}ms;
    }
    .textarea-editor {
      margin-left: 13px !important;
    }
    @media screen and (max-width: ${mobileQuery || 0}px) {
        .codepen-display {
            flex-direction: column;
        }
        .codepen-editors {
            width: 100%;
            margin: 0;
        }
        .codepen-textareas {
            margin-bottom: 10px;
        }
        .codepen-results {
            width: 100%;
            padding: 10px 10px 6px 10px;
            box-sizing: border-box;
        }
        .codepen-display {
            height: fit-content !important;
        }
        .codepen-iframe-container {
            height: fit-content;
            padding: 0;
        }
        .codepen-results-title {
            padding: 10px 0px;
        }
    }
`;
