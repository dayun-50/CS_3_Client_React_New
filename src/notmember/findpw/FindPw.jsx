import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FindPw.module.css";

const FindPw = () => {
  const navigate = useNavigate();
  const [isCompleted, setIsCompleted] = useState(false); // 완료 여부

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
      <div className={styles.idcheckbox}>
        <div className={styles.idcheckboxin}>
          {!isCompleted ? (
            // 완료 전 화면
            <>
              <div className={styles.idtop}>
                <h1 className={styles.title}>비밀번호 찾기</h1>
                <p className={styles.nn}>비밀번호를 잊어버리셨나요?</p>
              </div>

              <div className={styles.idmiddleone}>
                <label htmlFor="ema">이메일</label>
                <input type="text" id="ema" placeholder="이메일" />
                <button className={styles.dlswmd}>인증요청</button>
              </div>

              <div className={styles.idmiddletwo}>
                <label htmlFor="ema">인증확인</label>
                <input type="text" id="ema" placeholder="인증확인" />
              </div>

              <div className={styles.idbottom}>
                <button className={styles.idd} onClick={() => navigate(-1)}>
                  취소
                </button>
                <button
                  className={styles.idok}
                  onClick={() => setIsCompleted(true)}
                >
                  완료
                </button>
              </div>
            </>
          ) : (
            // 완료 후 화면
            <div className={styles.idcheckboxt}>

            <div className={styles.idcheckboxint}>
                
                <div className={styles.idtopt}>
                    <h1 className={styles.titlet}>비밀번호 재설정</h1>
                    <p className={styles.nnt}>비밀번호를 변경해 주세요</p>
                </div>

                <div className={styles.idmiddlet}>
                    <p>새 비밀번호</p>
                    <input type="text" placeholder="비밀번호" className={styles.newpwt} ></input>
                </div>

                <div className={styles.idbottomt}>
                    <button className={styles.iddt} onClick={() => setIsCompleted(false)}>취소</button>
                    <button className={styles.idokt} onClick={() => navigate("/login")}>완료</button>
                </div>

            </div>

      </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindPw;
