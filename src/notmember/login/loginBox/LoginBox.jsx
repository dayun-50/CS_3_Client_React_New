import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./LoginBox.module.css";
import FindId from "../../findid/FindId";
import FindPw from "../../findpw/FindPw";

function LoginBox() {
  const navigate = useNavigate(); // navigate 훅 추가
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState({ id: false, pw: false });

  const handleLogin = () => {
    setError({ id: !id, pw: !pw });
    if (id && pw) {
      // 로그인 성공 시 ChooseType으로 이동
      navigate("/chooseType"); // App.js에서 라우팅 필요
    }
  };

  return (
    <div
      className={styles.container}
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#FFF4D6",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className={styles.loginbox}>
        <div className={styles.logininbox}>

          <div className={styles.logintop}>
            <h1 className={styles.toptitle}>환영합니다!</h1>
          </div>

          <div className={styles.loginmiddle}>
            <div className={styles.middleone}>
              <label htmlFor="iid" >아이디</label>
              <input type="text" id="iid" placeholder="아이디" value={id} onChange={(e) => setId(e.target.value)}></input>  
            </div>
            <div className={styles.middletwo}>
              <label htmlFor="ppw">비밀번호</label> 
              <input type="text" id="ppw" placeholder="비밀번호" value={pw} onChange={(e) => setPw(e.target.value)}></input>  
            </div>
          </div>

          <div className={styles.loginbottom}>
            <button className={styles.logbut} onClick={handleLogin}>로그인</button>
          </div>

          <p className={styles.signup}>
            회원이 아니신가요? <Link to="/signup">회원가입</Link>
          </p>

          <Link to="findid" className={styles.changelog}>
            아이디 찾기
          </Link>
          <Link to="findpw" className={styles.changepw}>
            비밀번호 찾기
          </Link>

        </div>
      </div>
    </div>
  );
}

export default LoginBox;
