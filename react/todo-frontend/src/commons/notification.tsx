import { notification } from "antd";

export const showGraphQLErrors = (title: string, error: unknown) => {
  let message = "";

  if (typeof error === "string") {
    message = error;
  } else if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "object" && error !== null && "message" in error) {
    message = String((error as any).message);
  } else {
    message = "Đã xảy ra lỗi không xác định";
  }

  const lines = message.split("\n").filter(Boolean);

  notification.error({
    message: title,
    description: (
      <ul className="list-disc pl-4">
        {lines.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    ),
    placement: "topRight",
  });
};

export const showSuccessNotification = (title: string, description: string) => {
  notification.success({
    message: title,
    description,
    placement: "topRight",
  });
};