//Third-Party modules
//const nodemailer = require('nodemailer');
//const pug = require('pug');
//const htmlToText = require('html-to-text');

const nodemailer = require('nodemailer');

const sendEmail = async options => {
   // 1) Create a transporter
   const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
         user: process.env.EMAIL_USERNAME,
         pass: process.env.EMAIL_PASSWORD
      }
   });

   // 2) Define the email options
   const mailOptions = {
      from: 'Mateus Neto <hello@lalitaa.com>',
      to: options.email,
      subject: options.subject,
      text: options.message
      // html:
   };

   // 3) Actually send the email
   await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

/* --------After Implementing PUG TEMPLATES---------------

module.exports = class Email {
   constructor(usuario, url) {
      this.to = usuario.email;
      this.firstName = usuario.nome.split(' ')[0];
      this.lastName = usuario.nome.split(' ')[1];
      this.url = url;
      this.from = `Lalitaa <${process.env.EMAIL_FROM}>`;
   }

   newTransport() {
      if (process.env.NODE_ENV === 'production') {
         //Sendgrid

         return nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
               user: process.env.SENDGRID_USERNAME,
               pass: process.env.SENDGRID_PASSWORD
            }
         });
      }
      return nodemailer.createTransport({
         host: process.env.EMAIL_HOST,
         port: process.env.EMAIL_PORT,
         auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
         }
      });
   }

   //sending the e-mail
   async send(template, subject) {
      //Render HTML based on a pug template
      const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
         firstName: this.firstName,
         lastName: this.lastName,
         url: this.url,
         subject
      });
      //Define E-mail options
      const mailOptions = {
         from: this.from,
         to: this.to,
         subject,
         html,
         text: htmlToText.fromString(html)
      };

      //Create a transport and send email

      await this.newTransport().sendMail(mailOptions);
   }

   async sendWelcome() {
      await this.send('welcome', 'Bem-vindo a Cliline');
   }

   async sendPasswordReset() {
      await this.send('passwordReset', 'Your password reset token (valid for 10 minutes)');
   }
};


*/
