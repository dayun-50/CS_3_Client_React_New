import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './notmember/login/Login';
import Signup from './notmember/signup/Signup';
import MainIndex from './notmember/mainIndex/MainIndex';
import ChooseType from "./member/chooseType/ChooseType.jsx";
import InputBaby from "./member/inputBaby/InputBaby";

import useAuthStore from './store/useStore.js';

import { connectWebSocket } from 'common/webSocket/connectWebSocket';
import "./styles/them.css";
import { caxios } from 'config/config';

function AppRoutes() {
  const location = useLocation(); // 현재 경로 감지
  const { login, isLogin, getbabySeq, setBabyDueDate, newAlerts, setNewAlerts } = useAuthStore((state) => state);
  const [alerts, setAlerts] = useState([]);
  // const [newAlerts, setNewAlerts] = useState(false);

  // 경로 변화 감지
  useEffect(() => {
    if (!isLogin) return;
    const paths = ["/board", "/mypage", "/babymypage", "/checklist", "/chart", "/diary"];
    console.log("현재 path:", location.pathname);
    if (paths.some(path => location.pathname.startsWith(path))) {
      caxios.post("/dashCart", { path: location.pathname })
        .catch(err => console.log(err));
    }
  }, [location, isLogin]);

  // WebSocket & 토큰 처리
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const id = sessionStorage.getItem("id");
    const babySeq = sessionStorage.getItem("babySeq");
    const babyDueDate = sessionStorage.getItem("babyDueDate");

    if (token) {
      login(token, id);
      getbabySeq(babySeq);
      setBabyDueDate(babyDueDate);

      connectWebSocket(token, id, (alert) => {
        let message = "";
        if (alert.type === "C") {
          message = alert.comment_seq && alert.comment_seq !== "null"
            ? "댓글에 댓글이 입력되었습니다."
            : "게시물에 댓글이 입력되었습니다.";
        } else {
          message = alert.comment_seq && alert.comment_seq !== "null"
            ? "댓글이 관리자에 의해 삭제되었습니다."
            : "게시물이 관리자에 의해 삭제되었습니다.";
        }

        const processedAlert = { ...alert, message };

        setAlerts(prev => {
          const exists = prev.some(a => a.alarm_seq === alert.alarm_seq);
          if (exists) return prev;
          return [processedAlert, ...prev];
        });
        setNewAlerts(true);
      });
    }
  }, [isLogin]);

  useEffect(() => {
    if (alerts.length == 0) {
      setNewAlerts(false);
    }
  }, [alerts]);

  return (
    <Routes>
      <Route path='/login/*' element={<Login alerts={alerts} setAlerts={setAlerts} />} />
      <Route path='/signup/*' element={<Signup />} />
      <Route path="/chooseType" element={<ChooseType />} />
      <Route path='/*' element={<MainIndex isLogin={isLogin} alerts={alerts} setAlerts={setAlerts} />} />
      <Route path="input-baby" element={<InputBaby />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
