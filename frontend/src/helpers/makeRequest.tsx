import axios from "axios";
import { ApiRouteEnum } from "../definitions/api-routes";

export const makeRequest = async (
  route: ApiRouteEnum,
  method: "POST" | "GET",
  params: Record<string, unknown> = {}
) => {
  if (method === "GET") {
    const res = await axios.get(`${window.location}api/${route}`);
    return res.data;
  }

  if (method === "POST") {
    const res = await axios.post(`${window.location}api/${route}`, params);
    return res.data;
  }
};
