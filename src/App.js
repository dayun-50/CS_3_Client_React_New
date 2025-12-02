import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './notmember/login/Login';
import Signup from './notmember/signup/Signup';
import MainIndex from './notmember/mainIndex/MainIndex';
import ChooseType from "./member/chooseType/ChooseType.jsx";
import useAuthStore from './store/useStore.js';
import InputBaby from "./member/inputBaby/InputBaby";
import { connectWebSocket } from 'common/webSocket/connectWebSocket';
import "./styles/them.css";


function App() {
  const { login, isLogin, getbabySeq, setBabyDueDate } = useAuthStore((state) => state);
  console.log("adsf", isLogin);
  const [alerts, setAlerts] = useState([]);
  const [newAlerts, setNewAlerts] = useState(false);

  useEffect(() => {
    if (alerts.length > 0) {
      setNewAlerts(true);
    }
  }, [alerts])

  useEffect(() => {
    console.log(alerts);
    // 토큰 유지
    const token = sessionStorage.getItem("token");
    const id = sessionStorage.getItem("id");
    const babySeq = sessionStorage.getItem("babySeq");
    const babyDueDate = sessionStorage.getItem("babyDueDate");
    if (token) {
      login(token, id);
      getbabySeq(babySeq);
      setBabyDueDate(babyDueDate);
      connectWebSocket(token, id, (alert) => {
        console.log('알람 수신:', alert);

        // message 결정
        let message = "";
        if (alert.type === "C") {
          // comment_seq가 존재하고 "null"이 아닌 경우 댓글
          if (alert.comment_seq && alert.comment_seq !== "null") {
            message = "댓글에 댓글이 입력되었습니다.";
          } else {
            message = "게시물에 댓글이 입력되었습니다.";
          }
        } else {
          if (alert.comment_seq && alert.comment_seq !== "null") {
            message = "댓글이 관리자에 의해 삭제되었습니다.";
          } else {
            message = "게시물이 관리자에 의해 삭제되었습니다.";
          }
        }

        // 객체 생성
        const processedAlert = {
          ...alert,
          message
        };

        setAlerts(prev => {
          // 같은 alarm_seq가 이미 존재하는지 확인
          const exists = prev.some(a => a.alarm_seq === alert.alarm_seq);
          if (exists) return prev; // 이미 있으면 그대로
          return [processedAlert, ...prev]; // 없으면 추가
        });
      });
    }
  }, []);

  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route path='/login/*' element={<Login setAlerts={setAlerts} />} /> {/*여기서 로그인페이지, 비번찾기, 아이디 찾기 페이지 추가 라우팅됨*/}
          <Route path='/signup/*' element={<Signup />} /> {/*회원가입*/}
          <Route path="/chooseType" element={<ChooseType />} /> {/*로그인 성공 하면 ChooseType 애기선택*/}
          <Route path='/*' element={<MainIndex isLogin={isLogin} alerts={alerts} setAlerts={setAlerts} newAlerts={newAlerts} setNewAlerts={setNewAlerts} />} /> {/*탑바 + 바디있는 곳으로 이동*/}
          <Route path="input-baby" element={<InputBaby />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
