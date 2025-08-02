import { OTP_TYPE } from '../interface/Otp';

// Function to generate 6 random digits otp code
export function generateOtp(): string {
  // Generate random integer between 0 and 999999
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}

// Util function to generate otp expiry time
export function getOtpExpiry(type: OTP_TYPE): Date {
  const now = new Date();

  let minutesToAdd: number;

  switch (type) {
    case OTP_TYPE.EMAIL_VERIFICATION:
      minutesToAdd = 15;
      break;

    case OTP_TYPE.RESET_PASSWORD:
      minutesToAdd = 5;
      break;

    default:
      throw new Error(`Unknown OTP type: ${type}`);
  }

  return new Date(now.getTime() + minutesToAdd * 60 * 1000);
}
