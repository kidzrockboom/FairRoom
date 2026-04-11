import axios from "axios";

function extractMessage(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (value && typeof value === "object") {
    const message = Reflect.get(value, "message");
    if (typeof message === "string" && message.trim()) {
      return message;
    }

    const error = Reflect.get(value, "error");
    if (typeof error === "string" && error.trim()) {
      return error;
    }

    const detail = Reflect.get(value, "detail");
    if (typeof detail === "string" && detail.trim()) {
      return detail;
    }
  }

  return null;
}

export function readApiErrorMessage(error: unknown, fallbackMessage: string) {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : fallbackMessage;
  }

  const responseData = error.response?.data;

  const directMessage = extractMessage(responseData);
  if (directMessage) {
    return directMessage;
  }

  if (responseData && typeof responseData === "object") {
    const nestedError = Reflect.get(responseData, "error");
    const nestedMessage = extractMessage(nestedError);
    if (nestedMessage) {
      return nestedMessage;
    }
  }

  return fallbackMessage;
}
