import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./LoginBox.module.css";
import FindId from "../../findid/FindId";
import FindPw from "../../findpw/FindPw";

function LoginBox() {


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
              <input type="text" id="iid" placeholder="아이디" ></input>  
            </div>
            <div className={styles.middletwo}>
              <label htmlFor="ppw">비밀번호</label> 
              <input type="password" id="ppw" placeholder="비밀번호" ></input>  
            </div>
          </div>

          <div className={styles.loginbottom}>
            <button className={styles.logbut} >로그인</button>
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
