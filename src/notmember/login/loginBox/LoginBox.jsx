import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./LoginBox.module.css";
import FindId from "../../findid/FindId";
import FindPw from "../../findpw/FindPw";
import useLoginBox from "./UseLoginBox";

function LoginBox({alerts, setAlerts}) {

  const {
    data, authAlert, handleChange, handleComplete, handleLoginKeyUp
  } = useLoginBox(alerts, setAlerts);

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
            <div className={`${styles.middleone} ${!authAlert ? "" : styles.alert }`}>
              <label htmlFor="id" >아이디</label>
              <input type="text" id="id" name="id" placeholder="아이디"
              value={data.id} onChange={handleChange}/>
            </div>
            <div className={`${styles.middletwo} ${!authAlert ? "" : styles.alert }`}>
              <label htmlFor="pw">비밀번호</label> 
              <input type="password" id="pw" name="pw" placeholder="비밀번호"
              value={data.pw} onChange={handleChange} onKeyUp={handleLoginKeyUp}/>

            </div>
          </div>

          <div className={styles.loginbottom}>
            <button className={styles.logbut}
            onClick={handleComplete}>
              로그인</button>

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
