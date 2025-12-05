import db from '../db/models'
import { getOne } from '../utils/crud'
import { EMAIL_TEMPLATE_PRIMARY_STATUS } from '../utils/constants/constant'
import getSymbolFromCurrency from 'currency-symbol-map'

export const getDynamicData = async ({ userId, currentDataList, transaction, link }) => {
  const origin = (await getOne({ model: db.GlobalSetting, data: { key: 'ORIGIN' } })).value
  const siteName = (await getOne({ model: db.GlobalSetting, data: { key: 'SITE_NAME' } })).value
  const logoUrl = (await getOne({ model: db.GlobalSetting, data: { key: 'LOGO_URL' } })).value

  const userDetails = await getOne({
    model: db.User,
    data: { userId },
    include: [
      { model: db.Wallet, as: 'userWallet' }
    ],
    transaction
  })

  const dynamicData = {
    siteName: siteName,
    siteLogo: logoUrl,
    siteUrl: origin,
    playerEmail: userDetails.email,
    playerFullName: userDetails.firstName + ' ' + userDetails.lastName,
    playerFirstName: userDetails.firstName,
    playerLastName: userDetails.lastName,
    userName: userDetails.username,
    // walletAmountTotal: parseFloat((userDetails.userWallet.amount + userDetails.userWallet.nonCashAmount).toFixed(2)),
    // walletAmountBonus: parseFloat(userDetails.userWallet.nonCashAmount.toFixed(2)),
    // walletAmountReal: parseFloat(userDetails.userWallet.amount.toFixed(2)),
    siteLoginUrl: `${origin}/login`,
    sendSupportRequestRoute: `${origin}}/support-mail`,
    playerCurrencySymbol: getSymbolFromCurrency(userDetails.currencyCode),
    subject: '-',
    reason: '-',
    link: link,
    withdrawAmount: '-',
    depositAmount: '-',
    transactionId: '-',
    supportEmailAddress: '-',
    kycLabels: '-'
  }

  return { ...dynamicData, ...currentDataList }
}

export const createEmailWithDynamicValues = async ({ emailType, userId, serviceData, language, link, transaction }) => {
  let dynamicData = { ...serviceData }

  let templateDetails = await db.EmailTemplate.findOne({
    where: { type: emailType, isPrimary: EMAIL_TEMPLATE_PRIMARY_STATUS.PRIMARY },
    raw: true
  })

  if (!templateDetails) {
    templateDetails = await db.EmailTemplate.findOne({
      where: { isDefault: true, type: emailType },
      raw: true
    })
  }

  dynamicData = {
    ...await getDynamicData({ userId, dataList: templateDetails.dynamicData, currentDataList: dynamicData, transaction, link })
  }

  const emailData = insertDynamicDataInTemplate({ template: templateDetails.templateCode[language] || templateDetails.templateCode.EN, dynamicData })

  return emailData
}

export const insertDynamicDataInTemplate = ({ template, dynamicData }) => {
  let returnEmail = template

  Object.keys(dynamicData).forEach(dynamicKey => {
    const pattern = new RegExp(`{{{ *${dynamicKey} *}}}`, 'g')
    returnEmail = returnEmail.replaceAll(pattern, dynamicData[dynamicKey])
  })

  return returnEmail
}
