import axios from "axios";

export const signIn = async (credendials: {
  email: string;
  password: string;
}) => {
  const response = await axios.post(`/api/signin`, credendials, {
    withCredentials: true,
  });
  return response.data;
};
