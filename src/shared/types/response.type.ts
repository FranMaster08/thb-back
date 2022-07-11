export type TypeResponse = {
  statusCode: number;
  message: string;
  [data: string]: {}
};

export type TypeResponseError = {
  statusCode: number;
  error: string;
  message: string;
};
