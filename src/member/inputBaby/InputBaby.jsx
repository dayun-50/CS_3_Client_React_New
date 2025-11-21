import { useState, useRef, useEffect } from "react";
import styles from "./InputBaby.module.css";
import addImg from "./img/Add.png";
import oneImg from "./img/one.png";
import twoImg from "./img/two.png";
import threeImg from "./img/three.png";
import fourImg from "./img/four.png";
import useInputBaby from "./UseInputBaby";

const InputBaby = ({ type = "mom", onClose, fromChooseType = false }) => {
  const [inputBlocks, setInputBlocks] = useState([
    { name: "", gender: "", image_name: "", birth_date: "" },
  ]);
  const clickplusRef = useRef(null);

  const handleAdd = () => {
    if (inputBlocks.length < 3) {
      setInputBlocks((prev) => [
        ...prev,
        { name: "", gender: "", image_name: "", birth_date: "" },
      ]);
    }
  };

  useEffect(() => {
    if (clickplusRef.current) {
      clickplusRef.current.scrollTop = clickplusRef.current.scrollHeight;
    }
  }, [inputBlocks.length]);

  const title = type === "mom" ? "임산모" : "육아";
  const subtitle =
    type === "mom"
      ? "출산 예정일과 태명을 입력해 주세요"
      : "출생일과 성별, 이름을 입력해 주세요";

  const inputBoxStyle = {
    width: "580px",
    height: "660px",
    backgroundColor: "white",
    borderRadius: "20px",
    border: fromChooseType ? "none" : "1px solid black",
    boxShadow: fromChooseType ? "4px 4px 8px -2px rgba(0,0,0,0.25)" : "none",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  };

  const {
    auth,
    inputCount,
    todayString,
    yesterdayString,
    handleChange,
    handleComplete,
    handleLoginKeyUp,
  } = useInputBaby(inputBlocks, setInputBlocks);

  // 각 블록별 성별 선택
  const handleGenderClick = (index, gender) => {
    setInputBlocks((prev) => {
      const newBlocks = [...prev];
      newBlocks[index] = { ...newBlocks[index], gender };
      return newBlocks;
    });
  };

  // 각 블록별 사진 선택
  const handleImageClick = (index, image_name) => {
    setInputBlocks((prev) => {
      const newBlocks = [...prev];
      newBlocks[index] = { ...newBlocks[index], image_name };
      return newBlocks;
    });
  };

  return (
    <div
      className={styles.container}
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
      }}
    >
      <div className={styles.Inputb} style={inputBoxStyle}>
        <div className={styles.babymomclick}>
          <h1>{title}</h1>
          <p>{subtitle}</p>

          <div className={styles.clickplus} ref={clickplusRef}>
            {inputBlocks.map((baby, idx) => (
              <div key={idx} style={{ width: "100%" }}>
                <div className={styles.babys}>
                  {["one", "two", "three", "four"].map((val) => (
                    <label className={styles.radioLabel} key={val}>
                      <input
                        type="radio"
                        name={`image_name-${idx}`}
                        value={val}
                        checked={baby.image_name === val}
                        onChange={() => handleImageClick(idx, val)}
                      />
                      <img
                        src={
                          val === "one"
                            ? oneImg
                            : val === "two"
                            ? twoImg
                            : val === "three"
                            ? threeImg
                            : fourImg
                        }
                        alt={val}
                        className={styles[`${val}Image`]}
                      />
                    </label>
                  ))}
                </div>

                <div className={styles.buttons}>
                  {type === "mom" && (
                    <button
                      className={`${styles.why} ${
                        baby.gender === "미정" ? styles.activeGender : ""
                      }`}
                      onClick={() => handleGenderClick(idx, "미정")}
                    >
                      미정?
                    </button>
                  )}
                  <button
                    className={`${
                      type === "mom" ? styles.man : styles.mantwo
                    } ${baby.gender === "남자" ? styles.activeGender : ""}`}
                    onClick={() => handleGenderClick(idx, "남자")}
                  >
                    남자
                  </button>
                  <button
                    className={`${
                      type === "mom" ? styles.girl : styles.girltwo
                    } ${baby.gender === "여자" ? styles.activeGender : ""}`}
                    onClick={() => handleGenderClick(idx, "여자")}
                  >
                    여자
                  </button>
                </div>

                <div className={styles.babyparty}>
                  <label htmlFor={`bp-${idx}`}>출생일</label>
                  <input
                    type="date"
                    id={`bp-${idx}`}
                    placeholder="출생일"
                    min={type === "mom" ? yesterdayString : ""}
                    max={type === "mom" ? "" : todayString}
                    name="birth_date"
                    value={baby.birth_date || ""}
                    onChange={(e) => handleChange(idx, e)}
                    className={
                      !auth[idx]?.birth_date && inputCount[idx]?.birth_date > 0
                        ? styles.invalid
                        : ""
                    }
                  />
                </div>

                <div className={styles.babyname}>
                  <label htmlFor={`bn-${idx}`}>이름</label>
                  <input
                    type="text"
                    id={`bn-${idx}`}
                    placeholder="이름"
                    name="name"
                    value={baby.name || ""}
                    onChange={(e) => handleChange(idx, e)}
                    onKeyUp={handleLoginKeyUp}
                    className={
                      !auth[idx]?.name && inputCount[idx]?.name > 0
                        ? styles.invalid
                        : ""
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          {inputBlocks.length < 3 && (
            <div className={styles.babyplus}>
              <img
                src={addImg}
                alt="add"
                className={styles.addImage}
                onClick={handleAdd}
              />
              <p className={styles.babyadd} onClick={handleAdd}>
                쌍둥이 추가
              </p>
            </div>
          )}

          <div className={styles.bbtt}>
            <button
              className={styles.deb}
              onClick={() => {
                setInputBlocks([
                  { name: "", gender: "", image_name: "", birth_date: "" },
                ]);
                onClose();
              }}
            >
              취소
            </button>
            <button className={styles.cb} onClick={handleComplete}>
              완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputBaby;
