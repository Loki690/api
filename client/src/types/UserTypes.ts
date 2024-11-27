export type User = {
  _id: string;
  userCode: string;
  firstName: string;
  lastName: string;
  project: string | any;
  isAdmin: boolean;
};
export type UsersUpdate = {
  id: number;
  userCode: string;
  firstName: string;
  lastName: string;
  project: string | any;
  isAdmin: boolean;
};
