import { useState } from "react";
import styles from "./BabyController.module.css";
import yellowImg from "./img/yellow.png";
import babyfaceImg from "./img/babyface.png";
import babyImg from "./img/baby.png";
import childrenImg from "./img/children.png";
import { CgClose } from "react-icons/cg";
import one from "./img/one.png";
import two from "./img/two.png";
import three from "./img/three.png";
import four from "./img/four.png";

import InputBaby from "../../../member/inputBaby/InputBaby";
import useBabyController from "./useBabyController";

const BabyController = () => {
  const [showModal, setShowModal] = useState(false); // 아기 추가 모달
  const [showInputBaby, setShowInputBaby] = useState(false); // InputBaby 모달
  const [babyType, setBabyType] = useState(""); // "mom" or "child"


  const babyImages = {
    "one": one,
    "two": two,
    "three": three,
    "four" : four
  };

  const {
    data, babySeq,
    getKoreanOrder, changeBaby
  } = useBabyController();

  return (
    <div className={styles.rightcontainer}>
      <div className={styles.margin}></div>

      <div className={styles.full}>
        <div className={styles.one}>
          <div className={styles.babyclick}>
            {data.map((baby, index) => (
              <button key={index} className={`${babySeq == baby.baby_seq ? styles.ingbaby1: styles.ingbaby}`}
                onClick={() => changeBaby(baby.baby_seq)}>
                <div className={styles.bbb}>
                  <img src={babyImages[baby.image_name]} alt="babyface" className={styles.babyfaceImage} />
                  <div className={styles.babyname}>{baby.name}</div>
                  <div className={styles.how}>{getKoreanOrder(index + 1)}</div>
                </div>
              </button>
            ))}

            <button className={styles.plusbb} onClick={() => setShowModal(true)}>
              <img src={yellowImg} alt="yellow" className={styles.yellowImage} />
              <span>아기추가</span>
            </button>
          </div>
        </div>

        <div className={styles.between}></div>
        <div className={styles.two}></div>
      </div>

      {/* 아기 추가 모달 */}
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.ppap}>
            {/* showInputBaby가 false일 때만 뒤로가기 버튼과 선택 화면 렌더 */}
            {!showInputBaby && (
              <>
                <button className={styles.back} onClick={() => setShowModal(false)}>
                  <CgClose />
                </button>

                {/* 임산모 선택 */}
                <button
                  className={styles.modalContentone}
                  onClick={() => {
                    setBabyType("mom");
                    setShowInputBaby(true);
                  }}
                >
                  <div className={styles.modalone}>
                    <h1 className={styles.sanmotitle}>임산모</h1>
                    <span className={styles.be}>아직 뱃속에 있어요</span>
                    <img src={babyImg} alt="baby" className={styles.babyImg} />
                  </div>
                </button>

                {/* 육아 선택 */}
                <button
                  className={styles.modalContenttwo}
                  onClick={() => {
                    setBabyType("child");
                    setShowInputBaby(true);
                  }}
                >
                  <div className={styles.modaltwo}>
                    <h1 className={styles.babtitle}>육아</h1>
                    <span className={styles.bee}>태어났어요</span>
                    <img src={childrenImg} alt="childrenbaby" className={styles.childrenImg} />
                  </div>
                </button>
              </>
            )}

            {/* showInputBaby가 true일 때만 InputBaby 렌더 */}
            {showInputBaby && (
              <InputBaby type={babyType} onClose={() => setShowInputBaby(false)} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BabyController;
