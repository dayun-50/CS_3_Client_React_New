import { caxios } from "config/config";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";


export function UseUnBornDiaryIndex() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const initWeek = params.get("week");
    const initSeq = params.get("seq");
    const [isSubmitting, setIsSubmitting] = useState(false);//제출중이면 연타 막기

    const [selectedWeek, setSelectedWeek] = useState(initWeek ? Number(initWeek) : null); // 초기값: 아무것도 선택되지 않음
    const [selectedDiaryId, setSelectedDiaryId] = useState(initSeq ? Number(initSeq) : null); // 일기 선택 상태 추가
    const [weekDiaries, setWeekDiaries] = useState( //5~40주까지 주차별 배열 만들기
        Array.from({ length: 36 }, (_, i) => {
            const week = i + 5; //5주차 부터 시작
            return {
                week,
                id: week,
                diaries: []
            }
        })
    );



    //주차별 일기 dto 리스트 데이터 가져오기
    const getTargetWeekDiary = (week, babySeq) => {
        caxios.get(`/diary/week/${week}`, { headers: { "BABY": babySeq } }).then(resp => {
            resp.data.list &&
                setWeekDiaries(prev =>
                    prev.map(w =>
                        w.week == week ? { ...w, diaries: resp.data.list } : w
                    )
                )
        })
    }

    // 플러스 버튼 클릭 핸들러 (다이어리 작성 페이지로 이동)
    const handleAddDiary = (e, week) => {
        e.stopPropagation(); // 목록 접힘 방지
        navigate("write", {
            state:
                { week: week }
        });
    };


    return {
        selectedWeek,
        setSelectedWeek,
        selectedDiaryId,
        setSelectedDiaryId,
        getTargetWeekDiary,
        weekDiaries,
        handleAddDiary,
        isSubmitting,
        setIsSubmitting
    }
}