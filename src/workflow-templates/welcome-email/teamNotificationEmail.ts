export const teamNotificationEmailHTML = (name: string, phoneNumber: string, emailAddress: string,
fullAddress: string
) => {
    return `<!--
* This email was built using Tabular.
* For more information, visit https://tabular.email
-->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
<head>
<title>New Lead Sign Up</title>
<meta charset="UTF-8" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<!--[if !mso]>-->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<!--<![endif]-->
<meta name="x-apple-disable-message-reformatting" content="" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta content="true" name="HandheldFriendly" />
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no" />
<style type="text/css">
table {
border-collapse: separate;
table-layout: fixed;
mso-table-lspace: 0pt;
mso-table-rspace: 0pt
}
table td {
border-collapse: collapse
}
.ExternalClass {
width: 100%
}
.ExternalClass,
.ExternalClass p,
.ExternalClass span,
.ExternalClass font,
.ExternalClass td,
.ExternalClass div {
line-height: 100%
}
body, a, li, p, h1, h2, h3 {
-ms-text-size-adjust: 100%;
-webkit-text-size-adjust: 100%;
}
html {
-webkit-text-size-adjust: none !important
}
body, #innerTable {
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale
}
#innerTable img+div {
display: none;
display: none !important
}
img {
Margin: 0;
padding: 0;
-ms-interpolation-mode: bicubic
}
h1, h2, h3, p, a {
line-height: inherit;
overflow-wrap: normal;
white-space: normal;
word-break: break-word
}
a {
text-decoration: none
}
h1, h2, h3, p {
min-width: 100%!important;
width: 100%!important;
max-width: 100%!important;
display: inline-block!important;
border: 0;
padding: 0;
margin: 0
}
a[x-apple-data-detectors] {
color: inherit !important;
text-decoration: none !important;
font-size: inherit !important;
font-family: inherit !important;
font-weight: inherit !important;
line-height: inherit !important
}
u + #body a {
color: inherit;
text-decoration: none;
font-size: inherit;
font-family: inherit;
font-weight: inherit;
line-height: inherit;
}
a[href^="mailto"],
a[href^="tel"],
a[href^="sms"] {
color: inherit;
text-decoration: none
}
</style>
<style type="text/css">
@media (min-width: 481px) {
.hd { display: none!important }
}
</style>
<style type="text/css">
@media (max-width: 480px) {
.hm { display: none!important }
}
</style>
<style type="text/css">
@media (max-width: 480px) {
.t18{mso-line-height-alt:0px!important;line-height:0!important;display:none!important}.t19{padding-left:30px!important;padding-bottom:40px!important;padding-right:30px!important}.t8{padding-bottom:20px!important}.t6{line-height:28px!important;font-size:26px!important;letter-spacing:-1.04px!important;mso-text-raise:1px!important}.t79{padding:40px 30px!important}.t62{padding-bottom:36px!important}.t58{text-align:center!important}.t29,.t31,.t35,.t37,.t41,.t43,.t47,.t49,.t53,.t55{display:revert!important}.t33,.t39,.t45,.t51,.t57{vertical-align:top!important;width:44px!important}.t1{padding-top:15px!important}.t3{width:139px!important}.t14{padding-bottom:34px!important}
}
</style>
<!--[if !mso]>-->
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;800&amp;display=swap" rel="stylesheet" type="text/css" />
<!--<![endif]-->
<!--[if mso]>
<xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
<![endif]-->
</head>
<body id="body" class="t85" style="min-width:100%;Margin:0px;padding:0px;background-color:#242424;"><div class="t84" style="background-color:#242424;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td class="t83" style="font-size:0;line-height:0;mso-line-height-rule:exactly;background-color:#242424;" valign="top" align="center">
<!--[if mso]>
<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false">
<v:fill color="#242424"/>
</v:background>
<![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" align="center" id="innerTable"><tr><td><div class="t18" style="mso-line-height-rule:exactly;mso-line-height-alt:45px;line-height:45px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr><tr><td align="center">
<table class="t22" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr><td width="735" class="t21" style="width:735px;">
<table class="t20" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t19" style="background-color:#F8F8F8;padding:0 50px 60px 50px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100% !important;"><tr><td align="left">
<table class="t4" role="presentation" cellpadding="0" cellspacing="0" style="Margin-right:auto;"><tr><td width="145" class="t3" style="width:145px;">
<table class="t2" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t1" style="background-color:#E6E1E1;padding:20px 10px 30px 10px;"><div style="font-size:0px;"><img class="t0" style="display:block;border:0;height:auto;width:100%;Margin:0;max-width:100%;" width="125" height="35.546875" alt="" src="https://80212c17-eef7-4619-933b-bd293c63c16e.b-cdn.net/e/e90a2a37-ee9d-4425-9238-d1cbb5d5225c/8f651f02-452a-4230-82f0-2a508f6e813e.png"/></div></td></tr></table>
</td></tr></table>
</td></tr><tr><td><div class="t7" style="mso-line-height-rule:exactly;mso-line-height-alt:30px;line-height:30px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr><tr><td align="center">
<table class="t11" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr><td width="600" class="t10" style="width:600px;">
<table class="t9" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t8" style="padding:0 0 25px 0;"><h1 class="t6" style="margin:0;Margin:0;font-family:Roboto,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:34px;font-weight:400;font-style:normal;font-size:28px;text-decoration:none;text-transform:none;direction:ltr;color:#333333;text-align:left;mso-line-height-rule:exactly;mso-text-raise:2px;"><span class="t5" style="margin:0;Margin:0;font-weight:700;mso-line-height-rule:exactly;">New Lead Sign Up!</span></h1></td></tr></table>
</td></tr></table>
</td></tr><tr><td><div class="t12" style="mso-line-height-rule:exactly;mso-line-height-alt:20px;line-height:20px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr><tr><td align="center">
<table class="t17" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr><td width="600" class="t16" style="width:600px;">
<table class="t15" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t14" style="padding:0 0 45px 0;"><p class="t13" style="margin:0;Margin:0;font-family:Roboto,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:22px;font-weight:400;font-style:normal;font-size:16px;text-decoration:none;text-transform:none;direction:ltr;color:#333333;text-align:left;mso-line-height-rule:exactly;mso-text-raise:2px;"> ${name} just signed up for the 5 Day Free Pass! <br/>Reach out to them as soon as possible.&nbsp; <br/><br/>Here are their details:&nbsp; <br/><br/>${name} <br/>${emailAddress} <br/>${phoneNumber} <br/>${fullAddress}</p></td></tr></table>
</td></tr></table>
</td></tr></table></td></tr></table>
</td></tr></table>
</td></tr><tr><td align="center">
<table class="t82" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr><td width="600" class="t81" style="width:600px;">
<table class="t80" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t79" style="background-color:#242424;padding:48px 50px 48px 50px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100% !important;"><tr><td align="center">
<table class="t27" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr><td width="500" class="t26" style="width:600px;">
<table class="t25" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t24"><p class="t23" style="margin:0;Margin:0;font-family:Roboto,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:22px;font-weight:800;font-style:normal;font-size:18px;text-decoration:none;text-transform:none;letter-spacing:-0.9px;direction:ltr;color:#757575;text-align:center;mso-line-height-rule:exactly;mso-text-raise:1px;">Want updates through more platforms?</p></td></tr></table>
</td></tr></table>
</td></tr><tr><td align="center">
<table class="t65" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr><td width="500" class="t64" style="width:800px;">
<table class="t63" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t62" style="padding:10px 0 44px 0;"><div class="t61" style="width:100%;text-align:center;"><div class="t60" style="display:inline-block;"><table class="t59" role="presentation" cellpadding="0" cellspacing="0" align="center" valign="top">
<tr class="t58"><td></td><td class="t33" width="44" valign="top">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="t32" style="width:100%;"><tr><td class="t29" style="width:10px;" width="10"></td><td class="t30"><div style="font-size:0px;"><img class="t28" style="display:block;border:0;height:auto;width:100%;Margin:0;max-width:100%;" width="24" height="24" alt="" src="https://80212c17-eef7-4619-933b-bd293c63c16e.b-cdn.net/e/e90a2a37-ee9d-4425-9238-d1cbb5d5225c/eed1ca38-2b60-481d-8f62-323d48a0c2ce.png"/></div></td><td class="t31" style="width:10px;" width="10"></td></tr></table>
</td><td class="t39" width="44" valign="top">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="t38" style="width:100%;"><tr><td class="t35" style="width:10px;" width="10"></td><td class="t36"><div style="font-size:0px;"><img class="t34" style="display:block;border:0;height:auto;width:100%;Margin:0;max-width:100%;" width="24" height="24" alt="" src="https://80212c17-eef7-4619-933b-bd293c63c16e.b-cdn.net/e/e90a2a37-ee9d-4425-9238-d1cbb5d5225c/cbec94a4-c0f3-42f5-8230-f31f20053652.png"/></div></td><td class="t37" style="width:10px;" width="10"></td></tr></table>
</td><td class="t45" width="44" valign="top">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="t44" style="width:100%;"><tr><td class="t41" style="width:10px;" width="10"></td><td class="t42"><div style="font-size:0px;"><img class="t40" style="display:block;border:0;height:auto;width:100%;Margin:0;max-width:100%;" width="24" height="24" alt="" src="https://80212c17-eef7-4619-933b-bd293c63c16e.b-cdn.net/e/e90a2a37-ee9d-4425-9238-d1cbb5d5225c/fd0bd33b-22f5-425a-9bdc-dbd36bab0122.png"/></div></td><td class="t43" style="width:10px;" width="10"></td></tr></table>
</td><td class="t51" width="44" valign="top">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="t50" style="width:100%;"><tr><td class="t47" style="width:10px;" width="10"></td><td class="t48"><div style="font-size:0px;"><img class="t46" style="display:block;border:0;height:auto;width:100%;Margin:0;max-width:100%;" width="24" height="24" alt="" src="https://80212c17-eef7-4619-933b-bd293c63c16e.b-cdn.net/e/e90a2a37-ee9d-4425-9238-d1cbb5d5225c/546bc2eb-30e5-4e9b-ba20-57ef28261b72.png"/></div></td><td class="t49" style="width:10px;" width="10"></td></tr></table>
</td><td class="t57" width="44" valign="top">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="t56" style="width:100%;"><tr><td class="t53" style="width:10px;" width="10"></td><td class="t54"><div style="font-size:0px;"><img class="t52" style="display:block;border:0;height:auto;width:100%;Margin:0;max-width:100%;" width="24" height="24" alt="" src="https://80212c17-eef7-4619-933b-bd293c63c16e.b-cdn.net/e/e90a2a37-ee9d-4425-9238-d1cbb5d5225c/17a14184-c517-4f58-8db5-8b1f4a297f79.png"/></div></td><td class="t55" style="width:10px;" width="10"></td></tr></table>
</td>
<td></td></tr>
</table></div></div></td></tr></table>
</td></tr></table>
</td></tr><tr><td align="center">
<table class="t70" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr><td width="500" class="t69" style="width:600px;">
<table class="t68" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t67"><p class="t66" style="margin:0;Margin:0;font-family:Roboto,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:22px;font-weight:400;font-style:normal;font-size:12px;text-decoration:none;text-transform:none;direction:ltr;color:#888888;text-align:center;mso-line-height-rule:exactly;mso-text-raise:3px;">UFCFit Oakridge Mall 5540 Winfield Ave #1000 San Jose, CA&nbsp; By Nordstrom Rack, Living Spaces and Ranch99</p></td></tr></table>
</td></tr></table>
</td></tr><tr><td align="center">
<table class="t78" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr><td width="500" class="t77" style="width:600px;">
<table class="t76" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t75"><p class="t74" style="margin:0;Margin:0;font-family:Roboto,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:22px;font-weight:400;font-style:normal;font-size:12px;text-decoration:none;text-transform:none;direction:ltr;color:#888888;text-align:center;mso-line-height-rule:exactly;mso-text-raise:3px;"><a class="t71" href="https://tabular.email" style="margin:0;Margin:0;font-weight:700;font-style:normal;text-decoration:none;direction:ltr;color:#0000FF;mso-line-height-rule:exactly;" target="_blank">Unsubscribe</a>&nbsp; &bull;&nbsp; <a class="t72" href="https://tabular.email" style="margin:0;Margin:0;font-weight:700;font-style:normal;text-decoration:none;direction:ltr;color:#0000FF;mso-line-height-rule:exactly;" target="_blank">Privacy policy</a>&nbsp; &bull;&nbsp; <a class="t73" href="https://tabular.email" style="margin:0;Margin:0;font-weight:700;font-style:normal;text-decoration:none;direction:ltr;color:#878787;mso-line-height-rule:exactly;" target="_blank">Contact us</a></p></td></tr></table>
</td></tr></table>
</td></tr></table></td></tr></table>
</td></tr></table>
</td></tr></table></td></tr></table></div><div class="gmail-fix" style="display: none; white-space: nowrap; font: 15px courier; line-height: 0;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</div></body>
</html>`;
  };
  
  export default teamNotificationEmailHTML;