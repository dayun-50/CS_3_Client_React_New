import { useState, useRef, useEffect } from "react";
import styles from "./ChooseType.module.css";
import babyImg from "./img/baby.png";
import childrenImg from "./img/children.png";
import addImg from "./img/Add.png";

// 최초 로그인 시 임신 / 육아 둘중에 고르는 부분
const ChooseType=()=>{
    const [showNewDiv, setShowNewDiv] = useState(false);      // 임산모 상세 화면
    const [showNewDivTwo, setShowNewDivTwo] = useState(false); // 육아 상세 화면
    const [inputBlocks, setInputBlocks] = useState([{}]); // 입력 블록 관리
    const clickplusRef = useRef(null);

    // 쌍둥이 추가
    const handleAdd = () => {
        setInputBlocks((prev) => [...prev, {}]);
    };

    // 새 블록 추가 시 자동 스크롤
    useEffect(() => {
        if (clickplusRef.current) {
            clickplusRef.current.scrollTop = clickplusRef.current.scrollHeight;
        }
    }, [inputBlocks]);

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

            {/* ★ 1. 기본 선택 화면 */}
            {!showNewDiv && !showNewDivTwo && (
                <>
                    <div className={styles.babymomcheckbox}>
                        <div className={styles.cute}>
                            <h1>임산모</h1>
                            <p>아직 뱃속에 있어요</p>
                            <img src={babyImg} alt="baby" className={styles.babyImage} />
                            <button className={styles.bok} onClick={() => setShowNewDiv(true)}>
                                완료
                            </button>
                        </div>
                    </div>

                    <div className={styles.babycheckbox}>
                        <div className={styles.cutetwo}>
                            <h1>육아</h1>
                            <p>태어났어요</p>
                            <img src={childrenImg} alt="children" className={styles.childrenImage} />
                            <button className={styles.bokk} onClick={() => setShowNewDivTwo(true)}>
                                완료
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* ★ 2. 임산모 화면 */}
            {showNewDiv && !showNewDivTwo && (
                <div
                    style={{
                        width: "580px",
                        height: "660px",
                        backgroundColor: "white",
                        borderRadius: "20px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        boxShadow: "4px 4px 8px -2px rgba(0,0,0,0.25)",
                    }}
                >
                    <div className={styles.babymomclick}>
                        <h1>임산모</h1>
                        <p>출산 예정일과 태명을 입력해 주세요</p>

                        <div className={styles.clickplus} ref={clickplusRef}>
                            {inputBlocks.map((_, idx) => (
                                <div key={idx} style={{ width: "100%" }}>
                                    <div className={styles.buttons}>
                                        <button className={styles.why}>미정?</button>
                                        <button className={styles.man}>남자</button>
                                        <button className={styles.girl}>여자</button>
                                    </div>

                                    <div className={styles.babyparty}>
                                        <label htmlFor={`bp-${idx}`}>출생일</label>
                                        <input type="text" id={`bp-${idx}`} placeholder="출생일" />
                                    </div>

                                    <div className={styles.babyname}>
                                        <label htmlFor={`bn-${idx}`}>이름</label>
                                        <input type="text" id={`bn-${idx}`} placeholder="이름" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.babyplus} onClick={handleAdd}>
                            <img src={addImg} alt="add" className={styles.addImage} />
                            <p className={styles.babyadd}>쌍둥이 추가</p>
                        </div>

                        <div className={styles.bbtt}>
                            <button
                                className={styles.deb}
                                onClick={() => { setShowNewDiv(false); setInputBlocks([{}]); }}
                            >
                                취소
                            </button>
                            <button className={styles.cb}>완료</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ★ 3. 육아 화면 */}
            {showNewDivTwo && !showNewDiv && (
                <div
                    style={{
                        width: "580px",
                        height: "660px",
                        backgroundColor: "white",
                        borderRadius: "20px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        boxShadow: "4px 4px 8px -2px rgba(0,0,0,0.25)",
                    }}
                >
                    <div className={styles.babymomclick}>
                        <h1>육아</h1>
                        <p>출생일과 성별, 이름을 입력해 주세요.</p>

                        <div className={styles.clickplus} ref={clickplusRef}>
                            {inputBlocks.map((_, idx) => (
                                <div key={idx} style={{ width: "100%" }}>
                                    <div className={styles.buttonss}>
                                        <button className={styles.mantwo}>남자</button>
                                        <button className={styles.girltwo}>여자</button>
                                    </div>

                                    <div className={styles.babyparty}>
                                        <label htmlFor={`bp-${idx}`}>출생일</label>
                                        <input type="text" id={`bp-${idx}`} placeholder="출생일" />
                                    </div>

                                    <div className={styles.babyname}>
                                        <label htmlFor={`bn-${idx}`}>이름</label>
                                        <input type="text" id={`bn-${idx}`} placeholder="이름" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.babyplus} onClick={handleAdd}>
                            <img src={addImg} alt="add" className={styles.addImage} />
                            <p className={styles.babyadd}>쌍둥이 추가</p>
                        </div>

                        <div className={styles.bbtt}>
                            <button
                                className={styles.deb}
                                onClick={() => {
                                    setShowNewDivTwo(false);
                                    setInputBlocks([{}]);
                                }}
                            >
                                취소
                            </button>
                            <button className={styles.cb}>완료</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
export default ChooseType;