import { useState } from "react";
import styles from "./Mypage.module.css";
import useMypage from "./UseMypage";
const Mypage = () => {
  const [isEditing, setIsEditing] = useState(false); // 수정 상태변수

  const { data } = useMypage();

  return (
    <div className={styles.container}>
      <div className={styles.parentpage}>
        {/* 회원정보 + 가족코드 통합 */}
        <div className={styles.info}>
          <h1 className={styles.title}>회원정보</h1>
          <div className={styles.main}>
            {/* 아이디 */}
            <p className={styles.id}>아이디</p>
            <div className={styles.dbid}>DB에서 가져올 ID값</div>

            {/* 닉네임 */}
            <div className={styles.nick}>
              <label htmlFor="nic">닉네임</label>
              {isEditing ? (
                <div className={styles.inputWithButton}>
                  <input
                    type="text"
                    id="nic"
                    placeholder="맘마미아"
                    className={styles.editableInputHalf}
                  />
                  <button
                    className={styles.checkButton}
                    onClick={() => alert("닉네임 저장 로직")}
                  >
                    중복확인
                  </button>
                </div>
              ) : (
                <div className={styles.dbValue}>맘마미아</div>
              )}
            </div>

            {/* 이메일 */}
            <div className={styles.email}>
              <label htmlFor="email">이메일</label>
              {isEditing ? (
                <>
                  <div className={styles.inputWithButton}>
                    <input
                      type="email"
                      id="email"
                      placeholder="mosque@gmail.com"
                      className={styles.emailtableInputHalf}
                    />
                    <button
                      className={styles.duplicationButton}
                      onClick={() => alert("이메일 인증 요청")}
                    >
                      이메일 인증
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="인증 코드 입력"
                    className={styles.verificationInput}
                  />
                </>
              ) : (
                <div className={styles.dbValue}>mosque@gmail.com</div>
              )}
            </div>

            {/* 생일 */}
            <p className={styles.birthday}>생일</p>
            <div className={styles.dbbirth}>♥ DB에서 가져올 생일 ♥</div>

            {/* 전화번호 */}
            <div className={styles.phone}>
              <label htmlFor="phone">연락처</label>
              <div className={styles.phoneWrapper}>
                <span
                  className={isEditing ? styles.prefixActive : styles.prefix}
                >
                  010
                </span>
                <span className={styles.dash}>-</span>
                {isEditing ? (
                  <>
                    <input
                      id="phone1"
                      type="tel"
                      placeholder="연락처"
                      className={styles.editableInput}
                    />
                    <span className={styles.dash}>-</span>
                    <input
                      id="phone2"
                      type="tel"
                      placeholder="연락처"
                      className={styles.editableInput}
                    />
                  </>
                ) : (
                  <>
                    <div
                      className={styles.dbValue}
                      style={{ height: "48px", lineHeight: "48px" }}
                    >
                      1234
                    </div>
                    <span className={styles.dash}>-</span>
                    <div
                      className={styles.dbValue}
                      style={{ height: "48px", lineHeight: "48px" }}
                    >
                      5678
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 가족 코드 */}
            <div className={styles.fabt}>
              <p className={styles.familycode}>가족코드</p>
              <div className={styles.familywhy}>뭐가 오겠지 뭐</div>
            </div>
          </div>
        </div>

        {/* 수정/취소/완료 버튼만 따로 아래 */}
        <div className={styles.btwo}>
          {isEditing ? (
            <>
              <button
                className={styles.delete}
                onClick={() => setIsEditing(false)}
              >
                취소
              </button>
              <button
                className={styles.success}
                onClick={() => setIsEditing(false)}
              >
                완료
              </button>
            </>
          ) : (
            <button className={styles.crbt} onClick={() => setIsEditing(true)}>
              수정
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mypage;
