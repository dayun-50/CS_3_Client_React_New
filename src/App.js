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

function App() {
  const { login, isLogin, getbabySeq, setBabyDueDate } = useAuthStore((state) => state);
  console.log("adsf", isLogin);

  useEffect(() => {
    // 토큰 유지
    const token = sessionStorage.getItem("token");
    const id = sessionStorage.getItem("id");
    const babySeq = sessionStorage.getItem("babySeq");
    const babyDueDate = sessionStorage.getItem("babyDueDate");
    if (token) {
      login(token, id);
      getbabySeq(babySeq);
      setBabyDueDate(babyDueDate);
    }
  }, []);

  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route path='/login/*' element={<Login />} /> {/*여기서 로그인페이지, 비번찾기, 아이디 찾기 페이지 추가 라우팅됨*/}
          <Route path='/signup/*' element={<Signup />} /> {/*회원가입*/}
          <Route path="/chooseType" element={<ChooseType />} /> {/*로그인 성공 하면 ChooseType 애기선택*/}
          <Route path='/*' element={<MainIndex isLogin={isLogin} />} /> {/*탑바 + 바디있는 곳으로 이동*/}
          <Route path="input-baby" element={<InputBaby />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
