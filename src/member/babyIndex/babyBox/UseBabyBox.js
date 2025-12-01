import { caxios } from "config/config";
import { calculateFetalWeek, calculateInfantWeek } from "member/utils/pregnancyUtils";
import { useEffect, useState } from "react";

export function useBabyBox({ setIsBorn }) {
    const babySeq = sessionStorage.getItem("babySeq");
    const [data, setData] = useState({});
    const [isDuePassed, setIsDuePassed] = useState(false);
    const [dueDateStatus, setDueDateStatus] = useState("");

    // 조건: 아기의 출산 예정일이 오늘이거나 지났으면 육아로 자동변경함 : ui용 상태변수
    const [isParenting, setIsParenting] = useState(false);


    //---------------------------------------함수 모음
    const isBornBaby = (birth_date) => { //아기 태어났는지 여부 판단
        if (birth_date) {
            const todayKST = new Date(
                new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
            );
            const birth = new Date(birth_date + "T00:00:00");

            if (birth <= todayKST) { //아기 출산 후
                setDueDateStatus(calculateDueDateBorn(birth_date));
                setIsDuePassed(true);
                setIsParenting(true);
                setIsBorn(true); //최상위 컴포넌트에 아기 출산 상태 전달
            } else {//아기 출산 전
                setDueDateStatus(calculateDueDateUnbborn(birth_date));
                setIsDuePassed(false);
                setIsParenting(false);
                setIsBorn(false); //최상위 컴포넌트에 아기 출산 상태 전달
            }
        }
    }
    const calculateDueDateBorn = (birth_date) => { //태어난 아기 생후 몇개월인지 계산
        const todayKSTString = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" }); //오늘날자 문자열
        const weeks = calculateInfantWeek(birth_date, todayKSTString);
        const months = Math.ceil(weeks / 4);
        return `생후 ${months} 개월`;
    }
    const calculateDueDateUnbborn = (birth_date) => {// 안태어난 아기 몇주인지 계산
        const todayKSTString = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" }); //오늘날자 문자열
        const weeks = calculateFetalWeek(birth_date, todayKSTString);
        return `${weeks} 주차`;
    }

    //---------------------------------------유즈이펙트 모음
    //아기 dto 받아오기
    useEffect(() => {
        caxios.get("/baby/babyMypage", {
            params: { baby_seq: babySeq }
        })
            .then(resp => {
                console.log(resp.data, "아기디티오"); //아기 디티오
                setData(resp.data);
                isBornBaby(resp.data.birth_date);
            })
            .catch(err => {
                console.log(err);
            })
    }, [babySeq]);

    return {
        data,
        isDuePassed,
        dueDateStatus,
        isParenting
    };
}
