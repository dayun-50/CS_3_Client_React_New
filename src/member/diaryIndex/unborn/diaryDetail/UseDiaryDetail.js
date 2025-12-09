import { caxios } from "config/config";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEditor } from "@tiptap/react";
import { editorExtensions } from "member/utils/editorSetting";





export function UseDiaryDetail({ selectedWeek, setSelectedDiaryId, getTargetWeekDiary, setSelectedWeek }) {

    const navigate = useNavigate();
    const [params] = useSearchParams();
    const seq = params.get("seq"); // url에서 seq 추출
    const babySeq = sessionStorage.getItem("babySeq");
    const id = sessionStorage.getItem("id");


    //-----------------------------------------상태변수 모음
    const [targetDiaryContent, setTargetDiaryContent] = useState({});
    const [isDeleting, setIsDeleting] = useState(false);



    //에디터 파싱 옵션
    const editor = useEditor({
        extensions: editorExtensions,
        content: "",
        editable: false
    });


    //---------------------------------------버튼 함수
    const handleDeleteDiary = (journal_seq) => { //삭제
        if (isDeleting) return;
        setIsDeleting(true)
        caxios.delete(`/diary/${seq}`).then(
            resp => {
                alert("삭제가 완료 되었습니다!");
                setSelectedDiaryId(null); //선택한 아이디도 비우기
                getTargetWeekDiary(selectedWeek, babySeq); //목록 새로고침
                navigate("/diary?week=" + selectedWeek); //일기 목록으로 이동
            }
        ).finally(() => {
            setIsDeleting(false);
        })
    }

    const handleUpdateDiary = (journal_seq, selectedWeek) => { //수정
        navigate("/diary/write", {
            state: {
                mode: "edit",
                journal_seq: journal_seq,
                week: selectedWeek
            }
        })
    }


    //-----------------------------------------유즈 이펙트 모음
    useEffect(() => {
        if (!seq) return;

        caxios.get(`/diary/${seq}`, { headers: { "BABY": babySeq } }).then(
            resp => {
                console.log(resp, "디테일 클릭하고 결과")
                setTargetDiaryContent(resp.data);
            }
        )
    }, [seq])


    useEffect(() => {//에디터 내용 복원(json 파싱)
        if (!editor || !targetDiaryContent?.content) return;

        try {
            const parsed = JSON.parse(targetDiaryContent.content);
            editor.commands.setContent(parsed);
        } catch (e) {
            console.error("에디터 복원 실패", e);
        }
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