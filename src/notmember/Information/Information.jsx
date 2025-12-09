import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styles from "./Information.module.css";
import img1 from "./imgs/index.png"; // PC 이미지
import img2 from "./imgs/768img.png"; // 태블릿 이미지
import img3 from "./imgs/480img.png"; // 모바일 이미지

// ---------------- 모션 Variants ----------------
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};
const rotateInLeft = {
  hidden: { opacity: 0, x: -100, rotate: 5, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    x: 0,
    rotate: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 50, duration: 1 },
  },
};
const rotateInRight = {
  hidden: { opacity: 0, x: 100, rotate: -5, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    x: 0,
    rotate: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 50, duration: 1 },
  },
};
const bounceIn = {
  hidden: { opacity: 0, y: 100, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 60, damping: 10, duration: 0.8 },
  },
};
const scaleUp = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
};
const staggerChildren = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};
const galleryItemScaleUp = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.1, delay: 0.05 },
  },
};

const Information = () => {
  const sectionsRef = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSections = 5;
  const isManualScrolling = useRef(false);

  if (sectionsRef.current.length !== totalSections) {
    sectionsRef.current = Array(totalSections)
      .fill(null)
      .map((_, i) => sectionsRef.current[i] || null);
  }

  const scrollTo = (index) => {
    const target = sectionsRef.current[index];
    if (!target) return;
    isManualScrolling.current = true;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      isManualScrolling.current = false;
      setActiveIndex(index);
    }, 800);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScrolling.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionsRef.current.indexOf(entry.target);
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { threshold: 0.5 }
    );
    sectionsRef.current.forEach((sec) => sec && observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  const galleryImgs = [
    "/images/gallery1.png",
    "/images/gallery2.png",
    "/images/gallery3.png",
    "/images/gallery4.png",
    "/images/gallery5.png",
    "/images/gallery6.png",
  ];

  const navigate = useNavigate();

  const healdLogin = () => {
    navigate("/login");
  };

  return (
    <div className={styles.container}>
      {/* HERO */}
      <section
        className={styles.hero}
        ref={(el) => (sectionsRef.current[0] = el)}
      >
        <motion.div
          className={styles.heroInner}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={scaleUp}
        >
          <motion.h1 variants={fadeUp} className={styles.heroTitle}>
            완벽한 육아 파트너
          </motion.h1>
          <motion.p variants={fadeUp} className={styles.heroText}>
            우리 아이의 소중한 성장을 기록하고, 커뮤니티의 지혜를 더하세요.
          </motion.p>
          <motion.button
            variants={fadeUp}
            className={styles.btnStart}
            onClick={healdLogin}
          >
            지금 바로 시작하기
          </motion.button>
        </motion.div>
      </section>

      {/* SECTION 1 – rotateInLeft */}
      <section
        className={styles.section}
        ref={(el) => (sectionsRef.current[1] = el)}
      >
        <motion.div
          className={styles.sectionInner}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={rotateInLeft}
        >
          <motion.h2 variants={fadeUp} className={styles.sectionTitle}>
            홈 페이지
          </motion.h2>
          <motion.p variants={fadeUp} className={styles.sectionDesc}>
            아기의 정보와 실시간 반영되는 정책들을 한눈에 볼 수 있어요.
          </motion.p>
          <motion.img
            variants={fadeUp}
            className={styles.sectionImg}
            src={img1}
            alt=""
          />
        </motion.div>
      </section>

      {/* SECTION 2 – rotateInRight */}
      <section
        className={styles.section}
        ref={(el) => (sectionsRef.current[2] = el)}
      >
        <motion.div
          className={styles.sectionInnerRow}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={rotateInRight}
        >
          <motion.img
            variants={fadeUp}
            className={styles.sectionImg}
            src={img1}
            alt=""
          />
          <motion.div
            className={styles.sectionTextGroupLeft}
            variants={staggerChildren}
          >
            <motion.h2 variants={fadeUp} className={styles.sectionTitle}>
              필수 건강 기록
            </motion.h2>
            <motion.p variants={fadeUp} className={styles.sectionDesc}>
              예방 접종, 주차별 검진 및 증상 정보를 확인하고
              <br />
              예약 일정도 간편하게 기록할 수 있어요.
            </motion.p>
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 3 – 여러 기기 */}
      <section
        className={styles.section}
        ref={(el) => (sectionsRef.current[3] = el)}
      >
        <motion.div
          className={styles.sectionInnerRow}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={bounceIn}
        >
          <motion.div
            className={styles.sectionTextGroup}
            variants={staggerChildren}
          >
            <motion.h2 variants={fadeUp} className={styles.sectionTitle}>
              여러 기기에서 간편하게
            </motion.h2>
            <motion.p variants={fadeUp} className={styles.sectionDesc}>
              PC, 태블릿, 모바일 반응형을 적용하여
              <br />
              언제 어디서든 기록하고 확인할 수 있어요.
            </motion.p>
          </motion.div>

          <motion.div
            className={styles.multiDeviceWrap}
            variants={staggerChildren}
          >
            <motion.img
              variants={fadeUp}
              className={styles.deviceLarge}
              src={img1}
              alt="PC Mockup"
            />
            <motion.img
              variants={fadeUp}
              className={styles.deviceMid}
              src={img2}
              alt="Tablet Mockup"
            />
            <motion.img
              variants={fadeUp}
              className={styles.deviceSmall}
              src={img3}
              alt="Mobile Mockup"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 4 – 갤러리 */}
      <section
        className={styles.gallerySection}
        ref={(el) => (sectionsRef.current[4] = el)}
      >
        <motion.div
          className={styles.galleryInner}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerChildren}
        >
          <motion.h2 variants={fadeUp} className={styles.sectionTitle}>
            성장 기록 갤러리
          </motion.h2>
          <motion.p variants={fadeUp} className={styles.sectionDesc}>
            아기의 소중한 순간들을 갤러리 형태로 모아보세요.
          </motion.p>

          <div className={`${styles.galleryRow} ${styles.rowR2L}`}>
            {[...galleryImgs, ...galleryImgs].map((src, i) => (
              <motion.div
                className={styles.slideItem}
                key={`top-${i}`}
                variants={galleryItemScaleUp}
              >
                <img src={src} alt="" className={styles.galleryImg} />
                <div className={styles.galleryHover}>
                  <span>{i % 2 === 0 ? "수유 기록" : "수면 기록"}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className={`${styles.galleryRow} ${styles.rowL2R}`}>
            {[...galleryImgs, ...galleryImgs].map((src, i) => (
              <motion.div
                className={styles.slideItem}
                key={`bottom-${i}`}
                variants={galleryItemScaleUp}
              >
                <img src={src} alt="" className={styles.galleryImg} />
                <div className={styles.galleryHover}>
                  <span>{i % 2 === 0 ? "발달 기록" : "건강 기록"}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* DOT NAV */}
      <div className={styles.dotNavWrap}>
        {Array.from({ length: totalSections }, (_, i) => (
          <div
            key={i}
            className={`${styles.dot} ${
              activeIndex === i ? styles.activeDot : ""
            }`}
            onClick={() => scrollTo(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default Information;
