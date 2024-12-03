export type User = {
  _id: string;
  userCode: string;
  firstName: string;
  lastName: string;
  project: string | any;
  role: string;
};
export type UsersUpdate = {
  id: number;
  userCode: string;
  firstName: string;
  lastName: string;
  project: string | any;
  role: string;
};
