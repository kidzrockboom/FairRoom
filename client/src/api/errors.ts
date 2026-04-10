import axios from "axios";

export function readApiErrorMessage(error: unknown, fallbackMessage: string) {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : fallbackMessage;
  }

  const responseData = error.response?.data;

  if (typeof responseData === "string" && responseData.trim()) {
    return responseData;
  }

  if (responseData && typeof responseData === "object") {
    const maybeMessage = Reflect.get(responseData, "message");
    if (typeof maybeMessage === "string" && maybeMessage.trim()) {
      return maybeMessage;
    }

    const maybeError = Reflect.get(responseData, "error");
    if (typeof maybeError === "string" && maybeError.trim()) {
      return maybeError;
    }
  }

  return error.message || fallbackMessage;
}
