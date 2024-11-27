export interface IUserProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _id: string | any;
  userCode: string;
  password: string;
  isAdmin: boolean;
  project: string;
  firstName: string;
  lastName: string;
  item?: string;
  members?: string | any;
}

export interface IAuthStateProps {
  user?: IUserProps;
  isAuthenticated: boolean;
  signedOut: boolean;
  signIn: (userData: IUserProps) => void;
  signOut: () => void;
  getSelf: () => any;
}
