import bcrypt from 'bcryptjs';

// Util function to hash password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

// Util function to compare password
export const comparePassword = async (
  inputPassword: string,
  savedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(inputPassword, savedPassword);
};
