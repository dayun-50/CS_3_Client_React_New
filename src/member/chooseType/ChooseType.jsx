import { useState, useRef, useEffect } from "react";
import styles from "./ChooseType.module.css";
import babyImg from "./img/baby.png";
import childrenImg from "./img/children.png";
import addImg from "./img/Add.png";
import oneImg from "./img/one.png";
import twoImg from "./img/two.png";
import threeImg from "./img/three.png";
import fourImg from "./img/four.png";

// 최초 로그인 시 임신 / 육아 둘중에 고르는 부분
const ChooseType = () => {
    const [showNewDiv, setShowNewDiv] = useState(false);      // 임산모 상세 화면
    const [showNewDivTwo, setShowNewDivTwo] = useState(false); // 육아 상세 화면
    const [inputBlocks, setInputBlocks] = useState([{}]); // 입력 블록 관리
    const clickplusRef = useRef(null);

    const [hover, setHover] = useState(false); // hover 상태

    const [hoverTwo, setHoverTwo] = useState(false); // hover 상태

    const [selectedGender, setSelectedGender] = useState(""); // "", "미정", "남자", "여자"

    // 성별 선택 상태
    const [genderSelected, setGenderSelected] = useState(""); // "", "남자", "여자"

    const [selectedBabyMom, setSelectedBabyMom] = useState(""); // 애기 선택 임산부
    const [selectedBabyChild, setSelectedBabyChild] = useState(""); // 애기 선택 육아
    // 쌍둥이 추가
    const handleAdd = () => {
        if (inputBlocks.length < 3) {
            setInputBlocks((prev) => [...prev, {}]);
        }
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
                    <div className={`${styles.babymomcheckbox} ${hover ? styles.hoverBorder : ""}`}>
                        <div className={styles.cute}>
                            <h1 className={hover ? styles.hoverTitle : ""}>임산모</h1>
                            <p>아직 뱃속에 있어요</p>
                            <img src={babyImg} alt="baby" className={styles.babyImage} />
                            <button
                                className={styles.bok}
                                onMouseEnter={() => setHover(true)}
                                onMouseLeave={() => setHover(false)}
                                onClick={() => setShowNewDiv(true)}
                            >
                                선택
                            </button>
                        </div>
                    </div>

                    <div className={`${styles.babycheckbox} ${hoverTwo ? styles.hoverBorder : ""}`}>
                        <div className={styles.cutetwo}>
                            <h1 className={hoverTwo ? styles.hoverTitleTwo : ""}>육아</h1>
                            <p>태어났어요</p>
                            <img src={childrenImg} alt="children" className={styles.childrenImage} />
                            <button
                                className={styles.bokk}
                                onMouseEnter={() => setHoverTwo(true)}
                                onMouseLeave={() => setHoverTwo(false)}
                                onClick={() => setShowNewDivTwo(true)}
                            >
                                선택
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

                                    <div className={styles.babys}>
                                        <label className={styles.radioLabel}>
                                            <input
                                                type="radio"
                                                name="baby"
                                                value="one"
                                                checked={selectedBabyMom === "one"}
                                                onChange={(e) => setSelectedBabyMom(e.target.value)}
                                            />
                                            <img src={oneImg} alt="one" className={styles.oneImage} />
                                        </label>
                                        <label className={styles.radioLabel}>
                                            <input
                                                type="radio"
                                                name="baby"
                                                value="two"
                                                checked={selectedBabyMom === "two"}
                                                onChange={(e) => setSelectedBabyMom(e.target.value)}
                                            />
                                            <img src={twoImg} alt="two" className={styles.twoImage} />
                                        </label>
                                        <label className={styles.radioLabel}>
                                            <input
                                                type="radio"
                                                name="baby"
                                                value="three"
                                                checked={selectedBabyMom === "three"}
                                                onChange={(e) => setSelectedBabyMom(e.target.value)}
                                            />
                                            <img src={threeImg} alt="three" className={styles.threeImage} />
                                        </label>
                                        <label className={styles.radioLabel}>
                                            <input
                                                type="radio"
                                                name="baby"
                                                value="four"
                                                checked={selectedBabyMom === "four"}
                                                onChange={(e) => setSelectedBabyMom(e.target.value)}
                                            />
                                            <img src={fourImg} alt="four" className={styles.fourImage} />
                                        </label>
                                    </div>

                                    <div className={styles.buttons}>
                                        <button
                                            className={`${styles.why} ${selectedGender === "미정" ? styles.activeGender : ""}`}
                                            onClick={() => setSelectedGender("미정")}
                                        >
                                            미정?
                                        </button>
                                        <button
                                            className={`${styles.man} ${selectedGender === "남자" ? styles.activeGender : ""}`}
                                            onClick={() => setSelectedGender("남자")}
                                        >
                                            남자
                                        </button>
                                        <button
                                            className={`${styles.girl} ${selectedGender === "여자" ? styles.activeGender : ""}`}
                                            onClick={() => setSelectedGender("여자")}
                                        >
                                            여자
                                        </button>
                                    </div>

                                    <div className={styles.babyparty}>
                                        <label htmlFor={`bp-${idx}`}>출생일</label>
                                        <input type="date" id={`bp-${idx}`} placeholder="출생일" />
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
                                    <div className={styles.babys}>
                                        <label className={styles.radioLabel}>
                                            <input
                                                type="radio"
                                                name="baby"
                                                value="one"
                                                checked={selectedBabyChild === "one"}
                                                onChange={(e) => setSelectedBabyChild(e.target.value)}
                                            />
                                            <img src={oneImg} alt="one" className={styles.oneImage} />
                                        </label>
                                        <label className={styles.radioLabel}>
                                            <input
                                                type="radio"
                                                name="baby"
                                                value="two"
                                                checked={selectedBabyChild === "two"}
                                                onChange={(e) => setSelectedBabyChild(e.target.value)}
                                            />
                                            <img src={twoImg} alt="two" className={styles.twoImage} />
                                        </label>
                                        <label className={styles.radioLabel}>
                                            <input
                                                type="radio"
                                                name="baby"
                                                value="three"
                                                checked={selectedBabyChild === "three"}
                                                onChange={(e) => setSelectedBabyChild(e.target.value)}
                                            />
                                            <img src={threeImg} alt="three" className={styles.threeImage} />
                                        </label>
                                        <label className={styles.radioLabel}>
                                            <input
                                                type="radio"
                                                name="baby"
                                                value="four"
                                                checked={selectedBabyChild === "four"}
                                                onChange={(e) => setSelectedBabyChild(e.target.value)}
                                            />
                                            <img src={fourImg} alt="four" className={styles.fourImage} />
                                        </label>
                                    </div>
                                    <div className={styles.buttonss}>
                                        <button
                                            className={`${styles.mantwo} ${genderSelected === "남자" ? styles.activeGender : ""}`}
                                            onClick={() => setGenderSelected("남자")}
                                        >
                                            남자
                                        </button>
                                        <button
                                            className={`${styles.girltwo} ${genderSelected === "여자" ? styles.activeGender : ""}`}
                                            onClick={() => setGenderSelected("여자")}
                                        >
                                            여자
                                        </button>
                                    </div>

                                    <div className={styles.babyparty}>
                                        <label htmlFor={`bp-${idx}`}>출생일</label>
                                        <input type="date" id={`bp-${idx}`} placeholder="출생일" />
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