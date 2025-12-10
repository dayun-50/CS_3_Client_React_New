import { useState } from "react";
import styles from "./ChooseType.module.css";
import babyImg from "./img/baby.png";
import childrenImg from "./img/children.png";
import addImg from "./img/Add.png";
import oneImg from "./img/one.png";
import twoImg from "./img/two.png";
import threeImg from "./img/three.png";
import fourImg from "./img/four.png";
import useAuthStore from "../../store/useStore";
import useChooseType from "./UseChooseType";
import InputBaby from "../../member/inputBaby/InputBaby";

const ChooseType = () => {

  const [showInputBaby, setShowInputBaby] = useState(false);
  const [babyType, setBabyType] = useState("");
  const [hover, setHover] = useState(false);
  const [hoverTwo, setHoverTwo] = useState(false);

  const closeModal = () => {
    setShowInputBaby(false);
    setBabyType("");
    setHover(false);
    setHoverTwo(false);
  };

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
        gap: "50px",
      }}
    >
      {!showInputBaby && (
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
                onClick={() => {
                  setBabyType("mom");
                  setShowInputBaby(true);
                }}
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
                onClick={() => {
                  setBabyType("child");
                  setShowInputBaby(true);
                }}
              >
                선택
              </button>
            </div>
          </div>
        </>
      )}

      {showInputBaby && (
        <InputBaby
          type={babyType}
          onClose={closeModal}
          fromChooseType={true}
        />
      )}
    </div>
  );
};


export default ChooseType;
