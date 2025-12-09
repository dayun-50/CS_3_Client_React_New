import axios from "axios";

//파일서버 주소 바꾸지.마시오. 진짜. 절대.
export const FILE_SERVER = "https://cs-689104601634.asia-northeast3.run.app";

export const caxios = axios.create({
  baseURL: `https://cs-689104601634.asia-northeast3.run.app/`

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