import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import Login from './notmember/login/Login';
import Signup from './notmember/signup/Signup';
import MainIndex from './notmember/mainIndex/MainIndex';
import ChooseType from "./member/chooseType/ChooseType.jsx";

function App() {
  // TODO: 로그인 하면 true로 바뀌도록 설정 필요
  const [isLogin, setIsLogin] = useState(false); 

  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route path='/login/*' element={ <Login /> } /> {/*여기서 로그인페이지, 비번찾기, 아이디 찾기 페이지 추가 라우팅됨*/}
          <Route path='/signup/*' element={ <Signup /> } /> {/*회원가입*/}
          <Route path="/chooseType" element={<ChooseType />} /> {/*로그인 성공 하면 ChooseType 애기선택*/}
          <Route path='/*' element={<MainIndex isLogin={isLogin} />} /> {/*탑바 + 바디있는 곳으로 이동*/}

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
