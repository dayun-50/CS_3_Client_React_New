import { caxios } from "config/config";
import { useState } from "react";

export function groupByDate(records) { // 기록 배열 → 날짜별로 그룹화
    const map = {};
    records.forEach((r) => {
        const date = r.created_at;
        const keyDate = date.split("T")[0]; // 날자만 키로 저장

        if (!map[keyDate]) map[keyDate] = []; //해당 키값이 맵에 없으면 날자 키값 가지는 빈배열 생성
        map[keyDate].push(r);
    }); //해당 배열에 푸쉬
    return map;
}


export function formatSleep(minutes) {//시간 포맷
    if (!minutes || minutes <= 0) return "0시간 0분";

    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);

    return `${h}시간 ${m}분`;
}

// ---------------------- 평균 계산 메인 함수 ----------------------
export function calcAverages(records) {
    // 1. 날짜별 그룹화
    const byDate = groupByDate(records);// { "날짜": [{record}, {record}], "날짜": [{record}, {record}]...}
    const dates = Object.keys(byDate); //[날짜, 날짜, 날짜]
    if (dates.length === 0) return;

    // 2. 하루 단위 토탈이나, 하루 평균 저장하는 리스트
    const perDay = {
        milk: [],
        baby_food: [],
        sleep: [],
        temperature: [],
        pee: [],
        poop: [],
    };

    // 3. 날짜별 배열돌면서
    dates.forEach(date => {
        const today = byDate[date]; // [{record}, {record}] 배열

        let milkSum = 0;
        let foodSum = 0;
        let sleepSum = 0;
        let tempList = [];

        let peeCount = 0;
        let poopCount = 0;

        today.forEach(record => {
            const t = record.record_type;
            const v = record.amount_value || 0;

            switch (t) {
                case "milk":
                    milkSum += v;
                    break;

                case "baby_food":
                    foodSum += v;
                    break;

                case "sleep":
                    sleepSum += v; // minutes 누적
                    break;

                case "temperature":
                    tempList.push(v);
                    break;

                case "toilet/pee":
                    peeCount += 1;
                    break;

                case "toilet/poop":
                    poopCount += 1;
                    break;
            }
        });

        //  기록이 있으면 하루 단위 토탈 리스트에 push
        if (milkSum > 0) perDay.milk.push(milkSum);
        if (foodSum > 0) perDay.baby_food.push(foodSum);
        if (sleepSum > 0) perDay.sleep.push(sleepSum);
        if (peeCount > 0) perDay.pee.push(peeCount);
        if (poopCount > 0) perDay.poop.push(poopCount);

        // 체온 평균
        if (tempList.length > 0) {
            perDay.temperature.push(
                tempList.reduce((a, b) => a + b, 0) / tempList.length
            );
        }
    });

    // 4. 최종 평균 계산 함수
    const average = (arr) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;


    const milkAvg = average(perDay.milk);
    const foodAvg = average(perDay.baby_food);
    let sleepAvg = average(perDay.sleep);
    sleepAvg = formatSleep(sleepAvg);
    const tempAvg = average(perDay.temperature);
    const peeAvg = average(perDay.pee);
    const poopAvg = average(perDay.poop);

    const toiletTotal = peeAvg + poopAvg;

    // 5. UI에 출력할 포맷으로 반환
    return {
        milk: Math.round(milkAvg) + "ml",
        baby_food: Math.round(foodAvg) + "ml",
        sleep: sleepAvg,
        temperature: tempAvg.toFixed(1) + "°C",

        toilet:
            Math.round(toiletTotal) +
            "회"
    };
}


export function useEverydayNavi() {
    //-------------------------상태변수
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(false);// 로딩 중인지
    const [avg, setAvg] = useState({});// 평균데이터

    //-------------------------오늘 날짜
    const today = new Date(new Date().getTime() + 9 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

    //-------------------------버튼 함수
    const handleSearch = async () => { // 날짜 선택후 검색 누르면
        if (!startDate || !endDate) {
            alert("시작일과 종료일을 모두 선택해주세요.");
            resetDates();
            return;
        }
        if (startDate > endDate) {
            alert("시작일이 종료일보다 늦을 수 없습니다.");
            resetDates();
            return;
        }
        setLoading(true);

        try {
            const babySeq = sessionStorage.getItem("babySeq");
            const resp = await caxios.get("/dailyrecord", {
                params: {
                    start: startDate,
                    end: endDate,
                    baby_seq: babySeq,
                },
            });
            const data = resp.data || [];
            const records = Array.isArray(data.rDTOList) ? data.rDTOList : [];

            if (records.length === 0) {
                alert("선택한 기간에 기록이 없습니다.");
                setAvg({});
                resetDates();
                return;
            }

            const avg = calcAverages(records);// 평균치 계산 함수
            setAvg(avg);
        } catch (error) {
            console.error("데이터 불러오기 실패:", error);
            alert("데이터 불러오기 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }

    }

    const resetDates = () => { // 날짜 초기화 함수
        setStartDate("");
        setEndDate("");
        setAvg({});
    };


    return {
        handleSearch,
        startDate,
        setStartDate,
        today,
        endDate,
        setEndDate,
        loading,
        avg,
    }
}