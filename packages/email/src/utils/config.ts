/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

import type * as templates from "../templates";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "my_user",
    pass: "my_password",
  },
});

export const sendEmail = async (options: SMTPTransport.Options, template: keyof typeof templates) => {
  return new Promise((resolve, reject) => {
    try {
      resolve(transporter.sendMail(options));
    } catch (e) {
      reject(console.error(`Failed to send email ${template}`));
    }
  });
};
