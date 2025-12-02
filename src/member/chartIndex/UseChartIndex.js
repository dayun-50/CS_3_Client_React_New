import { useMemo, useState, useEffect } from "react";
import { caxios } from "../../config/config";
import { FETAL_STANDARDS } from "./FetalStandardData"; 
import { calculateFetalWeek, calculateInfantWeek } from "../utils/pregnancyUtils";
import useAuthStore from "../../store/useStore";

export const useChartIndex = (currentWeek, setCurrentWeek) => {
  const { babySeq } = useAuthStore((state) => state);
  const [isFetalMode, setIsFetalMode] = useState(true);
  const [babyInfo, setBabyInfo] = useState(null);
  const [activeMenu, setActiveMenu] = useState(0);

  const menuList = [
    "전체", "몸무게", "머리직경", "머리둘레", "복부둘레", "허벅지 길이",
  ];

  // Baby 정보 조회 + currentWeek 계산만 처리
  useEffect(() => {
    if (!babySeq) return;

    const fetchBabyInfo = async () => {
      try {
        const babyResponse = await caxios.get(`/chart/${babySeq}`);
        const { status, birth_date, baby_seq: seq } = babyResponse.data;
        
        const todayStr = new Date().toISOString().split("T")[0];
        const week =
          status.toLowerCase() === "fetus"
            ? calculateFetalWeek(birth_date, todayStr)
            : calculateInfantWeek(birth_date, todayStr);
    console.log("상태 : " + status, "생일 : " + birth_date, "아기 시퀀스 : " +  seq ,  "해당주차 : " + week,  "오늘날짜 : " + todayStr);
        setBabyInfo({ babySeq: seq, status, birthDate: birth_date });
        setCurrentWeek(week);
        setIsFetalMode(status.toLowerCase() === "fetus");

      } catch (error) {
        console.error("Baby 정보 조회 실패:", error);
        setCurrentWeek(28);
        setBabyInfo({ babySeq, status: "FETUS", birthDate: "2026-01-01" });
        setIsFetalMode(true);
      }
    };

    fetchBabyInfo();
  }, [babySeq]);

  const currentStandardData = useMemo(() => {
    if (!isFetalMode || currentWeek <= 0) return null;
    return FETAL_STANDARDS[currentWeek];
  }, [currentWeek, isFetalMode]);

  return {
    babySeq,
    isFetalMode,
    babyInfo,
    menuList,
    currentWeek,
    activeMenu,
    setActiveMenu,
    currentStandardData,
  };
};
