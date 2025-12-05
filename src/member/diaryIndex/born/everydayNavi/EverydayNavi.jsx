// EverydayNavi.jsx
import { motion } from "framer-motion";
import { Milk, Droplets, Soup, Moon, Thermometer } from "lucide-react";
import styles from "./EverydayNavi.module.css";
import { caxios } from "config/config";
import { use, useState } from "react";
import { useEverydayNavi } from "./UseEverydayNavi";

const summaryData = {
  milk: { title: "분유", icon: Milk, color: "#ff8cb3" },
  toilet: { title: "배변", icon: Droplets, color: "#ffb84d" },
  baby_food: { title: "이유식", icon: Soup, color: "#7adf80" },
  sleep: { title: "수면", icon: Moon, color: "#7abaff" },
  temperature: { title: "체온", icon: Thermometer, color: "#ff7a7a" },
};

// 전체 리스트 stagger
const listContainer = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

// 카드 애니메이션
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};



const EverydayNavi = ({ startDate, setStartDate, endDate, setEndDate, avg, handleSearch }) => {
  const {
    today,
    loading
  } = useEverydayNavi();


  return (
    <div className={styles.container}>
      {/* 날짜 선택 */}
      <div className={styles.dateBox}>
        <input type="date" value={startDate} className={styles.dateInput} onChange={(e) => setStartDate(e.target.value)} max={today} />
        <input type="date" value={endDate} className={styles.dateInput} onChange={(e) => setEndDate(e.target.value)} max={today} />
        <button onClick={() => { handleSearch(startDate, endDate) }} disabled={loading}> {loading ? "로딩..." : "검색"}</button>
      </div>

      {/* 요약 카드 */}
      <motion.div variants={listContainer} initial="hidden" animate="show">
        <div className={styles.summaryGrid}>
          {Object.entries(summaryData).map(([key, item]) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={key}
                className={styles.summaryCard}
                variants={cardVariants}
              >
                <Icon size={28} strokeWidth={2.5} color={item.color} />
                <div className={styles.summaryText}>
                  <div className={styles.summaryTitle}>{item.title}</div>
                  <div className={styles.summaryValue}>{avg?.[key] ?? "-"}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default EverydayNavi;
