const { emailSender } = require('@keystonejs/email');

// via mailgun transport

// const jsxEmailSender = emailSender.jsx({
//   root: __dirname,
//   transport: 'mailgun',
// });

// via nodemailer transport

const jsxEmailSender = emailSender.jsx({
  root: __dirname,
  transport: 'nodemailer',
});

const sendEmail = (templatePath, rendererProps, options) => {
  if (!templatePath) {
    console.error('No template path provided');
  }
  return jsxEmailSender(templatePath).send(rendererProps, options);
};

module.exports = {
  sendEmail,
};
