import { caxios } from "config/config";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEditor } from "@tiptap/react";
import { editorExtensions } from "member/utils/editorSetting";

export function UseDiaryDetail({ selectedWeek, setSelectedDiaryId, getTargetWeekDiary, setSelectedWeek }) {

    const navigate = useNavigate();
    const [params] = useSearchParams();
    const seq = params.get("seq");
    const babySeq = sessionStorage.getItem("babySeq");
    const id = sessionStorage.getItem("id");
    const [targetDiaryContent, setTargetDiaryContent] = useState({});
    const [isDeleting, setIsDeleting] = useState(false);

    const editor = useEditor({
        extensions: editorExtensions,
        content: "",
        editable: false
    });

    const handleDeleteDiary = (journal_seq) => {
        if (isDeleting) return;
        setIsDeleting(true)
        caxios.delete(`/diary/${seq}`).then(
            resp => {
                alert("삭제가 완료 되었습니다!");
                setSelectedDiaryId(null);
                getTargetWeekDiary(selectedWeek, babySeq);
                navigate("/diary?week=" + selectedWeek);
            }
        ).finally(() => {
            setIsDeleting(false);
        })
    }

    const handleUpdateDiary = (journal_seq, selectedWeek) => {
        navigate("/diary/write", {
            state: {
                mode: "edit",
                journal_seq: journal_seq,
                week: selectedWeek
            }
        })
    }

    useEffect(() => {
        if (!seq) return;

        caxios.get(`/diary/${seq}`, { headers: { "BABY": babySeq } }).then(
            resp => {
                setTargetDiaryContent(resp.data);
            }
        )
    }, [seq])


    useEffect(() => {
        if (!editor || !targetDiaryContent?.content) return;

        try {
            const parsed = JSON.parse(targetDiaryContent.content);
            editor.commands.setContent(parsed);
        } catch (e) { }
    }, [editor, targetDiaryContent]);

    useEffect(() => {
        if (targetDiaryContent?.pregnancy_week) {
            setSelectedWeek(targetDiaryContent.pregnancy_week);
        }
    }, [targetDiaryContent]);

    return {
        seq,
        navigate,
        targetDiaryContent,
        editor,
        id,
        handleDeleteDiary,
        handleUpdateDiary,
        isDeleting
    }
}