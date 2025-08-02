import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

import { transporter } from '../../config/mail.config';
import { IEmail } from '../interface/email';

// Resolving path for template location
const templateBasePath = path.join(__dirname, '../templates');

// Send Mail utility handler
export const sendEmail = async ({ to, subject, type, context }: IEmail) => {
  try {
    const defaultConfig: Record<string, { templateFile: string }> = {
      emailVerification: {
        templateFile: 'verificationEmailTemplate.hbs',
      },
      passwordResetRequest: {
        templateFile: 'passwordResetRequestTemplate.hbs',
      },
    };

    const config = defaultConfig[type];

    if (!config) {
      throw new Error(`Invalid type`);
    }

    // Handlebar html template
    const templatePath = path.join(templateBasePath, config.templateFile);
    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    const template = handlebars.compile(templateSource);
    const htmlContent = template(context);

    const emailOptions = {
      from: `"${process.env.EMAIL_FROM}" <${process.env.EMAIL_ADDRESS}>`,
      to,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(emailOptions);
  } catch (error: any) {
    console.error('Error sending mail', error.message);
    throw new Error('Error sending mail');
  }
};
