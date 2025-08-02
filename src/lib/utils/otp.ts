// Function to generate 6 random digits otp code
export function generateOtp(): string {
  // Generate random integer between 0 and 999999
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}
