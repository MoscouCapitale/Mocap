export type Error = {
  message: string;
  code?: number;
  targetElement?: string | HTMLElement;
};

export enum CustomStatusCodes {
  EmailNotRegistered = 435,
  // Add more custom status codes here
}

export const statusMessages = {
  [CustomStatusCodes.EmailNotRegistered]: "This email is not registered yet, please signup first",
  // Add more status messages here
};
