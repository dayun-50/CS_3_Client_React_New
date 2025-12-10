import { caxios } from "config/config";
import { calculateFetalWeek } from "member/utils/pregnancyUtils";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export function UseDiaryNavi({ selectedWeek, setSelectedWeek, selectedDiaryId, setSelectedDiaryId, getTargetWeekDiary, weekDiaries, handleAddDiary }) {
    const navigate = useNavigate();
    const babySeq = sessionStorage.getItem("babySeq");
    const babyDueDate = sessionStorage.getItem("babyDueDate");
    const todayKST = getTodayKST();
    const [todayWeek, setTodayWeek] = useState(
        calculateFetalWeek(babyDueDate, todayKST)
    );

    const weekRefs = useRef({});
    const diaryItemRefs = useRef({});
    const hasScrolled = useRef(false);

    const handleWeekClick = (week) => {
        navigate(`/diary?week=${week}`);
        setSelectedWeek((prevWeek) => (prevWeek === week ? null : week));
        setSelectedDiaryId(null);
    };

    const handleViewDiary = (e, journal_seq) => {
        e.stopPropagation();
        const newId = journal_seq;
        setSelectedDiaryId(newId);
        navigate(`/diary?week=${selectedWeek}&seq=${newId}`)
    };

    function getTodayKST() {
        const kst = new Date(
            new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
        );

        const year = kst.getFullYear();
        const month = String(kst.getMonth() + 1).padStart(2, "0");
        const day = String(kst.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }


    useEffect(() => {
        if (hasScrolled.current) return;
        const numKey = Number(todayWeek);

        const target = weekRefs.current[numKey];
        if (!target) {
            return;
        }

        target.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
        hasScrolled.current = true;
    }, [todayWeek, weekDiaries]);


    useEffect(() => {
        if (selectedWeek) {
            getTargetWeekDiary(selectedWeek, babySeq)
        }
    }, [selectedWeek])

    return {
        handleWeekClick,
        handleViewDiary,
        weekDiaries,
        weekRefs,
        getTargetWeekDiary,
        diaryItemRefs
    }
}