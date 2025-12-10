import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import FindPw from "../findpw/FindPw.jsx";
import FindId from "../findid/FindId.jsx";
import LoginBox from './loginBox/LoginBox.jsx';

const Login = ()=>{


return(
    <div>
        <Routes>
            <Route path='' element={ <LoginBox /> } /> 
            <Route path='findpw' element={ <FindPw /> } /> 
            <Route path='findid' element={ <FindId /> } /> 
        </Routes>
    </div>
);


}
export default Login;