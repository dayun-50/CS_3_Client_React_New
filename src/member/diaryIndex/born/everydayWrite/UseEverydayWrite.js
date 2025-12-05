import { caxios } from "config/config";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export function calculateSleepChunks(start, end) {
    const chunks = [];

    // 1) 같은 날짜인지 체크
    const sameDay = start.toDateString() === end.toDateString();

    // 2) 동일 날짜면 간단 계산
    if (sameDay) {
        const diffMinutes = (end - start) / 1000 / 60;
        chunks.push({
            created_at: start.toISOString(),
            amount_value: diffMinutes,
        });
        return chunks;
    }

    // 3) 날짜 다르면 첫날 계산
    const endOfDay = new Date(start);
    endOfDay.setHours(24, 0, 0, 0); // 자정

    const firstMinutes = (endOfDay - start) / 1000 / 60;
    chunks.push({
        created_at: start.toISOString(),
        amount_value: firstMinutes,
    });

    // 4) 다음날 계산
    const startOfTomorrow = new Date(end);
    startOfTomorrow.setHours(0, 0, 0, 0);

    const secondMinutes = (end - startOfTomorrow) / 1000 / 60;
    chunks.push({
        created_at: startOfTomorrow.toISOString(),
        amount_value: secondMinutes,
    });

    return chunks;
}



