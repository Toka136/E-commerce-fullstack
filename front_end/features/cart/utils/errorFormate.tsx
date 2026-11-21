import { AxiosError } from "axios";

type Props = {
  error: unknown;
};

export const ErrorFormate = ({ error }: Props): string => {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.message ||
      error.message ||
      "Something went wrong"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};