function verifyEmailIntegrity(email: string): boolean {
  const emailFormat = {
    minLength: 5,
    maxLength: 254,
    authorizedCharacters: /^[a-zA-Z0-9!#$%&'*+\-/=?^_`{|}~@.]*$/,
  };

  if ((email.length < emailFormat.minLength) || email.length > emailFormat.maxLength) return false;
  if (!emailFormat.authorizedCharacters.test(email)) return false;

  const emailParts = email.split("@");
  if (emailParts.length !== 2) return false;
  if (emailParts[0].length < 1 || emailParts[1].length < 1) return false;

  return true;
}

function verifySamePassword(password: string, confirmPassword: string): boolean {
  return password === confirmPassword;
}

function verifyPasswordIntegrity(password: string): boolean {
  const passwordFormat = {
    minLength: 10,
    hasCase: true,
    hasNumber: true,
    hasSpecialCharacter: true,
    authorizedCharacters: /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
  };

  if (password.length < passwordFormat.minLength) return false;
  if (passwordFormat.hasCase && (!/[A-Z]/.test(password) || !/[a-z]/.test(password))) return false;
  if (passwordFormat.hasNumber && !/[0-9]/.test(password)) return false;
  if (passwordFormat.hasSpecialCharacter && !passwordFormat.authorizedCharacters.test(password)) return false;

  return true;
}

export { verifyEmailIntegrity, verifySamePassword, verifyPasswordIntegrity };
