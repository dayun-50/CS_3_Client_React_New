
import { caxios } from "config/config";
import { useState } from "react";



// ---------------------- 평균 계산 메인 함수 ----------------------
export function calcAverages(records) {

    // 1. 날짜별 그룹화
    const byDate = groupByDate(records);
    const dates = Object.keys(byDate);
    if (dates.length === 0) return {};

    // 타입별 하루 총합/평균 리스트
    const perDay = {
        milk: [],
        baby_food: [],
        sleep: [],
        temperature: [],
        pee: [],
        poop: [],
    };

    // ⭐ sleep은 별도 날짜 기반으로 묶기
    const sleepByDate = {};

    records.forEach(r => {
        if (r.record_type === "sleep") {
            const d = new Date(r.created_at);

            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            const date = `${year}-${month}-${day}`;

            if (!sleepByDate[date]) sleepByDate[date] = 0;
            sleepByDate[date] += Number(r.amount_value) || 0;
        }
    });


    // ⭐ 날짜별로 milk/food/temperature/pee/poop 처리
    dates.forEach(date => {
        const today = byDate[date];

        let milkSum = 0;
        let foodSum = 0;
        let tempList = [];
        let peeCount = 0;
        let poopCount = 0;

        today.forEach(r => {
            const t = r.record_type;
            const v = Number(r.amount_value) || 0;

            switch (t) {
                case "milk":
                    milkSum += v;
                    break;

                case "baby_food":
                    foodSum += v;
                    break;

                case "temperature":
                    tempList.push(v);
                    break;

                case "toilet/pee":
                    peeCount++;
                    break;

                case "toilet/poop":
                    poopCount++;
                    break;
            }
        });

        if (milkSum > 0) perDay.milk.push(milkSum);
        if (foodSum > 0) perDay.baby_food.push(foodSum);
        if (peeCount > 0) perDay.pee.push(peeCount);
        if (poopCount > 0) perDay.poop.push(poopCount);

        // 온도는 날짜별 평균 후 push
        if (tempList.length > 0) {
            const tempAvgPerDay = tempList.reduce((a, b) => a + b, 0) / tempList.length;
            perDay.temperature.push(tempAvgPerDay);
        }
    });

    // ⭐ sleep은 날짜별 총합 1개씩
    perDay.sleep = Object.keys(sleepByDate)
        .sort()
        .map(date => Number(sleepByDate[date]));


    // 공통 평균 함수 (배열 길이만큼 나눔)
    const average = arr =>
        arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;


    const milkAvg = average(perDay.milk);
    const foodAvg = average(perDay.baby_food);

    const sleepAvg = formatSleep(average(perDay.sleep));   // 수면은 포맷 적용
    const tempAvg = average(perDay.temperature);           // 온도는 날짜 평균들 평균

    const peeAvg = average(perDay.pee);
    const poopAvg = average(perDay.poop);
    // toilet: pee + poop을 날짜별로 합쳐 계산해야 함
    const toiletPerDay = [];
    dates.forEach(date => {
        const today = byDate[date];
        let count = 0;
        today.forEach(r => {
            if (r.record_type === "toilet/pee" || r.record_type === "toilet/poop") {
                count += 1;
            }
        });
        if (count > 0) toiletPerDay.push(count);
    });
    const toiletAvg = average(toiletPerDay);


    return {
        milk: Math.round(milkAvg) + "ml",
        baby_food: Math.round(foodAvg) + "ml",
        sleep: sleepAvg,
        temperature: tempAvg.toFixed(1) + "°C",
        toilet: Math.round(toiletAvg) + "회"
    };
}

// 날짜별 그룹화 (UTC → 한국시간 정상 변환)
export function groupByDate(records) {
    const map = {};

    records.forEach((r) => {
        const d = new Date(r.created_at);

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");

        const keyDate = `${year}-${month}-${day}`;

        if (!map[keyDate]) map[keyDate] = [];
        map[keyDate].push(r);
    });

    return map;
}
export function formatSleep(minutes) {//시간 포맷
    if (!minutes || minutes <= 0) return "0시간 0분";

    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);

    return `${h}시간 ${m}분`;
}

export function UseBornDiaryIndex() {
    //-------------------------상태변수
    const [startDate, setStartDate] = useState(""); //네비: 시작일
    const [endDate, setEndDate] = useState(""); //네비: 종료일
    const [loading, setLoading] = useState(false);// 로딩 중인지
    const [avg, setAvg] = useState({});// 평균데이터



    //날짜 관련
    const [currentDate, setCurrentDate] = useState(new Date());// 디테일: 현재 선택된 날짜, 디폴트는 오늘
    const formatDateKr = (date) => { //시간 스트링으로 포맷
        const d = new Date(date);
        const month = d.getMonth() + 1;
        const day = d.getDate();
        const dayArr = ["일", "월", "화", "수", "목", "금", "토"];
        const dayStr = dayArr[d.getDay()];
        return `${month}월 ${day}일 (${dayStr})`;
    };

    //-------------------------버튼 함수
    const handleSearch = async (startDate, endDate) => { // 네비: 날짜 선택후 검색 누르면
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
        const averages = await fetchAvgData(startDate, endDate);
        setAvg(averages);
    }
    const resetDates = () => { // 네비: 날짜 초기화 함수
        setStartDate("");
        setEndDate("");
        setAvg({});
    };

    //평균 데이터 가져오는 함수
    const fetchAvgData = async (start, end) => {
        try {
            const babySeq = sessionStorage.getItem("babySeq");
            const resp = await caxios.get("/dailyrecord", {
                params: {
                    start: start,
                    end: end,
                    baby_seq: babySeq,
                },
            });
            const data = resp.data || [];
            const records = Array.isArray(data.rDTOList) ? data.rDTOList : [];
            console.log(records, "레코드 몇개 가져오는지 확인")

            if (records.length === 0) {
                alert("선택한 기간에 기록이 없습니다.");
                setAvg({});
                resetDates();
                return;
            }
            return calcAverages(records);// 평균치 계산 함수 -> 객체 리턴
        } catch (error) {
            console.error("데이터 불러오기 실패:", error);
            alert("데이터 불러오기 중 오류가 발생했습니다.");
            return {};
        } finally {
            setLoading(false);
        }
    }


    //디테일 데이터가져오는 함수
    const fetchData = async (type, date) => {
        const day = new Date(date).toISOString().split("T")[0];

        try {
            const resp = await caxios.get("/dailyrecord/target", {
                params: {
                    date: day,
                    type,
                    baby_seq: sessionStorage.getItem("babySeq"),
                },
            });

            console.log("기록 데이터:", resp.data);
            return resp.data;
        } catch (e) {
            console.error(e);
            return { rDTOList: [] };
        }
    }



    return {
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        loading,
        avg,
        currentDate,
        setCurrentDate,
        formatDateKr,
        fetchData,
        handleSearch,
        fetchAvgData,
        setAvg
    }
}