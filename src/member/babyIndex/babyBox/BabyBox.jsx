import styles from "./BabyBox.module.css";
import backgrond from "./imgs/Background.svg";
import infants from "./imgs/Infants.svg";
import backgrond2 from "./imgs/Background2.svg";
import toddlers from "./imgs/Toddlers.svg";
import { motion } from "framer-motion";
import { useBabyBox } from "./UseBabyBox";

const imageVariantsPregnant = {
  initial: { opacity: 0, rotate: 0 },
  animate: {
    opacity: 1,
    y: [0, -5, 0], // 위아래 둥실둥실
    rotate: [0, -20, 20, 0], // 좌우 살짝 흔들리면서 회전
    transition: {
      opacity: { duration: 0.5 }, // 한 번만 등장
      y: {
        duration: 2.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
      rotate: {
        duration: 8,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      },
    },
  },
};

const imageVariantsParenting = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    y: [0, -15, 0], // 통통 튀는 점프
    transition: {
      y: {
        duration: 1.2,
        repeat: Infinity,
        ease: "easeOut",
      },
      opacity: { duration: 0.5 }, // 한 번만 페이드인
    },
  },
};

// isPregnant: boolean (임산모면 true, 육아면 false)
// isDuePassed: boolean (출산 예정일이 지났거나, 육아 회원인 경우 true)
/**
 * 아기 박스 컴포넌트
 * {string} babyName - 아기 이름 (또는 태명)
 * {string} dueDateStatus - D-day 상태 (예: D-20주, D+50일)
 * {boolean} isPregnant - 임산모 타입인지 여부
 * {boolean} isDuePassed - 출산 예정일이 지났는지 여부 (임산모 타입일 때만 유효)
 */
// 기본값 설정: Prop이 없으면 테스트 값으로 대체
const BabyBox = ({ setIsBorn }) => {
  const { data, isDuePassed, dueDateStatus, isParenting } = useBabyBox({
    setIsBorn,
  });

  // 렌더링할 이미지 세트 결정 - 아기 이미지
  let backgroundImage = backgrond;
  let mainImage = infants;
  if (isParenting) {
    // 육아 이미지 세트
    backgroundImage = backgrond2;
    mainImage = toddlers;
  }

  return (
    <div className={styles.container}>
      <div className={styles.babyImagePlaceholder}>
        <b className={styles.babyName}>{data.name}</b>
        <div className={styles.dueDate}>{dueDateStatus}</div>
      </div>

      <div className={styles.mainContentArea}>
        <div>
          <img
            src={backgroundImage}
            className={styles.backgrondImage}
            alt="배경"
          />
        </div>
        <div>
          <motion.img
            src={mainImage}
            className={`${styles.placeholderImage} ${isParenting ? styles.parentingImage : styles.placeholderImage
              }`}
            alt={isParenting ? "육아" : "아기"}
            initial="initial"
            animate="animate"
            variants={
              isParenting ? imageVariantsParenting : imageVariantsPregnant
            }
          />
        </div>
      </div>
    </div>
  );
};
export default BabyBox;
