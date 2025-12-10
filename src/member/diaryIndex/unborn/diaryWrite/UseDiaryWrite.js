import { caxios } from "config/config";
import { calculateFetalWeek } from "member/utils/pregnancyUtils";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "store/useStore";

export function UseDiaryWrite({ getTargetWeekDiary, setSelectedDiaryId, selectedDiaryId, setIsSubmitting, isSubmitting }) {
    const navigate = useNavigate();
    const babySeq = sessionStorage.getItem("babySeq");
    const week = useLocation().state?.week;
    const [content, setContent] = useState("");
    const [editorInstance, setEditorInstance] = useState(null);
    const [initialContent, setInitialContent] = useState(null);
    const editorRef = useRef(null);
    const titleRef = useRef(null);
    const location = useLocation();
    const isEditMode = location.state?.mode == "edit";
    const editJournalSeq = location.state?.journal_seq;

    const extractImages = (node, arr = []) => {
        if (!node) return arr;
        if (node.type === "image") {
            const url = node.attrs.src;
            const sysname = url.split("/").pop();
            arr.push(sysname);
        }
        if (node.content) {
            node.content.forEach(child => extractImages(child, arr));
        }
        return arr;
    };

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

    const handleComplete = async () => {
        if (!editorInstance) return;
        if (isSubmitting) return;
        setIsSubmitting(true);


        const title = titleRef.current?.value || "";
        if (title.length > 50) {
            alert("제목은 50자 이내로 입력해주세요.");
            setIsSubmitting(false);
            return;
        }

        const editorText = editorInstance?.getText().replace(/\s/g, "");
        const contentJSON = editorInstance.getJSON(); 
        const imageSysList = extractImages(contentJSON); 
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
        const MAX_CONTENT_BYTES = 14 * 1024 * 1024;
        if (contentBytes > MAX_CONTENT_BYTES) {
            alert(`본문 용량이 너무 큽니다. 현재 ${contentBytes} bytes / 제한 ${MAX_CONTENT_BYTES} bytes`);
            setIsSubmitting(false);
            return;
        }

        const form = new FormData();
        form.append("title", titleRef.current.value);
        form.append("content", JSON.stringify(contentJSON));
        form.append("imageSysList", JSON.stringify(imageSysList));
        form.append("pregnancy_week", week);
        form.append("baby_seq", babySeq);

        if (isEditMode) {
            try {
                form.append("journal_seq", editJournalSeq);
                await caxios.put("/diary", form)
                alert("수정이 완료되었습니다!")
                navigate(-1);
            } catch (err) {
                alert("산모수첩 수정에 실패했습니다. 다시 시도하세요");
                return;
            } finally {
                setIsSubmitting(false);
            }
        } else {
            try {
                await caxios.post("/diary", form)
                    .then(resp => {
                        getTargetWeekDiary(week, babySeq) 
                        setSelectedDiaryId(resp.data)
                        navigate(`/diary?week=${week}&seq=${resp.data}`);
                    })

                alert("업로드 되었습니다!");
            } catch (err) {
                alert("업로드에 실패했습니다. 다시 시도하세요");
            } finally {
                setIsSubmitting(false);
            }
        }


    };

    useEffect(() => { 
        if (!isEditMode) {
            setInitialContent(null);
        }
    }, [isEditMode]);
    useEffect(() => { 
        if (!isEditMode) { return; }

        caxios.get(`/diary/${editJournalSeq}`, { headers: { "BABY": babySeq } }).then(
            async resp => {
                titleRef.current.value = resp.data.title;
                const content = resp.data.content;

                setInitialContent(content);
            });
    }, [])
    useEffect(() => {
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