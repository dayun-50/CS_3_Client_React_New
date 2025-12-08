import { useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";
import { useState } from "react";
import useSignup from "./UseSignup";

function Signup() {
  const navigate = useNavigate();

  const {
    data,
    regexAuth,
    inputCount,
    isNoCode,
    todayString,
    chackClick,
    emailAuthClick,
    handleComplete,
    handleLoginKeyUp,
    hendleChange,
    handleIntegerInput,
    handleCheckbox,
  } = useSignup(navigate);

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
      <div className={styles.membershipbox}>
        <div className={styles.mbsinbox}>
          <div className={styles.h1h1}>
            <h1 className={styles.newusertitle}>회원가입</h1>
          </div>

          {/* 이메일 */}
          <div className={styles.newemail}>
            <label htmlFor="email">이메일</label>
            <div className={styles.inputButtonWrapper}>
              <input
                name="email"
                id="email"
                type="email"
                placeholder="이메일"
                value={data.email}
                className={`${styles.inputError} ${
                  !regexAuth.email && inputCount.email > 0
                    ? styles.borderRegex
                    : ""
                }`}
                onChange={hendleChange}
              />
              <button className={styles.emailauth} onClick={emailAuthClick}>
                이메일 인증
              </button>
            </div>
          </div>

          {/* 인증번호 */}
          <div className={styles.emailing}>
            <label htmlFor="emailAuth">인증번호</label>
            <input
              id="emailAuth"
              name="emailAuth"
              type="text"
              placeholder="인증번호"
              value={data.emailAuth}
              className={`${styles.inputError} ${
                !regexAuth.emailAuth && inputCount.emailAuth > 0
                  ? styles.borderRegex
                  : ""
              }`}
              onChange={hendleChange}
              onPaste={hendleChange}
            />
            <br />
          </div>

          {/* 아이디 */}
          <div className={styles.newid}>
            <label htmlFor="id">아이디</label>
            <div className={styles.inputButtonWrapper}>
              <input
                id="id"
                type="text"
                placeholder="소문자 + 숫자 5글자 이상"
                name="id"
                value={data.id}
                className={`${styles.inputError} ${
                  !regexAuth.id && inputCount.id > 0 ? styles.borderRegex : ""
                }`}
                onChange={hendleChange}
              />
              <button className={styles.idauth} name="idChack" onClick={chackClick}>
                중복확인
              </button>
            </div>
          </div>

          {/* 닉네임 */}
          <div className={styles.newnic}>
            <label htmlFor="nickname">닉네임</label>
            <div className={styles.inputButtonWrapper}>
              <input
                id="nickname"
                type="text"
                placeholder="한글 2글자 이상"
                name="nickname"
                value={data.nickname}
                className={`${styles.inputError} ${
                  !regexAuth.nickname && inputCount.nickname > 0
                    ? styles.borderRegex
                    : ""
                }`}
                onChange={hendleChange}
              />
              <button className={styles.nicauth} name="nicknameChack" onClick={chackClick}>
                중복확인
              </button>
            </div>
          </div>

          {/* 비밀번호 */}
          <div className={styles.pwing}>
            <label htmlFor="pw">비밀번호</label>
            <input
              id="pw"
              type="password"
              placeholder="최소 6글자 이상"
              name="pw"
              value={data.pw}
              className={`${styles.inputError} ${
                !regexAuth.pw && inputCount.pw > 0 ? styles.borderRegex : ""
              }`}
              onChange={hendleChange}
            />
            <br />
          </div>

          {/* 연락처 */}
          <div className={styles.phone}>
            <label htmlFor="phone1">연락처</label>
            <div className={styles.phoneWrapper}>
              <span className={styles.prefix}>010 -</span>
              <input
                id="phone1"
                type="text"
                name="phone1"
                value={data.phone1}
                placeholder="연락처"
                className={`${styles.inputError} ${
                  !regexAuth.phone1 && inputCount.phone1 > 0
                    ? styles.borderRegex
                    : ""
                }`}
                maxLength={4}
                onBeforeInput={handleIntegerInput}
                onChange={hendleChange}
              />
              <span className={styles.dash}>-</span>
              <input
                id="phone2"
                type="text"
                name="phone2"
                value={data.phone2}
                placeholder="연락처"
                className={`${styles.inputError} ${
                  !regexAuth.phone2 && inputCount.phone2 > 0
                    ? styles.borderRegex
                    : ""
                }`}
                maxLength={4}
                onBeforeInput={handleIntegerInput}
                onChange={hendleChange}
              />
            </div>
          </div>

          {/* 생년월일 */}
          <div className={styles.birthing}>
            <label htmlFor="birthDate">생년월일</label>
            <input
              id="birthDate"
              type="date"
              name="birthDate"
              value={data.birthDate}
              placeholder="생년월일"
              className={`${styles.inputError} ${
                !regexAuth.birthDate && inputCount.birthDate > 0
                  ? styles.borderRegex
                  : ""
              }`}
              onChange={hendleChange}
              max={todayString}
            />
            <br />
          </div>

          {/* 가족 코드 + 부모 선택 */}
          <div className={styles.checkAndParent}>
            <div className={styles.familying}>
              <label htmlFor="code">가족코드</label>
              <input
                id="code"
                type="text"
                name="code"
                value={data.code}
                placeholder="존재하지 않을 경우 아래 체크"
                maxLength={5}
                className={`${styles.inputError} ${
                  !regexAuth.code && inputCount.code > 0
                    ? styles.borderRegex
                    : ""
                } ${isNoCode ? styles.noCode : ""}`}
                onChange={hendleChange}
                disabled={isNoCode}
              />
            </div>

            <div className={styles.parent}>
              <h1 className={styles.me}>본인</h1>
              <div className={styles.parentLabels}>
                <label>
                  <input
                    type="radio"
                    name="parentType"
                    value="father"
                    className={styles.papa}
                    onChange={hendleChange}
                  />
                  아빠
                </label>
                <label>
                  <input
                    type="radio"
                    name="parentType"
                    value="mother"
                    className={styles.papa}
                    onChange={hendleChange}
                  />
                  엄마
                </label>
              </div>
            </div>
          </div>

          {/* 체크박스 */}
          <div className={styles.okcheck}>
            <label className={`${styles.checkboxLabel} ${styles.true}`}>
              <input id="checkbox" type="checkbox" onClick={handleCheckbox} />
              가족 코드가 없을 경우 체크해 주세요
            </label>
          </div>

          {/* 완료/취소 버튼 */}
          <div className={styles.buttonGroup}>
            <button className={styles.backbutton} onClick={() => navigate(-1)}>
              취소
            </button>
            <button className={styles.signinbutton} onClick={handleComplete}>
              완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
