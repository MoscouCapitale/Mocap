function verifyEmailIntegrity(email: string): string {
  const emailFormat = {
    minLength: 5,
    maxLength: 254,
    authorizedCharacters: /^[a-zA-Z0-9!#$%&'*+\-/=?^_`{|}~@.]*$/,
  };
  const defaultReturnError = "Invalid email address";

  if ((email.length < emailFormat.minLength) || email.length > emailFormat.maxLength) return defaultReturnError;
  if (!emailFormat.authorizedCharacters.test(email)) return defaultReturnError;

  const emailParts = email.split("@");
  if (emailParts.length !== 2) return defaultReturnError;
  if (emailParts[0].length < 1 || emailParts[1].length < 1) return defaultReturnError;

  return "";
}

function verifySamePassword(password: string, confirmPassword: string): string {
  return password === confirmPassword ? "" : "Passwords do not match";
}

function verifyPasswordIntegrity(password: string): string {
  const passwordFormat = {
    minLength: 10,
    hasCase: true,
    hasNumber: true,
    hasSpecialCharacter: true,
    authorizedCharacters: /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
  };

  if (password.length < passwordFormat.minLength) return "Password must be at least 10 char.";
  if (passwordFormat.hasCase && (!/[A-Z]/.test(password) || !/[a-z]/.test(password))) return "Password must contain at least one uppercase/lowercase";
  if (passwordFormat.hasNumber && !/[0-9]/.test(password)) return "Password must contain at least one number";
  if (passwordFormat.hasSpecialCharacter && !passwordFormat.authorizedCharacters.test(password)) return "Password must contain at least one special character";

  return "";
}

export { verifyEmailIntegrity, verifySamePassword, verifyPasswordIntegrity };
