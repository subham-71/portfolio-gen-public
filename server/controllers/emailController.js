'use strict';

require('dotenv').config();
const nodemailer = require('nodemailer');

const sendEmail = async (recipient, subject, message) => {
  try {
    
    const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    port : 465,
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
});
  

    const mailOptions = {
      from: process.env.USER,
      to: recipient,
      subject: subject,
      text: message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);

  } catch (error) {
    console.error('Error sending email:', error);
  }
};

const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
};

const otpPairs = {};

const sendOtp = async (recipient) => {
  try {
    const otp = generateOtp();
    const subject = 'Signup - Protfolio-Gen';
    const message = `Hi! \nWelcome to Portfolio-gen. \nYour OTP is: ${otp}. Please use this OTP to verify your email address. The OTP is valid for 10 minutes. \n\n Regards, \n Subham`;

    await sendEmail(recipient, subject, message);

    otpPairs[recipient] = otp;

    console.log('OTP sent:');

    setInterval(()=>{
        delete otpPairs[recipient];
    },600000)

  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

const verifyOtp = (email, userOtp) => {
  const storedOtp = otpPairs[email];

  if (!storedOtp) {
    throw new Error('OTP not found or expired.');
  }

  if (userOtp === storedOtp) {

    console.log('OTP verified');
    delete otpPairs[email]; 
    return true;
  } else {
    // Invalid OTP
    console.log('Invalid OTP');
    return false;
  }
};

const sendOtpMail = async (req, res) => {
  try {
    const email = req.body.email;
    console.log(email);
    await sendOtp(email);

    res.status(200).send('OTP sent');
  } catch (error) {
    res.status(400).send(error.message);
  }
};


const verifyOtpMail = async (req, res) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;

    const isVerified = verifyOtp(email, otp);

    if (isVerified) {
      res.status(200).send('OTP verified');
    } else {
      res.status(400).send('Invalid OTP');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};


const handleMail = async (req, res) => {

   try {
        const data = req.body.data;

        const name = data.name;
        const fromEmail = data.fromEmail;
        const clientEmail = data.clientEmail;
        const message = data.message;
        
        const subject = "Email through your Portfolio";

        const formattedMessage =  "Hi, I am " + name + " and I am contacting you through your portfolio. \n\n Here is my message : \n\n" + message + "\n\n" + "My email is " + fromEmail + "\n\n" + "Regards,\n" + name;

        await sendEmail(clientEmail, subject, formattedMessage);
        
        res.status(200).send("Email sent");
        

    }
    catch (error) {
        res.status(400).send(error.message);
    }
}



module.exports = {
    handleMail, sendOtpMail, verifyOtpMail
}
