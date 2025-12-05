import { useMemo, useState, useEffect } from "react";
import { caxios } from "../../config/config";
import { FETAL_STANDARDS } from "./FetalStandardData";
import { calculateFetalWeek, calculateInfantWeek } from "../utils/pregnancyUtils";
import useAuthStore from "../../store/useStore";
import { INFANT_STANDARDS } from "./InfantStandardData";
export const useChartIndex = (currentWeek, setCurrentWeek) => {
  const { babySeq } = useAuthStore((state) => state);
  const [isFetalMode, setIsFetalMode] = useState(true);
  const [babyInfo, setBabyInfo] = useState(null);
  const [activeMenu, setActiveMenu] = useState(0);

  useEffect(() => {
    if (!babySeq) return;

    const fetchBabyInfo = async () => {
      try {
        const babyResponse = await caxios.get(`/chart/${babySeq}`);
        const { status, birth_date, baby_seq: seq } = babyResponse.data;

        const todayStr = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
        const week =
          status.toLowerCase() === "fetus"
            ? calculateFetalWeek(birth_date, todayStr)
            : calculateInfantWeek(birth_date, todayStr);

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
    if (currentWeek <= 0) return null;

    if (isFetalMode) {
      return FETAL_STANDARDS[currentWeek];
    } else {

      const monthIndex = Math.min(Math.floor(currentWeek / 4), INFANT_STANDARDS.length - 1);
      return INFANT_STANDARDS[monthIndex];
    }
  }, [currentWeek, isFetalMode]);

  return {
    babySeq,
    isFetalMode,
    babyInfo,
    currentWeek,
    activeMenu,
    setActiveMenu,
    currentStandardData,
  };
};
