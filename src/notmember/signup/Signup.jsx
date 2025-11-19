import { useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";
import { useState } from "react";
import useSignup from "./UseSignup";

function Signup() {

    const navigate = useNavigate();

    const {
        data, regexAuth, inputCount, isNoCode,
        chackClick, emailAuthClick, handleComplete,
        hendleChange, handleIntegerInput, handleCheckbox
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

                    <div className={styles.newemail}>
                        <label htmlFor="email">이메일</label>
                        <div className={styles.inputButtonWrapper}>
                            <input
                                name="email"
                                id="email"
                                type="email"
                                placeholder="이메일"
                                value={data.email}
                                className={`${styles.inputError} ${!regexAuth.email && inputCount.email > 0 ? styles.borderRegex : ""}`}
                                onChange={hendleChange}
                            />
                            <button className={styles.emailauth}
                                onClick={emailAuthClick}>
                                이메일 인증</button>
                        </div>
                    </div>

                    <div className={styles.emailing}>
                        <label htmlFor="emailAuth">인증번호</label>
                        <input
                            id="emailAuth"
                            name="emailAuth"
                            type="text"
                            placeholder="인증번호"
                            value={data.emailAuth}
                            className={`${styles.inputError} ${!regexAuth.emailAuth && inputCount.emailAuth > 0 ? styles.borderRegex : ""}`}
                            onChange={hendleChange}
                            onPaste={hendleChange}
                        /> <br />
                    </div>

                    <div className={styles.newid}>
                        <label htmlFor="id">아이디</label>
                        <div className={styles.inputButtonWrapper}>
                            <input
                                id="id"
                                type="text"
                                placeholder="아이디"
                                name="id"
                                value={data.id}
                                className={`${styles.inputError} ${!regexAuth.id && inputCount.id > 0 ? styles.borderRegex : ""}`}
                                onChange={hendleChange}
                            />
                            <button className={styles.idauth} name="idChack"
                                onClick={chackClick}>
                                중복확인</button>
                        </div>
                    </div>

                    <div className={styles.newnic}>
                        <label htmlFor="nickName">닉네임</label>
                        <div className={styles.inputButtonWrapper}>
                            <input
                                id="nickName"
                                type="text"
                                placeholder="닉네임"
                                name="nickName"
                                value={data.nickName}
                                className={`${styles.inputError} ${!regexAuth.nickName && inputCount.nickName > 0 ? styles.borderRegex : ""}`}
                                onChange={hendleChange}
                            />
                            <button className={styles.nicauth} name="nickNameChack"
                                onClick={chackClick}>
                                중복확인</button>
                        </div>
                    </div>

                    <div className={styles.pwing}>
                        <label htmlFor="pw">비밀번호</label>
                        <input
                            id="pw"
                            type="password"
                            placeholder="비밀번호"
                            name="pw"
                            value={data.pw}
                            className={`${styles.inputError} ${!regexAuth.pw && inputCount.pw > 0 ? styles.borderRegex : ""}`}
                            onChange={hendleChange}
                        /> <br />
                    </div>

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
                                className={`${styles.inputError} ${!regexAuth.phone1 && inputCount.phone1 > 0 ? styles.borderRegex : ""}`}
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
                                className={`${styles.inputError} ${!regexAuth.phone2 && inputCount.phone2 > 0 ? styles.borderRegex : ""}`}
                                maxLength={4}
                                onBeforeInput={handleIntegerInput}
                                onChange={hendleChange}
                            />
                        </div>
                    </div>
                    <div className={styles.parent}>
                        <label>
                            <input type="radio" name="parentType" value="father" className={styles.papa} onChange={hendleChange} /> 아빠
                        </label>
                        <label>
                            <input type="radio" name="parentType" value="mother" className={styles.papa} onChange={hendleChange} /> 엄마
                        </label>
                    </div>

                    <div className={styles.birthing}>
                        <label htmlFor="birthDate">생년월일</label>
                        <input
                            id="birthDate"
                            type="date"
                            name="birthDate"
                            value={data.birthDate}
                            placeholder="생년월일"
                            className={`${styles.inputError} ${!regexAuth.birthDate && inputCount.birthDate > 0 ? styles.borderRegex : ""}`}
                            onChange={hendleChange}
                        /> <br />
                    </div>

                    <div className={styles.familying}>
                        <label htmlFor="code">가족코드</label>
                        <input
                            id="code"
                            type="text"
                            name="code"
                            value={data.code}
                            placeholder="가족코드"
                            maxLength={5}
                            className={`${styles.inputError} ${!regexAuth.code && inputCount.code > 0 ? styles.borderRegex : ""}
                            ${isNoCode ? styles.noCode : ""}`}
                            onChange={hendleChange}
                            disabled={isNoCode}
                        /> <br />
                    </div>

                    <div className={styles.okcheck}>
                        <label className={`${styles.checkboxLabel} ${styles.true}`}>
                            <input id="checkbox" type="checkbox" 
                            onClick={handleCheckbox}/> 
                            가족 코드가 없을 경우 체크해 주세요
                        </label>
                    </div>

                    <div className={styles.buttonGroup}>
                        <button className={styles.backbutton} onClick={() => navigate(-1)}>취소</button>
                        <button className={styles.signinbutton} onClick={handleComplete}>완료</button>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default Signup;