const { EMAIL_TEMPLATE_EVENT_TYPES } = require('@src/utils/constants/public.constants.utils')

const emailVerificationData = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=Edge">
<style type="text/css">
body, p, div { font-family: arial, helvetica, sans-serif; font-size: 14px; }
body { color: #050608; }
body a { color: #050608; text-decoration: none; }
p { margin: 0; padding: 0; }
table.wrapper { width:100% !important; table-layout: fixed; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -moz-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
img.max-width { max-width: 100% !important; }
@media screen and (max-width:480px) {
.preheader .rightColumnContent, .footer .rightColumnContent { text-align: left !important; }
table.wrapper-mobile { width: 100% !important; table-layout: fixed; }
img.max-width { height: auto !important; max-width: 100% !important; }
}
</style>
</head>
<body>
<center class="wrapper" data-link-color="#1188E6" data-body-style="font-size:14px; font-family:arial,helvetica,sans-serif; color:#FFFFFF;">
<div class="webkit">
<table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#050608">
  <tr>
    <td valign="top" bgcolor="#FFFFFF" width="100%">
      <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
        <tr><td width="100%">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:700px;" align="center" bgcolor="#050608">
                <tr><td role="modules-container" style="padding:10px 10px 10px 20px; color:#FFFFFF; text-align:center;" width="100%" align="left">
                  <table class="module" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                    <tbody><tr><td style="font-size:6px; line-height:10px; padding:0px;" valign="top" align="center">
                      <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:100% !important; width:20%; height:auto !important;" width="600" alt="Phibet Logo" src="">
                    </td></tr></tbody>
                  </table>
                  <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tbody><tr><td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top">
                      <div style="font-family: inherit; text-align: inherit;">
                        <br>
                        <span style="font-size: 18px;"><strong>Hi {{firstName}},</strong></span>
                        <br><br>
                        <strong>Registered email: {{email}}</strong>
                        <br><br>
                        <p>Thank you for signing up at <b>Phibet</b>!</p>
                        <p>To complete your registration, please verify your email address by clicking the button below:</p>
                      </div>
                    </td></tr></tbody>
                  </table>
                  <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" style="padding: 20px 0;">
                    <tr><td align="center">
                      <a href="{{verificationLink}}" target="_blank" style="background-image: linear-gradient(180deg, #EFD43C 0%, #CB7D00 100%); color: #FFFFFF; font-size: 16px; padding: 10px 60px; text-decoration: none; border-radius: 5px;"><b>Verify Email</b></a>
                    </td></tr>
                  </table>
                  <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tbody><tr><td style="padding:18px 0px 18px 0px; line-height:22px; text-align:center;" valign="top">
                      <div>
                        <p>If you did not request this change, no action is needed.</p>
                        <p>Need help? <b><a href="{{url}}" style="color: rgb(225,177,36);">Contact Support</a></b> or email us at <b><a href="mailto:{{supportEmail}}" style="color: rgb(225,177,36);">{{supportEmail}}</a></b>.</p>
                      </div>
                    </td></tr></tbody>
                  </table>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </td>
  </tr>
</table>
</div>
</center>
</body>
</html>`

const resetPassword = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
  <!--[if !mso]><!-->
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <!--<![endif]-->
  <style type="text/css">
    body, p, div {
      font-family: arial, helvetica, sans-serif;
      font-size: 14px;
    }
    body {
      color: #050608;
    }
    body a {
      color: #050608;
      text-decoration: none;
    }
    p { margin: 0; padding: 0; }
    table.wrapper {
      width:100% !important;
      table-layout: fixed;
      -webkit-font-smoothing: antialiased;
      -webkit-text-size-adjust: 100%;
      -moz-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    img.max-width {
      max-width: 100% !important;
    }
    @media screen and (max-width:480px) {
      .preheader .rightColumnContent,
      .footer .rightColumnContent {
        text-align: left !important;
      }
      table.wrapper-mobile {
        width: 100% !important;
        table-layout: fixed;
      }
      img.max-width {
        height: auto !important;
        max-width: 100% !important;
      }
    }
  </style>
</head>
<body>
  <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size:14px; font-family:arial,helvetica,sans-serif; color:#FFFFFF;">
    <div class="webkit">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#050608">
        <tr>
          <td valign="top" bgcolor="#FFFFFF" width="100%">
            <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="100%">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td>
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:700px;" align="center" bgcolor="#050608">
                          <tr>
                            <td role="modules-container" style="padding:10px 10px 10px 20px; color:#FFFFFF; text-align:center;" width="100%" align="left">
                              <table class="module" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                                <tbody>
                                  <tr>
                                    <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center">
                                      <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:100% !important; width:20%; height:auto !important;" width="600" alt="Phibet Logo" src="">
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tbody>
                                  <tr>
                                    <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content">
                                      <div style="font-family: inherit; text-align: inherit">
                                        <!-- Added extra white space using a line break -->
                                        <br>
                                        <span style="font-size: 18px; font-family: arial, helvetica, sans-serif;">
                                          <strong>Hi {{firstName}},</strong>
                                        </span>
                                        <br><br> <!-- Added space -->
                                      </div>
                                      <div style="font-family: inherit; text-align: inherit;>
                                        <strong>Registered email: {{email}}</strong> {{email}}
                                        <br><br> <!-- Added space -->
                                      </div>
                                      <div style="font-family: inherit; text-align: inherit">
                                        <p>We received a request to reset your password for <b>Phibet</b>!</p>
                                        <p> </p> <!-- Added blank space -->
                                        <p>If you did not request a password reset, please ignore this email.</p>
                                        <p> </p> <!-- Added blank space -->
                                        <p> </p> <!-- Added blank space -->
                                        <p>Otherwise, click the button below to set a new password:</p>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" style="padding: 20px 0;">
                                <tr>
                                  <td align="center">
                                    <a href="{{verificationLink}}" target="_blank" style="background-image: linear-gradient(180deg, #EFD43C 0%, #CB7D00 100%); color: #FFFFFF; font-size: 16px; padding: 10px 60px; text-decoration: none; border-radius: 5px;"><b>Reset Password<b></a>
                                  </td>
                                </tr>
                              </table>
                              <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tbody>
                                  <tr>
                                  <tr>
      <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:center;" height="100%" valign="top" bgcolor="" role="module-content">
        <div style="font-family: inherit; text-align: inherit">
          <p>If you did not request this change, no action is needed.</p>
          <p>Need help?<b> <a href="{{url}}" style="color: rgb(225,177,36);">Contact Support</a> </b>or email us at <b><a href="mailto: {{supportEmail}}" style="color: rgb(225,177,36);">{{supportEmail}}</a></b>.</p>
        </div>
      </td>
    </tr>
                                </tbody>
                              </table>
                              <table class="module" role="module" data-type="unsubscribe" style="color:#444444; font-size:10px; line-height:20px; text-align:center;">
                                <tr>
                                  <td>
                                    <!--<p><a class="Unsubscribe--unsubscribeLink" href="{{url}}" target="_blank">Unsubscribe</a></p>-->
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </center>
</body>
</html>
`

export const emailTemplateData = [{
  label: 'email verification',
  event_type: EMAIL_TEMPLATE_EVENT_TYPES.EMAIL_VERIFICATION,
  dynamic_data: JSON.stringify(['firstName', 'email', 'supportEmail', 'url', 'verificationLink']),
  template_code: JSON.stringify({
    EN: emailVerificationData
  })
},
{
  label: 'reset password',
  event_type: EMAIL_TEMPLATE_EVENT_TYPES.RESET_PASSWORD,
  dynamic_data: JSON.stringify(['firstName', 'email', 'supportEmail', 'url', 'verificationLink']),
  template_code: JSON.stringify({
    EN: resetPassword
  })
}
]
