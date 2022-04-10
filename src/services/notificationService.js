import { ElMessage } from "element-plus";

export function errorNotification(message) {
  ElMessage({
    type: "error",
    message,
  });
}

export function successNotification(message) {
  ElMessage({
    type: "success",
    message,
  });
}

export function infoNotification(message) {
  ElMessage({
    type: "info",
    message,
  });
}
