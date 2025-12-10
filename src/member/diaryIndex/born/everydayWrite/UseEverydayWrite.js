import { caxios } from "config/config";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export function calculateSleepChunks(start, end) {
    const chunks = [];
    const sameDay = start.toDateString() === end.toDateString();

    if (sameDay) {
        const diffMinutes = (end - start) / 1000 / 60;
        chunks.push({
            created_at: start.toISOString(),
            amount_value: diffMinutes,
        });
        return chunks;
    }

    const endOfDay = new Date(start);
    endOfDay.setHours(24, 0, 0, 0);

    const firstMinutes = (endOfDay - start) / 1000 / 60;
    chunks.push({
        created_at: start.toISOString(),
        amount_value: firstMinutes,
    });

    const startOfTomorrow = new Date(end);
    startOfTomorrow.setHours(0, 0, 0, 0);

    const secondMinutes = (end - startOfTomorrow) / 1000 / 60;
    chunks.push({
        created_at: startOfTomorrow.toISOString(),
        amount_value: secondMinutes,
    });

    return chunks;
}

export function UseEverydayWrite({ closeModal, currentDate, fetchData, reverseTypeMap, setTargetDayData, fetchAvgData, startDate, endDate, setAvg, targetDayData, editMode, setEditMode, editData, setEditData, activeType, load }) {
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

    const [time, setTime] = useState("");
    const [amountValue, setAmountValue] = useState();
    const [pooType, setPooType] = useState("");
    const [sleepStart, setSleepStart] = useState(null);
    const [sleepEnd, setSleepEnd] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const startMin = currentDate.toISOString().split("T")[0] + "T00:00";
    const startMax = currentDate.toISOString().split("T")[0] + "T23:59";

    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1);

    const endMin = startMin;
    const endMax = nextDate.toISOString().split("T")[0] + "T23:59";

    function buildDateTime(dateObj, timeStr) {
        const datePart = dateObj.toISOString().split("T")[0];
        return `${datePart}T${timeStr}:00+09:00`;
    }
    function buildDateTimeFromLocal(localStr) {
        return localStr + ":00+09:00";
    }
    function toLocalTimeHHmm(isoString) {
        const d = new Date(isoString);
        const hh = String(d.getHours()).padStart(2, "0");
        const mm = String(d.getMinutes()).padStart(2, "0");
        return `${hh}:${mm}`;
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

            const times = chunks.map(c => {
                const start = new Date(c.created_at);
                const end = new Date(c.created_at);
                end.setMinutes(end.getMinutes() + (c.amount_value || 0));
                return { start, end };
            });

            const start = new Date(Math.min(...times.map(t => t.start.getTime())));

            const end = new Date(Math.max(...times.map(t => t.end.getTime())));
            ranges.push({ start, end, group_id: gid });
        }
        return ranges;
    }


    const handleAdd = async (activeType) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        if (activeType === "수면") {
            if (!sleepStart) { setIsSubmitting(false); return alert("수면 시작 시간을 입력하세요.") };
        } else {
            if (!time) { setIsSubmitting(false); return alert("시간을 입력해주세요.") };
        }

        const created_at = buildDateTime(currentDate, time);
        let payloadList = [];

        const record_type = {
            "소변": "toilet/pee",
            "대변": "toilet/poop",
        }[pooType];
        switch (activeType) {
            case "분유":
            case "이유식":
                if (!amountValue) {
                    setIsSubmitting(false)
                    return alert("용량을 입력하세요.")
                };
                if (!/^[1-9][0-9]*$/.test(amountValue)) {
                    setIsSubmitting(false)
                    return alert("올바른 용량을 입력하세요. (0으로 시작 불가)");
                }
                const milkValue = Number(amountValue);
                if (milkValue < 1 || milkValue > 300) {
                    setIsSubmitting(false)
                    return alert("올바른 용량을 입력하세요");
                }
                payloadList.push({
                    created_at,
                    record_type: activeType === "분유" ? "milk" : "baby_food",
                    amount_value: milkValue
                });
                break;

            case "체온":
                if (!amountValue) {
                    setIsSubmitting(false)
                    return alert("체온을 입력하세요.")
                };

                if (!/^(?:\d{2}|\d{2}\.\d)$/.test(amountValue)) {
                    setIsSubmitting(false)
                    return alert("체온은 정수 또는 소수점 한 자리까지 입력해주세요. (예: 36, 36.5)");
                }
                const temp = Number(amountValue);
                if (temp < 35.0 || temp > 41.0) {
                    setIsSubmitting(false)
                    return alert("체온은 35.0°C ~ 41.0°C 범위여야 합니다.");
                }
                payloadList.push({
                    created_at,
                    record_type: "temperature",
                    amount_value: temp
                });
                break;

            case "배변":
                if (!pooType) {
                    setIsSubmitting(false)
                    return alert("종류를 선택하세요.")
                };
                payloadList.push({
                    created_at,
                    record_type: pooType === "소변" ? "toilet/pee" : "toilet/poop",
                    amount_value: 1
                })
                break;

            case "수면":
                if (!sleepStart) return alert("수면 시작 시간을 입력하세요.");
                if (sleepEnd && new Date(sleepEnd) < new Date(sleepStart)) {
                    setIsSubmitting(false)
                    return alert("수면 종료 시간은 시작 시간보다 빠를 수 없습니다.");
                }

                const sleepGroupId = editMode ? editData.sleep_group_id : uuidv4();
                const start = new Date(sleepStart + ":00");
                const end = sleepEnd ? new Date(sleepEnd + ":00") : new Date(sleepStart + ":00");

                const rangeResp = await caxios.get("/dailyrecord/sleep-range", {
                    params: {
                        baby_seq: sessionStorage.getItem("babySeq"),
                        date: currentDate.toISOString().split("T")[0],
                    }
                });

                let ranges = getSleepRanges(rangeResp.data.rDTOList);

                if (editMode) {
                    ranges = ranges.filter(r => r.group_id !== sleepGroupId);
                }

                for (const r of ranges) {
                    if (isOverlapping(start, end, r.start, r.end)) {
                        setIsSubmitting(false)
                        return alert("이미 기록된 수면 시간과 겹칩니다.");
                    }
                }

                if (!sleepEnd) {
                    payloadList.push({
                        created_at: buildDateTimeFromLocal(sleepStart),
                        record_type: "sleep",
                        amount_value: null,
                        sleep_group_id: sleepGroupId
                    })

                } else {
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
                setIsSubmitting(false)
                return alert("알 수 없는 타입");
        }

        try {
            if (!editMode) {
                const resp = await caxios.post(`/dailyrecord`, payloadList, {
                    params: {
                        baby_seq: sessionStorage.getItem("babySeq"),
                    },
                });
                alert("입력이 완료되었습니다!");
            } else {
                console.log(payloadList);
                if (activeType === "수면") {
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
            load();
            closeModal();
            reset();

            if (startDate) {
                const averages = await fetchAvgData(startDate, endDate);
                setAvg(averages);
            }

        } catch (err) {
            alert("저장 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const reset = () => {
        setTime("");
        setAmountValue({});
        setPooType("");
        setSleepStart(null);
        setSleepEnd(null);
    }

    useEffect(() => {
        if (editMode && editData) {
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
                    const chunks = res.data.rDTOList;

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
        endMax,
        isSubmitting
    }
}