export const logger = (...message: any) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  // tslint:disable-next-line: no-console
  if (isDevelopment) console.log(message);
};
