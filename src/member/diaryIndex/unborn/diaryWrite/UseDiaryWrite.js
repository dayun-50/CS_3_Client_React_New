import { caxios } from "config/config";
import { calculateFetalWeek } from "member/utils/pregnancyUtils";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "store/useStore";

export function UseDiaryWrite() {
    const navigate = useNavigate();
    const babyDueDate = sessionStorage.getItem("babyDueDate");
    const babySeq = sessionStorage.getItem("babySeq");

    //--------------------------------상태변수 모음
    const [content, setContent] = useState("");

    // ----------- 에디터 내의 이미지 상태변수 -----------
    const [editorInstance, setEditorInstance] = useState(null);
    const [initialContent, setInitialContent] = useState(null);
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


    //--------------------------------작성 완료시
    const handleComplete = async () => {
        if (!editorInstance) return;


        const title = titleRef.current?.value || "";
        // tiptap 에디터 텍스트 추출
        const editorText = editorInstance?.getText().replace(/\s/g, "");

        // 제목이 비었거나, 에디터가 비었거나, 엔터/공백만 있을 때
        if (!title.trim() || !editorText) {
            alert("제목과 내용을 입력하세요");
            return;
        }

        const form = new FormData();
        // 1) 에디터 JSON 담기
        form.append("title", titleRef.current.value);
        const contentJSON = editorInstance.getJSON(); //컨텐츠
        form.append("content", JSON.stringify(contentJSON));
        // 2) 이미지 리스트 담기
        const imageSysList = extractImages(contentJSON); //이미지의 시스네임 리스트
        form.append("imageSysList", JSON.stringify(imageSysList));
        //3) 태아 주차 계산
        const todayKST = new Date().toLocaleDateString('ko-KR', {
            timeZone: 'Asia/Seoul'
        }).replace(/\./g, '-').replace(/\s/g, '').replace(/-$/, '');
        form.append("pregnancy_week", calculateFetalWeek(babyDueDate, todayKST));//임신주차
        //4) 아기 시퀀스
        form.append("babySeq", babySeq);


        try {
            await caxios.post("/diary", form)
                .then(resp => {


                    console.log(resp);
                })


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