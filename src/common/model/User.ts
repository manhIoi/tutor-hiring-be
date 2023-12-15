export const Role = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
};

export enum ERolePermission {
  READ,
  WRITE,
  DELETE,
}

export interface IUser {
  username: string;
  displayName: string;
  age: number;
  role: any;
}
