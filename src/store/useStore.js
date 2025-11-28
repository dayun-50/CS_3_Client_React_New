// import { create } from "zustand";

// const useAuthStore = create((set) => ({
//   token: "",
//   id: "",
//   isLogin: false,
//   babySeq : 0,

//   getbabySeq : (seq)=>{
//     set((state)=>{
//       sessionStorage.setItem("babySeq", seq);
//       return {babySeq : seq};
//     });
//   },

//   login: (token, id) => {
//     set((state) => {
//       sessionStorage.setItem("token", token);
//       sessionStorage.setItem("id", id);
//       return { token: token, id: id, isLogin: true };
//     });
//   },

//   logout: () => {
//     sessionStorage.removeItem("token");
//     sessionStorage.removeItem("id");
//     set({ token: "", id: "", isLogin: false });

//     sessionStorage.removeItem("jamesAccessToken");
//     set({ token: "", id: "", isLogin: false });
//   },
// }));
// export default useAuthStore;


import { create } from "zustand";

// 1. 🚨 sessionStorage에서 babySeq를 읽어옵니다. (필수)
const storedBabySeq = sessionStorage.getItem("babySeq");
const initialBabySeq = storedBabySeq ? Number(storedBabySeq) : 1;

const useAuthStore = create((set) => ({
  token: "",
  id: "",
  isLogin: false,
  babySeq: 0,
  babyDueDate: 0, //임신한 아기이면 출산 예정일, 태어난 아기이면 생일

  getbabySeq: (seq) => {
    set((state) => {
      sessionStorage.setItem("babySeq", seq);
      return { babySeq: seq };
    });
  },

  login: (token, id) => {
    set((state) => {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("id", id);
      return { token: token, id: id, isLogin: true };
    });
  },

  logout: () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("id");
    set({ token: "", id: "", isLogin: false });

    sessionStorage.removeItem("jamesAccessToken");
    set({ token: "", id: "", isLogin: false });
  },

  setBabyDueDate: (duedate) => {
    sessionStorage.setItem("babyDueDate", duedate);
    set({ babyDueDate: duedate });
  }
}));
export default useAuthStore;