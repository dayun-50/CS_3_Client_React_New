
import { create } from "zustand";

const useAuthStore = create((set) => ({
  token: "",
  id: "",
  isLogin: false,
  babySeq: 0,
  babyDueDate: 0,
  newAlerts: false,

  setNewAlerts: (resp) => set({ newAlerts: resp }),
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
    sessionStorage.removeItem("babySeq");
    sessionStorage.removeItem("babyDueDate");
    set({ token: "", id: "", isLogin: false, babySeq: 0, babyDueDate: 0 });

  },

  setBabyDueDate: (duedate) => {
    sessionStorage.setItem("babyDueDate", duedate);
    set({ babyDueDate: duedate });
  }
}));
export default useAuthStore;