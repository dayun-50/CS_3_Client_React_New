import { caxios } from "config/config";
import { calculateFetalWeek } from "member/utils/pregnancyUtils";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";


export function UseDiaryNavi({ selectedWeek, setSelectedWeek, selectedDiaryId, setSelectedDiaryId, getTargetWeekDiary, weekDiaries, handleAddDiary }) {
    const navigate = useNavigate();
    //-------------------상태변수 모음
    //-----------------------아기 정보 모음
    const babySeq = sessionStorage.getItem("babySeq");
    //-----------------------오늘 몇주차 인지
    const babyDueDate = sessionStorage.getItem("babyDueDate");
    const todayKST = getTodayKST();
    const [todayWeek, setTodayWeek] = useState(
        calculateFetalWeek(babyDueDate, todayKST)
    );

    const weekRefs = useRef({});
    const diaryItemRefs = useRef({});
    const hasScrolled = useRef(false); // 첫 마운팅 시에만 실행



    //------------------네비 클릭 함수
    // 주차 항목 클릭 핸들러 :주차를 클릭 + 해당 주차에 맞는 값 가져오기
    const handleWeekClick = (week) => {
        navigate(`/diary?week=${week}`);
        setSelectedWeek((prevWeek) => (prevWeek === week ? null : week));
    };

    // 일기 상세 보기 핸들러
    const handleViewDiary = (e, journal_seq) => {
        e.stopPropagation(); // 목록 접힘 방지
        // 클릭된 일기의 고유 ID를 생성하여 상태에 저장
        const newId = journal_seq;
        setSelectedDiaryId(newId);
        navigate(`/diary?week=${selectedWeek}&seq=${newId}`)

        console.log("선택한시퀀스번호", newId)
    };

    function getTodayKST() {
        // 1) 한국 시간으로 변환된 Date 객체 만들기
        const kst = new Date(
            new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
        );

        // 2) YYYY-MM-DD 만들기
        const year = kst.getFullYear();
        const month = String(kst.getMonth() + 1).padStart(2, "0");
        const day = String(kst.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }


    //------------------ 유즈 이펙트 모음
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