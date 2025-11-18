import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import styles from "./Mypage.module.css";

//부모마이페이지 정보
const Mypage = () => {
    return (
        <div className={styles.container}>
            <div className={styles.parentpage}>
                <div className={styles.info}>
                    <h1 className={styles.title}>회원정보</h1>

                    <div className={styles.main}>
                        <p className={styles.id}>아이디</p>
                        <div className={styles.dbid}>DB에서 가져올 ID값</div>

                        <div className={styles.nick}>
                            <label htmlFor='nic'>닉네임</label>
                            <input type="text" id="nic" placeholder='맘마미아'></input>
                        </div>

                        <div className={styles.email}>
                            <label htmlFor='email'>이메일</label>
                            <input type="email" id="email" placeholder='mosquegmail.com'></input>
                        </div>

                        <p className={styles.birthday}>생일</p>
                        <div className={styles.dbbirth}>♥ DB에서 가져올 생일 ♥</div>

                        <div className={styles.phone}>
                        <label htmlFor="phone">연락처</label>
                        <div className={styles.phoneWrapper}>
                            <span className={styles.prefix}>010</span>
                            <span className={styles.dash}>-</span>
                            <input 
                                id="phone1" 
                                type="tel" 
                                placeholder="연락처" 
                                className={styles.inputError}
                                />
                            <span className={styles.dash}>-</span>
                            <input 
                                id="phone2" 
                                type="tel" 
                                placeholder="연락처" 
                                className={styles.inputError}
                                />
                        </div>
                    </div>
                    </div>
                </div>

                <div className={styles.fabt}>
                    <p className={styles.familycode}>가족코드</p>
                    <div className={styles.familywhy}>뭐가 오겠지 뭐</div>
                    
                    <div className={styles.btwo}>
                        <button className={styles.delete}>취소</button>
                        <button className={styles.success}>완료</button>
                    </div>
                </div>
            </div>
        </div>
    );


}
export default Mypage;
