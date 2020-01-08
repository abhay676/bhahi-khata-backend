const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

let template = null;

module.exports = function(params) {
  if (params.type === "WelcomeMail") {
    template = `
        <h1 style="text-align: center"><span style="font-family: courier new,courier,monospace">Welcome to </span><span style="font-family: courier new,courier,monospace">BHAHI-KHATA🚀</span></h1>
        <h3 style=""><span style="font-family: courier new,courier,monospace">Thanks for choosing Bhahi-Khata as your expense manager🙏.</span></h3>
        <h3 style=""><span style="font-family: courier new,courier,monospace">We are committed to making your experience smooth and more enjoyable😍.&nbsp;</span></h3>
        <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:100% !important; width:100%; height:auto !important;" width="600" alt="" data-proportionally-constrained="true" data-responsive="true" src="http://cdn.mcauto-images-production.sendgrid.net/8b59c3d0b56e8458/8f175730-78eb-4865-9980-c88aec56ce3c/1920x1276.jpg">
        <h5 style="">BHAH-KHATA is created by <a href="https://abgoswami.netlify.com"><em>Abhay Goswami😎</em></a><em>.</em></h5>
        <h5 style="">A <u><em>MADE IN INDIA 💓</em></u> product @2020</h5>
        `;
  } else {
    template = `
    <h1 style="text-align: center"><span style="color: rgba(0, 0, 0, 0.87); font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial; float: none; display: inline; font-family: courier, monospace; font-size: 40px">See You Again⏰</span></h1>
    <h3 style=""><span style="font-family: courier new,courier,monospace">Thanks for sharing your information with us. We assure you not to share your information with any </span><span style="color: #000000; font-family: &quot;courier new&quot;, courier, monospace; font-size: 16.38px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 700; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial; float: none; display: inline">profit/non-profit organization</span>.&nbsp;</h3>
<h3 style=""><br></h3>
<h4 style="text-align: center"><span style="color: #222222; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial; float: none; display: inline; font-family: helvetica,sans-serif"><em>And I'll tell you all about it when I see you again⛱</em></span></h4>
<h5 style="">BHAH-KHATA is created by <a href="https://abgoswami.netlify.com"><em>Abhay Goswami</em></a><em>.</em></h5>
<h5 style="">A <u><em>MADE IN INDIA</em></u> product @2020</h5>
    `;
  }
  const msg = {
    to: params.to,
    from: params.from,
    subject: params.subject,
    text: params.text,
    html: template
  };
  sgMail.send(msg);
};
