export enum ERole {
  ADMIN,
  TUTOR,
  STUDENT,
}

export enum ERolePermission {
  READ,
  WRITE,
  DELETE,
}

export interface IUser {
  username: string;
  displayName: string;
  age: number;
  role: ERole;
}
