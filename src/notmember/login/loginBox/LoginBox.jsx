import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./LoginBox.module.css";
import FindId from "../../findid/FindId";
import FindPw from "../../findpw/FindPw";
import useLoginBox from "./UseLoginBox";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function LoginBox({ setBabySeq, setAlerts }) {
  const { data, authAlert, handleChange, handleComplete, handleLoginKeyUp } =
    useLoginBox(setBabySeq, setAlerts);

  const navigator = useNavigate();
  const handleBack = () => {
    navigator("/");
  };

  const [showPw, setShowPw] = useState(false);

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
            <div
              className={`${styles.middleone} ${!authAlert ? "" : styles.alert
                }`}
            >
              <label htmlFor="id">아이디</label>
              <input
                type="text"
                id="id"
                name="id"
                placeholder="아이디"
                value={data.id}
                onChange={handleChange}
              />
            </div>
            <div
              className={`${styles.middletwo} ${!authAlert ? "" : styles.alert}`}
              style={{ position: "relative", display: "flex", alignItems: "center" }}
            >
              <input
                type={showPw ? "text" : "password"}
                id="pw"
                name="pw"
                placeholder="비밀번호"
                value={data.pw}
                onChange={handleChange}
                onKeyUp={handleLoginKeyUp}
                style={{ flex: 1, paddingRight: "40px", borderRadius: "20px", border: "1px solid #ccc" }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{
                  position: "absolute",
                  right: "10px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  fontSize: "20px",
                  color: "#b0b0b0"  // ← 여기에 색상 적용
                }}
              >
                {showPw ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </button>
            </div>

          </div>

          <div className={styles.loginbottom}>
            <button className={styles.back} onClick={handleBack}>
              뒤로가기
            </button>
            <button className={styles.logbut} onClick={handleComplete}>
              로그인
            </button>
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
