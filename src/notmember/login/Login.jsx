import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import FindPw from "../findpw/FindPw.jsx";
import FindId from "../findid/FindId.jsx";
import LoginBox from './loginBox/LoginBox.jsx';

//로그인 페이지 /login/*
//혜빈: 최초 로그인 성공한 사람은 아기추가 페이지로 이동 필요 (ChooseType)
const Login = ({alerts, setAlerts})=>{

//회원가입 버튼 클릭하면 " /signup " 으로 이동해주세요 (App.js에서 라우팅해놓음)

return(
    <div>
        <Routes>
            <Route path='' element={ <LoginBox alerts={alerts} setAlerts={setAlerts}/> } /> {/*로그인*/}
            <Route path='findpw' element={ <FindPw /> } /> {/*비번찾기*/}
            <Route path='findid' element={ <FindId /> } /> {/*아이디 찾기*/}
        </Routes>
    </div>
);


}
export default Login;