import { caxios } from "config/config";
import { calculateFetalWeek, calculateInfantWeek } from "member/utils/pregnancyUtils";
import { useEffect, useState } from "react";

export function useBabyBox({ setIsBorn }) {
    const babySeq = sessionStorage.getItem("babySeq");
    const [data, setData] = useState({});
    const [isDuePassed, setIsDuePassed] = useState(false);
    const [dueDateStatus, setDueDateStatus] = useState("");
    const [isParenting, setIsParenting] = useState(false);

    const isBornBaby = (birth_date) => {
        if (birth_date) {
            const todayKST = new Date(
                new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
            );
            const birth = new Date(birth_date + "T00:00:00");

            if (birth <= todayKST) {
                setDueDateStatus(calculateDueDateBorn(birth_date));
                setIsDuePassed(true);
                setIsParenting(true);
                setIsBorn(true);
            } else {
                setDueDateStatus(calculateDueDateUnbborn(birth_date));
                setIsDuePassed(false);
                setIsParenting(false);
                setIsBorn(false);
            }
        }
    }
    const calculateDueDateBorn = (birth_date) => {
        const todayKSTString = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" });
        const weeks = calculateInfantWeek(birth_date, todayKSTString);
        const months = Math.ceil(weeks / 4);
        return `생후 ${months} 개월`;
    }
    const calculateDueDateUnbborn = (birth_date) => {
        const todayKSTString = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" });
        const weeks = calculateFetalWeek(birth_date, todayKSTString);
        return `${weeks} 주차`;
    }

    useEffect(() => {
        caxios.get("/baby/babyMypage", {
            params: { baby_seq: babySeq }
        })
            .then(resp => {
                console.log(resp.data, "아기디티오");
                setData(resp.data);
                isBornBaby(resp.data.birth_date);
            })
    }, [babySeq]);

    return {
        data,
        isDuePassed,
        dueDateStatus,
        isParenting
    };
}
