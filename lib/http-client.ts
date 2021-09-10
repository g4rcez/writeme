import axios from "axios";
//@ts-ignore
import adapter from "axios/lib/adapters/http";

export const httpClient = axios.create({
  baseURL: "/api",
  adapter,
});
