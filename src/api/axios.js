import axios from "axios";

import getBaseUrl from "../utils/baseURL";

const api = axios.create({
  baseURL: getBaseUrl(),
});

export default api;
