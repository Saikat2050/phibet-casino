
export async function sendEmail (email, name, subject, HTMLEmailTemplate) {
  try {
    // const response = await mailjet.post('send', { version: 'v3.1' }).request({
    //   messages: [{
    //     From: {
    //       Email: appConfig.mailjet.senderEmail,
    //       Name: appConfig.mailjet.senderName
    //     },
    //     To: [{
    //       Email: email,
    //       Name: name
    //     }],
    //     Subject: subject,
    //     HTMLPart: HTMLEmailTemplate
    //   }]
    // })

    return response.response.status === 200
  } catch (error) {
    throw Error(error)
  }
}
