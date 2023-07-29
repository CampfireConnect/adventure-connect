import axios from "axios";
const API_URL_SIGNUP = "/api/signup";
const API_URL_LOGIN = "/api/login";
const API_URL_USER = "/api/user";

export const getMatches = async (user_id) => {
  const response = await axios.get(API_URL_USER);
  if (response.data) return response.data;
  else return "Matches not found";
};
