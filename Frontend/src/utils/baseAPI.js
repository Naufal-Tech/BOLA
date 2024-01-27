import axios from "axios";

const baseAPI = axios.create({
  baseURL: "api/v1",
});

export default baseAPI;
