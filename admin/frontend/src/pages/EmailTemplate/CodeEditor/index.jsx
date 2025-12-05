import React, { useEffect, useState } from 'react'
import { highlight, languages } from 'prismjs'
import uuid from 'react-uuid'
import Editor from 'react-simple-code-editor'
import { BsArrowCounterclockwise } from 'react-icons/bs'
import { setTheme } from './colors'
import { createGlobalStyle } from 'styled-components'
import './styles.css'
import { FormFeedback, Label } from 'reactstrap';

const CreateDynamicStyles = (themeTransitionSpeed, mobileQuery) =>
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
`

export default function CodepenEditor({
  validation,
  HTML,
  setTemplate,
  dynamicData,
  // CSS,
  // JS,
  initial,
  theme,
  resettable,
  height,
  themeTransitionSpeed,
  mobileQuery,
  setRequiredKeyData,
  setFieldValue,
  details = false,
  test = true,
  label
}) {
  const DynamicStyles = CreateDynamicStyles(themeTransitionSpeed, mobileQuery)

  // determines if the user can reset the editor
  // eslint-disable-next-line no-unneeded-ternary
  const _resettable = resettable !== undefined ? resettable : true

  // save initial state of the editor
  const [_HTML, setHTML] = useState(HTML || '')
  const [_dynamicData, setdynamicData] = useState(dynamicData || '')
  useEffect(() => {
    setTemplate(_HTML)
    validation.setFieldValue(`content`, _HTML);

    setFieldValue && setFieldValue('content', _HTML)
  }, [_HTML])
  useEffect(() => {
    setdynamicData(dynamicData)
  }, [dynamicData])
  // const [_CSS, setCSS] = useState(CSS || '')
  // const [_JS, setJS] = useState(JS || '')

  // if no default language is passed, set html as visible
  const [selected, setSelected] = useState(initial || 'HTML')

  // generate unique id for this iframe
  const iFrameId = uuid()
  const [iFrame, setIFrame] = useState(null)

  useEffect(() => {
    setTheme(theme)
  }, [theme])

  useEffect(() => {
    setHTML(HTML)
    setTemplate(HTML)
    if (document) {
      const frame = document.getElementById('codepen-iframe-' + iFrameId)
        .contentWindow.document

      setIFrame(frame)
      writeInFrame(frame, _HTML, _dynamicData)
    }
    writeInFrame(iFrame, HTML, dynamicData)
  }, [HTML])

  const resetIFrame = () => {
    const resetButton = document.getElementById('codepen-reset-' + iFrameId)

    resetButton.classList.add('codepen-reset-active')
    setTimeout(() => {
      resetButton.classList.remove('codepen-reset-active')
    }, 400)

    setHTML(HTML || '')
    setdynamicData(dynamicData || '')
    // setCSS(CSS || '')
    // setJS(JS || '')

    writeInFrame(iFrame, HTML, dynamicData)

    checkForUndefined(iFrame)
  }

  const insertDynamicDataInTemplate = (HTML, dynamicData) => {
    let returnEmail = HTML

    if (dynamicData) {
      try {
        const data = JSON.parse(dynamicData)
        Object.keys(data).forEach((dynamicKey) => {
          const pattern = new RegExp(`{{{ *${dynamicKey} *}}}`, 'g')
          returnEmail = returnEmail.replaceAll(pattern, data[dynamicKey])
        })
      } catch {
        returnEmail = HTML
      }
    }
    return returnEmail
  }

  const checkForUndefined = () => {
    const frame = document.getElementById('codepen-iframe-' + iFrameId)
      .contentWindow.document

    if (frame.body?.innerHTML?.includes('undefined')) {
      frame.body.innerHTML = ''
    }
  }

  const writeInFrame = async (frame, HTML, dynamicData) => {
    if (frame) {
      frame.open()
      const newHTML = await insertDynamicDataInTemplate(HTML, dynamicData)
      frame.writeln(newHTML)
      frame.close()
    }
  }

  const updateTextArea = (type, val) => {
    let tmpHTML = _HTML
    let tmpDynamacData = _dynamicData
    // let tmpCSS = _CSS
    // let tmpJS = _JS

    if (type === 'HTML') {
      setHTML(val)
      tmpHTML = val
    } else if (type === 'dynamicData') {
      setdynamicData(val)
      setRequiredKeyData(JSON.parse(val))
      tmpDynamacData = val
    }
    //  else if (type === 'CSS') {
    //   setCSS(val)
    //   tmpCSS = val
    // } else if (type === 'JS') {
    //   setJS(val)
    //   tmpJS = val
    // }

    writeInFrame(iFrame, tmpHTML, tmpDynamacData)
  }

  return (
    <div
      className="editor-container editor-container_classic-editor"
      style={{ marginLeft: '20px', marginBottom: '20px' }}
    >
      {label && <Label className="form-label">{label}</Label>}
      {true && label && <span className="text-danger"> *</span>}
      <div className='' style={{ marginRight: '20px' }}>
        <DynamicStyles />
        <div className='codepen-title-flex td'>
          {_resettable && (
            <BsArrowCounterclockwise
              id={'codepen-reset-' + iFrameId}
              title='Reset code'
              onClick={resetIFrame}
              className='codepen-reset'
              size={23}
            />
          )}
        </div>

        <div style={{ height: height || '350px' }} className='codepen-display td'>
          <div className='codepen-editors'>
            <div className='codepen-editor-picker td'>
              <button
                type='button'
                disabled={details}
                className={`td ${selected === 'HTML' ? 'codepen-title-selected ' : ''
                  }`}
                onClick={() => setSelected('HTML')}
              >
                HTML
              </button>
              {test &&
                <button
                  className={`td ${selected === 'dynamicData' ? 'codepen-title-selected ' : ''
                    }`}
                  type='button'
                  disabled={details}
                  onClick={() => setSelected('dynamicData')}
                >
                  DYNAMIC DATA
                </button>}

              {/* <button
              className={`td ${
                selected === 'CSS' ? 'codepen-title-selected ' : ''
              }`}
              onClick={() => setSelected('CSS')}
            >
              CSS
            </button>

            <button
              className={`td ${
                selected === 'JS' ? 'codepen-title-selected ' : ''
              }`}
              onClick={() => setSelected('JS')}
            >
              JS
            </button> */}
            </div>

            <div
              className={`codepen-editor td ${selected === 'HTML' ? '' : 'codepen-editor-inactive'
                }`}
            >
              {selected === 'HTML' && (
                <Editor
                  disabled={details}
                  className='textarea-editor'
                  value={_HTML}
                  onValueChange={(newVal) => updateTextArea('HTML', newVal)}
                  highlight={(code) => highlight(code, languages.html, 'html')}
                />
              )}
            </div>
            <div
              className={`codepen-editor td ${selected === 'dynamicData' ? '' : 'codepen-editor-inactive'
                }`}
            >
              {selected === 'dynamicData' && (
                <Editor
                  disabled={details}
                  value={_dynamicData}
                  onValueChange={(newVal) =>
                    updateTextArea('dynamicData', newVal)}
                  highlight={(code) => highlight(code, languages.js, 'js')}
                />
              )}
            </div>
            {/* </div> */}
          </div>

          <div className='codepen-results td'>
            <div className='codepen-results-title td'>Results</div>
            <div className='codepen-iframe-container td'>
              <iframe
                disabled={details}
                scrolling='yes'
                title='react-codepen-editor'
                marginWidth='0'
                marginHeight='0'
                className='td'
                id={'codepen-iframe-' + iFrameId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>







  )
}
