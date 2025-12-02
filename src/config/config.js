import axios from "axios";


export const FILE_SERVER = "http://10.10.55.103";//파일서버 주소


export const caxios = axios.create({
  baseURL: `http://10.5.5.4/`

});

//모든 일반 api 호출
caxios.interceptors.request.use((config) => {
  if (!config.headers["Authorization"]) {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});