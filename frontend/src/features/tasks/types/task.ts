export interface Task {
  id: string;
  title: string;
  fieldId: string;
  fieldName: string;
  dueDate: string;
  dueTime: string;
  status: "pending" | "completed";
  alertMessage?: string;
  eviValue?: number;
  ndviValue?: number;
  stage?: string;
}
