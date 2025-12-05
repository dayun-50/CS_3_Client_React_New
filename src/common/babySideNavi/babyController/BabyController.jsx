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
import { motion, AnimatePresence } from "framer-motion";

import InputBaby from "../../../member/inputBaby/InputBaby";
import useBabyController from "./UseBabyController";

const BabyController = ({ isSidebar }) => {
  const [showModal, setShowModal] = useState(false);
  const [showInputBaby, setShowInputBaby] = useState(false);
  const [babyType, setBabyType] = useState("");

  const babyImages = {
    one: one,
    two: two,
    three: three,
    four: four,
  };

  const { data, babySeq, getKoreanOrder, changeBaby } = useBabyController();

  return (
    <div
      className={`${styles.rightcontainer} ${isSidebar ? styles.sidebarContainer : ""
        }`}
    >
      <div className={styles.full}>
        <div className={styles.one}>

          {/* 아기추가 + 아기리스트 → 두 영역으로 분리 */}
          <div className={styles.babyclick}>

            {/* 왼쪽 고정 아기추가 버튼 */}
            {!isSidebar && (
              <div className={styles.babyAdd}>
                <button
                  className={styles.plusbb}
                  onClick={() => setShowModal(true)}
                >
                  <img
                    src={yellowImg}
                    alt="yellow"
                    className={styles.yellowImage}
                  />
                  <span>아기추가</span>
                </button>
              </div>
            )}

            {/* 오른쪽 아기 리스트 (스크롤 영역) */}
            <div
              className={styles.babyList}
              onWheel={(e) => {
                e.currentTarget.scrollLeft += e.deltaY;
              }}
            >
              {data.map((baby, index) => (
                <button
                  key={index}
                  className={babySeq == baby.baby_seq ? styles.ingbaby1 : styles.ingbaby}
                  onClick={() => changeBaby(baby.baby_seq, baby.birth_date)}
                >
                  <div className={styles.bbb}>
                    <img
                      src={babyImages[baby.image_name]}
                      alt="babyface"
                      className={styles.babyfaceImage}
                    />
                    <div>
                      <div className={styles.babyname}>{baby.name}</div>
                      <div className={styles.how}>{getKoreanOrder(index + 1)}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* 아기 추가 모달 */}
      <AnimatePresence>
        {showModal && (
          <div className={styles.modal}>
            <motion.div
              className={styles.ppap}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {!showInputBaby && (
                <>
                  <button
                    className={styles.back}
                    onClick={() => setShowModal(false)}
                  >
                    <CgClose />
                  </button>

                  <button
                    className={styles.modalContentone}
                    onClick={() => {
                      setBabyType("mom");
                      setShowInputBaby(true);
                    }}
                  >
                    <div className={styles.modalone}>
                      <h1 className={styles.sanmotitle}>임산부</h1>
                      <span className={styles.be}>아직 뱃속에 있어요</span>
                      <img
                        src={babyImg}
                        alt="baby"
                        className={styles.babyImg}
                      />
                    </div>
                  </button>

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
                      <img
                        src={childrenImg}
                        alt="childrenbaby"
                        className={styles.childrenImg}
                      />
                    </div>
                  </button>
                </>
              )}

              {showInputBaby && (
                <InputBaby
                  type={babyType}
                  onClose={() => setShowInputBaby(false)}
                  fromChooseType={true}
                />
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BabyController;
