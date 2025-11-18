import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FindId.module.css";

const FindId = () => {
  const navigate = useNavigate();

  // 완료 버튼 클릭 여부 상태
  const [isCompleted, setIsCompleted] = useState(false);

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
                <h1 className={styles.title}>아이디 찾기</h1>
                <p className={styles.nn}>아이디를 잊어버리셨나요?</p>
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
                <button className={styles.idd} onClick={() => navigate(-1)}>취소</button>
                <button className={styles.idok} onClick={() => setIsCompleted(true)}>완료</button>
              </div>
            </>
          ) : (
            // 완료 후 화면
            <div className={styles.idcheckboxt}>
                <div className={styles.idcheckboxintwo}>
                    
                    <div className={styles.idtoptwo}>
                        <h1 className={styles.titletwo}>아이디</h1>
                        <p className={styles.nnt}>아이디를 확인해주세요</p>
                    </div>

                    <div className={styles.idmiddlet}>
                        <p>아이디</p>
                        <div className={styles.idvaluet}>여기에는 아이디DB에 있는거 보여주기</div>
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

export default FindId;
