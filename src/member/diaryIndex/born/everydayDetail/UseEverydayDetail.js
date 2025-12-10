import { all } from "axios";
import { caxios } from "config/config";
import {
    Milk,
    Droplets,
    Soup,
    Moon,
    Thermometer,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    PlusCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
export const recordLabelMap = {
    "toilet/pee": "소변",
    "toilet/poop": "대변",
};

export function UseEverydayDetail({ currentDate, setCurrentDate, fetchData, fetchAvgData, startDate, endDate, setAvg }) {
    const typeMap = {
        전체: { color: "#f0d827" },

        분유: { icon: Milk, color: "#ff8cb3", label: "분유" },
        이유식: { icon: Soup, color: "#7adf80", label: "이유식" },
        수면: { icon: Moon, color: "#7abaff", label: "수면" },
        체온: { icon: Thermometer, color: "#ff7a7a", label: "체온" },
        배변: { icon: Droplets, color: "#ffb84d", label: "배변" },
    };

    const reverseTypeMap = {
        전체: "all",
        분유: "milk",
        배변: "toilet",
        이유식: "baby_food",
        수면: "sleep",
        체온: "temperature",
    };

    const [activeType, setActiveType] = useState("전체");
    const [showModal, setShowModal] = useState(false);
    const [targetDayData, setTargetDayData] = useState([]);

    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState(null);

    const openModalForNewLog = (type) => {
        setShowModal(true);
    };
    const closeModal = () => {
        setEditData(null);
        setEditMode(false);
        setShowModal(false);
    }
    const handleTypeClick = (type) => {
        setActiveType(type);
    };

    const handleUpdate = (item) => {
        const baseType = item.record_type.split("/")[0];

        const mappedType =
            baseType === "toilet"
                ? "배변"
                : Object.keys(reverseTypeMap).find(
                    (k) => reverseTypeMap[k] === baseType
                );

        setActiveType(mappedType);
        setEditMode(true);
        setEditData(item);
        setShowModal(true);
    };
    const handleDelete = async (item) => {
        const baseType = item.record_type.split("/")[0];
        try {
            if (baseType == "sleep") {
                await caxios.delete("/dailyrecord/sleep-group", {
                    params: {
                        baby_seq: sessionStorage.getItem("babySeq"),
                        group_id: item.sleep_group_id
                    }
                });
            } else {
                await caxios.delete("/dailyrecord", {
                    params: {
                        baby_seq: sessionStorage.getItem("babySeq"),
                        record_seq: item.record_seq
                    }
                })
            }
            alert("삭제가 완료되었습니다")
            load();
        } catch (error) { }
    }

    const moveDate = (plusOrMinus) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + plusOrMinus);
        if (newDate > new Date()) {
            alert("오늘 이후 날짜로는 이동할 수 없습니다.");
            return;
        }
        setCurrentDate(newDate);
    };
    function getPrevDateStr(dateStr) {
        const d = new Date(dateStr);
        d.setDate(d.getDate() - 1);
        return d.toISOString().split("T")[0];
    }
    function getNextDateStr(dateStr) {
        const d = new Date(dateStr);
        d.setDate(d.getDate() + 1);
        return d.toISOString().split("T")[0];
    }

    function toKST(utcString) {
        const date = new Date(utcString);
        const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
        return kstDate.toISOString().replace("Z", "");
    }

    const load = async () => {
        const formattedDate = currentDate.toLocaleDateString("en-CA", {
            timeZone: "Asia/Seoul",
        });
        const result = await fetchData(reverseTypeMap[activeType], formattedDate);
        let rDTOList = result.rDTOList || [];
        const sleepRecords = rDTOList.filter(r => r.record_type === "sleep");

        const enhancedSleep = await Promise.all(
            sleepRecords.map(async sleepItem => {
                const gid = sleepItem.sleep_group_id;

                const groupResp = await caxios.get("/dailyrecord/sleep-group", {
                    params: { group_id: gid }
                });

                const rawChunks = groupResp.data.rDTOList;
                const chunks = rawChunks.map(c => ({
                    ...c,
                    created_at: toKST(c.created_at)
                }));

                const todayStr = formattedDate;
                const prevStr = getPrevDateStr(formattedDate);
                const nextStr = getNextDateStr(formattedDate);

                const todayChunks = chunks.filter(c => c.created_at.startsWith(todayStr));
                const prevChunks = chunks.filter(c => c.created_at.startsWith(prevStr));
                const nextChunks = chunks.filter(c => c.created_at.startsWith(nextStr));

                const prevTotal = prevChunks.reduce((sum, c) => sum + (c.amount_value || 0), 0);
                const nextTotal = nextChunks.reduce((sum, c) => sum + (c.amount_value || 0), 0);

                const earliestPrev = prevChunks.length
                    ? new Date(prevChunks[0].created_at)
                    : null;

                return {
                    ...sleepItem,
                    prevTotal,
                    nextTotal,
                    prevStart: earliestPrev
                };
            })
        );

        rDTOList = rDTOList.map(item => {
            if (item.record_type !== "sleep") return item;
            return enhancedSleep.find(e => e.record_seq === item.record_seq) || item;
        });

        setTargetDayData(rDTOList);
    };

    useEffect(() => {
        load();
    }, [activeType, currentDate]);


    return {
        moveDate,
        typeMap,
        activeType,
        handleTypeClick,
        openModalForNewLog,
        closeModal,
        showModal,
        targetDayData,
        reverseTypeMap,
        setTargetDayData,
        handleUpdate,
        editMode,
        setEditMode,
        editData,
        setEditData,
        handleDelete,
        load
    }
}