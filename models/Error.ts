export type Error = {
  code: number;
  message: string;
  targetElement?: string | HTMLElement;
};

export enum CustomStatusCodes {
  EmailNotRegistered = 435,
  // Add more custom status codes here
}

export const statusMessages = {
  [CustomStatusCodes.EmailNotRegistered]:
    "This email is not registered yet, please signup first",
  // Add more status messages here
};
