import { caxios } from "config/config";
import { useState } from "react";

export function calcAverages(records) {

    const byDate = groupByDate(records);
    const dates = Object.keys(byDate);
    if (dates.length === 0) return {};

    const perDay = {
        milk: [],
        baby_food: [],
        sleep: [],
        temperature: [],
        pee: [],
        poop: [],
    };

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
        if (tempList.length > 0) {
            const tempAvgPerDay = tempList.reduce((a, b) => a + b, 0) / tempList.length;
            perDay.temperature.push(tempAvgPerDay);
        }
    });

    perDay.sleep = Object.keys(sleepByDate)
        .sort()
        .map(date => Number(sleepByDate[date]));
    const average = arr =>
        arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;


    const milkAvg = average(perDay.milk);
    const foodAvg = average(perDay.baby_food);

    const sleepAvg = formatSleep(average(perDay.sleep));
    const tempAvg = average(perDay.temperature);

    const peeAvg = average(perDay.pee);
    const poopAvg = average(perDay.poop);
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
export function formatSleep(minutes) {
    if (!minutes || minutes <= 0) return "0시간 0분";

    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);

    return `${h}시간 ${m}분`;
}

export function UseBornDiaryIndex() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [avg, setAvg] = useState({});
    const [currentDate, setCurrentDate] = useState(new Date());

    const formatDateKr = (date) => {
        const d = new Date(date);
        const month = d.getMonth() + 1;
        const day = d.getDate();
        const dayArr = ["일", "월", "화", "수", "목", "금", "토"];
        const dayStr = dayArr[d.getDay()];
        return `${month}월 ${day}일 (${dayStr})`;
    };

    const handleSearch = async (startDate, endDate) => {
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
    const resetDates = () => {
        setStartDate("");
        setEndDate("");
        setAvg({});
    };

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

            if (records.length === 0) {
                alert("선택한 기간에 기록이 없습니다.");
                setAvg({});
                resetDates();
                return;
            }
            return calcAverages(records);
        } catch (error) {
            alert("데이터 불러오기 중 오류가 발생했습니다.");
            return {};
        } finally {
            setLoading(false);
        }
    }

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
            return resp.data;
        } catch (e) {
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