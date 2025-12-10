import { useState } from "react";
import styles from "./Mypage.module.css";
import useMypage from "./UseMypage";
import { motion } from "framer-motion";

const Mypage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const {
    data,
    regexAuth,
    inputCount,
    hendleChange,
    chackClick,
    emailAuthClick,
    handleComplete,
  } = useMypage(isEditing, setIsEditing);
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.parentpage}>
        <div className={styles.info}>
          <h1 className={styles.title}>회원정보</h1>
          <div className={styles.main}>
            <p className={styles.id}>아이디</p>
            <div className={styles.dbid}>{data.user_id}</div>

            <div className={styles.nick}>
              <label htmlFor="nic">닉네임</label>
              {isEditing ? (
                <div className={styles.inputWithButton}>
                  <input
                    type="text"
                    id="nic"
                    name="nickname"
                    value={data.nickname}
                    onChange={hendleChange}
                    className={`${styles.editableInputHalf}
                     ${!regexAuth.nickname ||
                        (!regexAuth.nickNameChack &&
                          !regexAuth.nickNameChack &&
                          inputCount.nickname > 0)
                        ? styles.auth
                        : ""
                      }`}
                  />
                  <button className={styles.checkButton} onClick={chackClick}>
                    중복확인
                  </button>
                </div>
              ) : (
                <div className={styles.dbValue}>{data.nickname}</div>
              )}
            </div>

            <div className={styles.email}>
              <label htmlFor="email">이메일</label>
              {isEditing ? (
                <>
                  <div className={styles.inputWithButton}>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      onChange={hendleChange}
                      value={data.email}
                      className={`${styles.editableInputHalf}
                     ${!regexAuth.email && inputCount.email > 0
                          ? styles.auth
                          : ""
                        }`}
                    />
                    <button
                      className={styles.duplicationButton}
                      onClick={emailAuthClick}
                    >
                      이메일 인증
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="인증 코드 입력"
                    name="emailAuth"
                    onChange={hendleChange}
                    className={`${styles.verificationInput}
                     ${!regexAuth.emailAuth && inputCount.emailAuth > 0
                        ? styles.auth
                        : ""
                      }`}
                  />
                </>
              ) : (
                <div className={styles.dbValue}>{data.email}</div>
              )}
            </div>

            <p className={styles.birthday}>생일</p>
            <div className={styles.dbbirth}>{data.birth_date}</div>

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
                      value={data.phone1}
                      name="phone1"
                      onChange={hendleChange}
                      maxLength={4}
                      className={`${styles.phone123}
                     ${!regexAuth.phone1 && inputCount.phone1 > 0
                          ? styles.auth
                          : ""
                        }`}
                    />
                    <span className={styles.dash}>-</span>
                    <input
                      id="phone2"
                      type="tel"
                      name="phone2"
                      onChange={hendleChange}
                      maxLength={4}
                      value={data.phone2}
                      className={`${styles.phone456}
                     ${!regexAuth.phone2 && inputCount.phone2 > 0
                          ? styles.auth
                          : ""
                        }`}
                    />
                  </>
                ) : (
                  <>
                    <div className={styles.dbPhone}>{data.phone1}</div>
                    <span className={styles.dash}>-</span>
                    <div className={styles.dbPhone}>{data.phone2}</div>
                  </>
                )}
              </div>
            </div>
            <div className={styles.fabt}>
              <p className={styles.familycode}>가족코드</p>
              <div className={styles.familywhy}>{data.family_code}</div>
            </div>
          </div>
        </div>

        <div className={styles.btwo}>
          {isEditing ? (
            <>
              <button
                className={styles.delete}
                onClick={() => setIsEditing(false)}
              >
                취소
              </button>
              <button className={styles.success} onClick={handleComplete}>
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
    </motion.div>
  );
};

export default Mypage;
