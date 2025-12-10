import { caxios } from "config/config";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";


export function UseUnBornDiaryIndex() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const initWeek = params.get("week");
    const initSeq = params.get("seq");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [selectedWeek, setSelectedWeek] = useState(initWeek ? Number(initWeek) : null);
    const [selectedDiaryId, setSelectedDiaryId] = useState(initSeq ? Number(initSeq) : null);
    const [weekDiaries, setWeekDiaries] = useState(
        Array.from({ length: 36 }, (_, i) => {
            const week = i + 5;
            return {
                week,
                id: week,
                diaries: []
            }
        })
    );

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

    const handleAddDiary = (e, week) => {
        e.stopPropagation(); 
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