export function UseEverydayWrite({ closeModal, currentDate, fetchData, reverseTypeMap, setTargetDayData, fetchAvgData, startDate, endDate, setAvg, targetDayData, editMode, setEditMode, editData, setEditData, activeType }) {
    //타입에 따른 ui에 필요한 값 매핑하는 기본값 가져오기
    const getLogDetails = (logType) => {
        switch (logType) {
            case "분유":
            case "이유식":
                return { unit: "ml", inputType: "number", label: "용량" };
            case "배변":
                return { options: { type: ["소변", "대변"] }, inputType: "group", label: "배변 기록" };
            case "수면":
                return { inputType: "", label: "총 시간", unit: "시간" };
            case "체온":
                return { unit: "°C", inputType: "number", label: "체온" };
            default:
                return { unit: "", inputType: "text", label: "내용" };
        }
    };

    //-------------------------------------------------------상태변수
    const [time, setTime] = useState(""); // 시간 입력 상태변수
    const [amountValue, setAmountValue] = useState(); //용량 입력 상태변수
    const [pooType, setPooType] = useState(""); //배변 종류 상태변수

    const [sleepStart, setSleepStart] = useState(null); //수면 시작 시간
    const [sleepEnd, setSleepEnd] = useState(null); // 수면 종료 시간


    // --- 수면 시작 시간 min/max 세팅 ---
    const startMin = currentDate.toISOString().split("T")[0] + "T00:00";
    const startMax = currentDate.toISOString().split("T")[0] + "T23:59";

    // --- 종료 시간 min/max 세팅 ---
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1);

    const endMin = startMin;   // 종료 최소는 시작일 00:00
    const endMax = nextDate.toISOString().split("T")[0] + "T23:59"; // 다음날 23:59까지





    //---------------------------------- currentDate 포맷용
    function buildDateTime(dateObj, timeStr) {
        const datePart = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD
        return `${datePart}T${timeStr}:00+09:00`;
    }
    function buildDateTimeFromLocal(localStr) {
        // localStr example: "2025-12-04T22:30"
        return localStr + ":00+09:00";
    }
    function toLocalTimeHHmm(isoString) {
        const d = new Date(isoString); // "2025-12-04T01:00:00.000+00:00"
        const hh = String(d.getHours()).padStart(2, "0");   // 로컬 기준 시
        const mm = String(d.getMinutes()).padStart(2, "0"); // 로컬 기준 분
        return `${hh}:${mm}`; // "10:00"
    }
    function toLocalDatetimeLocalValue(date) {
        const local = new Date(date);
        const YYYY = local.getFullYear();
        const MM = String(local.getMonth() + 1).padStart(2, '0');
        const DD = String(local.getDate()).padStart(2, '0');
        const hh = String(local.getHours()).padStart(2, '0');
        const mm = String(local.getMinutes()).padStart(2, '0');
        return `${YYYY}-${MM}-${DD}T${hh}:${mm}`;
    }

    //-------------------------- 기록 목록을 sleep group 단위로 묶어서 시작~끝 범위 구하기
    // function getSleepRanges(existingRecords) {
    //     const sleepRecords = existingRecords.filter(r => r.record_type === "sleep");
    //     const groups = {};

    //     sleepRecords.forEach(r => {
    //         const gid = r.sleep_group_id || `single-${r.created_at}`;
    //         if (!groups[gid]) groups[gid] = [];
    //         groups[gid].push(r);
    //     });

    //     const ranges = [];

    //     for (const gid in groups) {
    //         const chunks = groups[gid];

    //         const start = new Date(chunks[0].created_at);

    //         let end = new Date(chunks[0].created_at);
    //         end.setMinutes(end.getMinutes() + chunks[0].amount_value);

    //         chunks.forEach(c => {
    //             const cs = new Date(c.created_at);
    //             const ce = new Date(c.created_at);
    //             ce.setMinutes(ce.getMinutes() + c.amount_value);

    //             if (cs < start) start.setTime(cs.getTime());
    //             if (ce > end) end.setTime(ce.getTime());
    //         });

    //         ranges.push({ start, end, group_id: gid });
    //     }

    //     return ranges;
    // }
    // 두 구간이 겹치는지 확인
    function isOverlapping(start1, end1, start2, end2) {
        return start1 < end2 && start2 < end1;
    }
    function getSleepRanges(existingRecords) {
        const sleepRecords = existingRecords.filter(r => r.record_type === "sleep");
        const groups = {};

        sleepRecords.forEach(r => {
            const gid = r.sleep_group_id || `single-${r.created_at}`;
            if (!groups[gid]) groups[gid] = [];
            groups[gid].push(r);
        });

        const ranges = [];

        for (const gid in groups) {
            const chunks = groups[gid];

            // 각 청크의 시작/끝 시간을 모두 계산
            const times = chunks.map(c => {
                const start = new Date(c.created_at);
                const end = new Date(c.created_at);
                end.setMinutes(end.getMinutes() + (c.amount_value || 0));
                return { start, end };
            });

            // 모든 시작 시간 중 가장 이른 시간
            const start = new Date(Math.min(...times.map(t => t.start.getTime())));

            // 모든 끝 시간 중 가장 늦은 시간
            const end = new Date(Math.max(...times.map(t => t.end.getTime())));

            ranges.push({ start, end, group_id: gid });
        }

        return ranges;
    }


    //---------------------------------------------------------입력 완료 버튼
    const handleAdd = async (activeType) => { //기록 완료 ->axios로 백엔드에 저장


        if (activeType === "수면") {
            if (!sleepStart) return alert("수면 시작 시간을 입력하세요.");
            // 수면은 여기서 끝! 아래 time 검사는 타지 않음
        } else {
            if (!time) return alert("시간을 입력해주세요.");
        }

        const created_at = buildDateTime(currentDate, time);

        //1. 발송할 데이터
        let payloadList = [];


        //2. 타입별 분기 처리
        const record_type = {
            "소변": "toilet/pee",
            "대변": "toilet/poop",
        }[pooType];
        switch (activeType) {
            // --------------------------- 분유 / 이유식 ---------------------------
            case "분유":
            case "이유식":
                if (!amountValue) return alert("용량을 입력하세요.");
                payloadList.push({
                    created_at,
                    record_type: activeType === "분유" ? "milk" : "baby_food",
                    amount_value: Number(amountValue)
                })
                break;

            // --------------------------- 체온 ---------------------------
            case "체온":
                if (!amountValue) return alert("체온을 입력하세요.");
                payloadList.push({
                    created_at,
                    record_type: "temperature",
                    amount_value: Number(amountValue)
                })
                break;

            // --------------------------- 배변 ---------------------------
            case "배변":
                if (!pooType) return alert("종류를 선택하세요.");
                payloadList.push({
                    created_at,
                    record_type: pooType === "소변" ? "toilet/pee" : "toilet/poop",
                    amount_value: 1
                })
                break;

            // --------------------------- 수면 ---------------------------
            case "수면":
                if (!sleepStart) return alert("수면 시작 시간을 입력하세요."); //0. 시작시간이 없다면 반려
                if (sleepEnd && new Date(sleepEnd) < new Date(sleepStart)) {
                    return alert("수면 종료 시간은 시작 시간보다 빠를 수 없습니다.");
                }

                const sleepGroupId = editMode ? editData.sleep_group_id : uuidv4();
                const start = new Date(sleepStart + ":00");
                const end = sleepEnd ? new Date(sleepEnd + ":00") : new Date(sleepStart + ":00"); // 끝시간 없으면 시작 = 끝

                // 1. 겹침 검사: 기존 데이터 하루 전~하루 후까지 모두 가져오기 (백엔드 API 필요)
                const rangeResp = await caxios.get("/dailyrecord/sleep-range", {
                    params: {
                        baby_seq: sessionStorage.getItem("babySeq"),
                        date: currentDate.toISOString().split("T")[0],
                    }
                });

                let ranges = getSleepRanges(rangeResp.data.rDTOList);

                // 2. 수정 모드 → 자기 그룹 제외
                if (editMode) {
                    ranges = ranges.filter(r => r.group_id !== sleepGroupId);
                }

                // 3. 겹침 검사 실행
                for (const r of ranges) {
                    if (isOverlapping(start, end, r.start, r.end)) {
                        return alert("이미 기록된 수면 시간과 겹칩니다.");
                    }
                }

                if (!sleepEnd) { // 1. 끝나는 시간이 없다면  총시간 없이 시작시간만 기록
                    payloadList.push({
                        created_at: buildDateTimeFromLocal(sleepStart),
                        record_type: "sleep",
                        amount_value: null,
                        sleep_group_id: sleepGroupId
                    })

                } else { //2. 끝나는 시간 있다면, 시작~끝나는 시간으로 총시간 계산 후 여러개 청크로 나누어 기록
                    const chunks = calculateSleepChunks(start, end);

                    chunks.forEach(chunk => {
                        payloadList.push({
                            created_at: chunk.created_at,
                            record_type: "sleep",
                            amount_value: chunk.amount_value,
                            sleep_group_id: sleepGroupId
                        });
                    });
                }
                break;

            default:
                return alert("알 수 없는 타입");
        }

        try {

            if (!editMode) {// 1) 기록 저장 : 입력
                const resp = await caxios.post(`/dailyrecord`, payloadList, {
                    params: {
                        baby_seq: sessionStorage.getItem("babySeq"),
                    },
                });
                alert("입력이 완료되었습니다!");
            } else {
                // 수정
                console.log(payloadList);
                if (activeType === "수면") {
                    // 수면: 기존 그룹 삭제 후 재생성
                    await caxios.delete("/dailyrecord/sleep-group", {
                        params: {
                            baby_seq: sessionStorage.getItem("babySeq"),
                            group_id: editData.sleep_group_id
                        }
                    });

                    await caxios.post("/dailyrecord", payloadList, {
                        params: { baby_seq: sessionStorage.getItem("babySeq") }
                    });
                } else {
                    // 다른 타입: 기존 방식
                    payloadList = payloadList.map(payload => ({
                        ...payload,
                        record_seq: editData.record_seq
                    }));

                    await caxios.put("/dailyrecord", payloadList, {
                        params: {
                            baby_seq: sessionStorage.getItem("babySeq"),
                            record_seq: editData.record_seq,
                        }
                    });
                }
                alert("수정이 완료되었습니다!");
            }
            closeModal();
            reset();
            ;

            // 2) 오른쪽 디테일 카드 리패치
            const result = await fetchData(reverseTypeMap[activeType], currentDate);
            const rDTOList = result.rDTOList || [];
            setTargetDayData(rDTOList);

            // 3) 왼쪽 네비 평균 리패치
            if (startDate) {
                const averages = await fetchAvgData(startDate, endDate);
                setAvg(averages);
            }

        } catch (err) {
            console.error(err);
            alert("저장 중 오류가 발생했습니다.");
        }
    };





    //---------------------------------------전체 리셋하는 함수
    const reset = () => {
        setTime("");
        setAmountValue({});
        setPooType("");
        setSleepStart(null);
        setSleepEnd(null);
    }



    //----------------------------------------유즈이펙트 모음
    useEffect(() => {
        if (editMode && editData) {
            console.log(editData);
            // 타입별로 기존 값 채워 넣기
            if (activeType === "배변") {
                setPooType(editData.record_type === "toilet/pee" ? "소변" : "대변");
                setTime(toLocalTimeHHmm(editData.created_at));
            }
            if (activeType === "분유" || activeType === "이유식") {
                setAmountValue(editData.amount_value);
                setTime(toLocalTimeHHmm(editData.created_at));
            }
            if (activeType === "체온") {
                setAmountValue(editData.amount_value);
                setTime(toLocalTimeHHmm(editData.created_at));
            }

            if (activeType === "수면") {

                caxios.get("/dailyrecord/sleep-group", {
                    params: { group_id: editData.sleep_group_id }
                }).then(res => {
                    const chunks = res.data.rDTOList; // 전체 1~2개 데이터
                    console.log(chunks)


                    const start = new Date(chunks[0].created_at);
                    const last = chunks[chunks.length - 1];
                    const end = new Date(last.created_at);
                    end.setMinutes(end.getMinutes() + last.amount_value);

                    setSleepStart(toLocalDatetimeLocalValue(start));
                    setSleepEnd(toLocalDatetimeLocalValue(end));
                });

            }
        }
    }, [editMode, editData]);


    return {
        getLogDetails,
        handleAdd,
        time,
        setTime,
        pooType,
        setPooType,
        amountValue,
        setAmountValue,
        setSleepStart,
        setSleepEnd,
        sleepStart,
        sleepEnd,
        startMin,
        startMax,
        endMin,
        endMax
    }
}