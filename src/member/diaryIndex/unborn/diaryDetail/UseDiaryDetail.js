import { caxios } from "config/config";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Highlight from "@tiptap/extension-highlight"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import TextAlign from "@tiptap/extension-text-align"
import Typography from "@tiptap/extension-typography"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import Blockquote from "@tiptap/extension-blockquote"
import CodeBlock from "@tiptap/extension-code-block"
import { useEditor } from "@tiptap/react";


// json 파싱용
export const extensions = [
    StarterKit.configure({
        codeBlock: false,
        blockquote: false,
    }),

    CodeBlock,
    Blockquote,

    TaskList,
    TaskItem.configure({
        nested: true,
    }),

    Image.configure({
        inline: false,
        allowBase64: true,
    }),

    Highlight,
    Subscript,
    Superscript,
    Typography,

    TextAlign.configure({
        types: ["heading", "paragraph"],
    }),
]





export function UseDiaryDetail({ selectedWeek, setSelectedDiaryId, getTargetWeekDiary }) {

    const navigate = useNavigate();
    const [params] = useSearchParams();
    const seq = params.get("seq"); // url에서 seq 추출
    const babySeq = sessionStorage.getItem("babySeq");
    const id = sessionStorage.getItem("id");

    //-----------------------------------------상태변수 모음
    const [targetDiaryContent, setTargetDiaryContent] = useState({});

    //에디터 파싱 옵션
    const editor = useEditor({
        extensions,
        content: "",
        editable: false
    });

    //---------------------------------------버튼 함수
    const handleDeleteDiary = (journal_seq) => { //삭제
        caxios.delete(`/diary/${seq}`).then(
            resp => {
                alert("삭제가 완료 되었습니다!");
                setSelectedDiaryId(null); //선택한 아이디도 비우기
                getTargetWeekDiary(selectedWeek, babySeq); //목록 새로고침
                navigate("/diary?week=" + selectedWeek); //일기 목록으로 이동
            }
        )
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



    return {
        seq,
        navigate,
        targetDiaryContent,
        editor,
        id,
        handleDeleteDiary
    }
}