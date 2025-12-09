import { caxios } from "config/config";
import { calculateFetalWeek } from "member/utils/pregnancyUtils";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "store/useStore";

export function UseDiaryWrite({ getTargetWeekDiary, setSelectedDiaryId, selectedDiaryId, setIsSubmitting, isSubmitting }) {
    const navigate = useNavigate();
    const babySeq = sessionStorage.getItem("babySeq");
    const week = useLocation().state?.week;//몇번째 주차 선택햇는지에 대하여

    //--------------------------------상태변수 모음
    const [content, setContent] = useState("");



    // ----------- 에디터 내의 이미지 상태변수 -----------
    const [editorInstance, setEditorInstance] = useState(null);
    const [initialContent, setInitialContent] = useState(null);
    const editorRef = useRef(null);
    const titleRef = useRef(null);

    // ----------- 일반작성 모드, 편집모드 감지하기 -----------
    const location = useLocation();
    const isEditMode = location.state?.mode == "edit";
    const editJournalSeq = location.state?.journal_seq;




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

    //에디터 용량 제한
    const utf8Length = (str) => {
        let bytes = 0;
        for (let i = 0; i < str.length; i++) {
            const code = str.charCodeAt(i);
            if (code <= 0x7F) bytes += 1;
            else if (code <= 0x7FF) bytes += 2;
            else if (code <= 0xFFFF) bytes += 3;
            else bytes += 4;
        }
        return bytes;
    };
    const getContentBytes = (contentJSON) => {
        const json = JSON.stringify(contentJSON);
        return utf8Length(json);
    };

    //--------------------------------작성 완료시
    const handleComplete = async () => {
        if (!editorInstance) return;
        if (isSubmitting) return;  // 이미 실행 중이면 막기
        setIsSubmitting(true);


        const title = titleRef.current?.value || "";
        if (title.length > 50) {
            alert("제목은 50자 이내로 입력해주세요.");
            setIsSubmitting(false);
            return;
        }

        // tiptap 에디터 텍스트 추출
        const editorText = editorInstance?.getText().replace(/\s/g, "");
        const contentJSON = editorInstance.getJSON(); //컨텐츠
        const imageSysList = extractImages(contentJSON); //이미지의 시스네임 리스트
        // 제목이 비었거나, 에디터가 비었거나, 엔터/공백만 있을 때
        if (!title.trim()) {
            alert("제목을 입력하세요");
            setIsSubmitting(false);
            return;
        }

        if (!editorText && imageSysList.length === 0) {
            alert("내용을 입력하거나 이미지를 추가하세요");
            setIsSubmitting(false);
            return;
        }

        const contentBytes = getContentBytes(contentJSON);
        const MAX_CONTENT_BYTES = 14 * 1024 * 1024; // 14MB
        if (contentBytes > MAX_CONTENT_BYTES) {
            alert(`본문 용량이 너무 큽니다. 현재 ${contentBytes} bytes / 제한 ${MAX_CONTENT_BYTES} bytes`);
            setIsSubmitting(false);
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
        form.append("baby_seq", babySeq);


        if (isEditMode) {//수정모드일때
            try {
                form.append("journal_seq", editJournalSeq);
                await caxios.put("/diary", form)
                alert("수정이 완료되었습니다!")
                navigate(-1);
            } catch (err) {
                alert("산모수첩 수정에 실패했습니다. 다시 시도하세요");
                return;
            }


        } else {//작성 모드일때
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
            } finally {
                setIsSubmitting(false);
            }
        }


    };



    //--------------------------------유즈이펙트
    useEffect(() => { //편집모드가 아닐때 초기 컨텐츠 비우기
        if (!isEditMode) {
            setInitialContent(null);
        }
    }, [isEditMode]);
    useEffect(() => { //편집모드일때 기존 데이터 불러서 세팅
        if (!isEditMode) { return; }

        caxios.get(`/diary/${editJournalSeq}`, { headers: { "BABY": babySeq } }).then(
            async resp => {
                console.log("받아온 에디터 데이터", resp)

                titleRef.current.value = resp.data.title;
                const content = resp.data.content;

                setInitialContent(content);
            });
    }, [])
    useEffect(() => {//에디터 인스턴스 생성때까지 기다렷다가 파싱
        if (!editorInstance) return;
        const parsed = JSON.parse(initialContent);
        editorInstance.commands.setContent(parsed);

    }, [editorInstance, initialContent]);

    return {
        titleRef,
        content,
        handleComplete,
        editorRef,
        setEditorInstance,
        isSubmitting
    }
}