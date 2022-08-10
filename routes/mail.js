var nodemailer = require("nodemailer");
require("dotenv").config();

var transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.email,
    pass: process.env.passw
  }
});

function send_request(sending, name) {
  var send = {
    from: process.env.email,
    to: sending,
    subject: `Friend Request on Slammed by ${name}`,
    text: `This is a friend request from ${name}. Check 'em' out on slammed`,
  };
  transporter.sendMail(send, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

function accepted_request(sending, name) {
  var send = {
    from: "ea62388b42aba0@inbox.mailtrap.io",
    to: sending,
    subject: `Your Friend Request on Slammed to ${name} has been accepted`,
    text: `Your Friend Request on Slammed to ${name} has been accepted Check 'em' out on slammed`,
  };
  transporter.sendMail(send, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports = { send_request, accepted_request };
