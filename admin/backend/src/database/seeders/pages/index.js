import { getLanguageWiseNameJson } from '@src/helpers/common.helper'
import fs from 'fs'
import path from 'path'

async function getPages () {
  const [cookiePolicy, privacyTitle, bonusTitle, generalTitle, responsibleGamblingTitle] = await Promise.all([
    getLanguageWiseNameJson({ EN: 'Cookie Policy' }),
    getLanguageWiseNameJson({ EN: 'Privacy Policy' }),
    getLanguageWiseNameJson({ EN: 'Bonus Terms' }),
    getLanguageWiseNameJson({ EN: 'General Terms & Conditions' }),
    getLanguageWiseNameJson({ EN: 'Responsible Gaming' })
  ])

  const [cookieContent, privacyContent, bonusContent, generalContent, responsibleGamblingContent] = await Promise.all(
    [getLanguageWiseNameJson({ EN: fs.readFileSync(path.join(__dirname, './cookiePolicy.html')).toString() }),
      getLanguageWiseNameJson({ EN: fs.readFileSync(path.join(__dirname, './privacyPolicy.html')).toString() }),
      getLanguageWiseNameJson({ EN: fs.readFileSync(path.join(__dirname, './bonusTerms.html')).toString() }),
      getLanguageWiseNameJson({ EN: fs.readFileSync(path.join(__dirname, './generalTerms.html')).toString() }),
      getLanguageWiseNameJson({ EN: fs.readFileSync(path.join(__dirname, './responsibleGambling.html')).toString() })
    ])

  const pages = [{
    slug: 'cookie-policy',
    title: JSON.stringify(cookiePolicy),
    content: JSON.stringify(cookieContent)
  }, {
    slug: 'privacy-policy',
    title: JSON.stringify(privacyTitle),
    content: JSON.stringify(privacyContent)
  }, {
    slug: 'bonus-terms',
    title: JSON.stringify(bonusTitle),
    content: JSON.stringify(bonusContent)
  }, {
    slug: 'general-terms',
    title: JSON.stringify(generalTitle),
    content: JSON.stringify(generalContent)
  }, {
    slug: 'responsible-gaming',
    title: JSON.stringify(responsibleGamblingTitle),
    content: JSON.stringify(responsibleGamblingContent)
  }]

  return pages
}

export { getPages }
