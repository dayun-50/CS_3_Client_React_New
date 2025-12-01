import { caxios } from "config/config";
import { calculateFetalWeek } from "member/utils/pregnancyUtils";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "store/useStore";

export function UseDiaryWrite({ getTargetWeekDiary, setSelectedDiaryId }) {
    const navigate = useNavigate();
    const babySeq = sessionStorage.getItem("babySeq");
    const week = useLocation().state?.week;//몇번째 주차 선택햇는지에 대하여



    //--------------------------------상태변수 모음
    const [content, setContent] = useState("");

    // ----------- 에디터 내의 이미지 상태변수 -----------
    const [editorInstance, setEditorInstance] = useState(null);
    const editorRef = useRef(null);
    const titleRef = useRef(null);

    // imageSysList용 :작성완료된 글에서 미리보기된 파일 sysname 추출
    const extractImages = (node, arr = []) => {
        if (!node) return arr;
        if (node.type === "image") {
            const url = node.attrs.src;
            const sysname = url.split("/").pop(); // 파일명 추출
            arr.push(sysname);
        }
        if (node.content) {
            node.content.forEach(child => extractImages(child, arr));
        }
        return arr;
    };


    //--------------------------------유즈이펙트
    // useEffect(() => {
    //     selectedDiaryId(null); //글작성 페이지로 오면 nul
    // }, [])


    //--------------------------------작성 완료시
    const handleComplete = async () => {
        if (!editorInstance) return;


        const title = titleRef.current?.value || "";
        // tiptap 에디터 텍스트 추출
        const editorText = editorInstance?.getText().replace(/\s/g, "");
        const contentJSON = editorInstance.getJSON(); //컨텐츠
        const imageSysList = extractImages(contentJSON); //이미지의 시스네임 리스트
        // 제목이 비었거나, 에디터가 비었거나, 엔터/공백만 있을 때
        if (!title.trim()) {
            alert("제목을 입력하세요");
            return;
        }

        if (!editorText && imageSysList.length === 0) {
            alert("내용을 입력하거나 이미지를 추가하세요");
            return;
        }

        const form = new FormData();
        // 1) 에디터 JSON 담기
        form.append("title", titleRef.current.value);
        form.append("content", JSON.stringify(contentJSON));
        // 2) 이미지 리스트 담기
        form.append("imageSysList", JSON.stringify(imageSysList));
        //3) 태아 주차 값 전달
        form.append("pregnancy_week", week);//임신주차(버튼 +눌럿을 때 해당 주차)
        console.log(week)
        //4) 아기 시퀀스
        form.append("babySeq", babySeq);


        try {
            await caxios.post("/diary", form)
                .then(resp => {
                    console.log(resp);
                    getTargetWeekDiary(week, babySeq) //왼쪽 네비바에서 바로 반영될 수 있도록
                    setSelectedDiaryId(resp.data)//선택된 다이어리 아이디 방금 작성한걸로 바꾸기
                    navigate(`/diary?week=${week}&seq=${resp.data}`);//방금 작성한 페이지로 이동
                })

            alert("업로드 되었습니다!");
        } catch (err) {
            alert("업로드에 실패했습니다. 다시 시도하세요");
        }
    };




    return {
        titleRef,
        content,
        handleComplete,
        editorRef,
        setEditorInstance
    }
}