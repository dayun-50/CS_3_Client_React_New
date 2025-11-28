import { useEditor } from "@tiptap/react";
import { caxios } from "config/config";
import { useEffect, useRef, useState } from "react";
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
import { sendMessage } from "common/webSocket/connectWebSocket";

//json 파싱용
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

export function UseBoardDetail({ initialComments, handleDeleteBoard, handleEditBoard }) {
    //-----------------------상태변수 모음
    //댓글 관련
    const [comments, setComments] = useState([]); // 댓글 매핑용
    const [isReply, setIsReply] = useState(false);//대댓글인지 아닌지 구분용
    const [parentCommentId, setParentCommentId] = useState(null); // 부모댓글
    const [isSubmitted, setIsSubmitted] = useState(false);//댓글 전송 눌렀는지 확인용
    const [commentContent, setCommentContent] = useState("");//댓글 내용 감지
    const [isEdit, setIsEdit] = useState(false);//댓글 수정
    const [editCommentId, setEditCommentId] = useState(null);//댓글 수정하는 테겟 시퀀스 


    //게시글 관련
    const [targetBoard, setTargetBoard] = useState({}); //게시글 세팅 객체
    const [targetBoardFile, setTargetBoardFile] = useState({});//첨부파일 객체
    const [isMine, setIsMine] = useState(false);//내 글인지 확인하는 상태변수


    //게시글 시퀀스 번호 가져오기
    const [searchParams] = useSearchParams();
    const seq = searchParams.get("seq");

    //드롭다운 메뉴
    const [postMenuOpen, setPostMenuOpen] = useState(false);// 게시글 메뉴 드롭다운 상태
    const [commentMenuOpenId, setCommentMenuOpenId] = useState(null);// 댓글 메뉴 드롭다운 상태
    const menuRef = useRef(null);//아무 메뉴 열려있는지 감지


    //-----------------------상태변수 모음
    //에디터 파싱 옵션
    const editor = useEditor({
        extensions,
        content: "",
        editable: false
    });

    const navigate = useNavigate();
    //나의 아이디 스토리지에서 가져오기
    const id = sessionStorage.getItem("id");



    //-----------------------버튼 모음
    //수정, 삭제 버튼 index에서 생성후 list와 detail로 props전달함 : seq번호만 전달하면 됨
    const handleNavigateBack = () => { //뒤로가기
        navigate(-1);
    }
    const handlePostMenuToggle = (e) => { // 게시글 옵션 메뉴 토글 핸들러
        e.stopPropagation();
        setPostMenuOpen(prev => !prev);
        setCommentMenuOpenId(null); // 댓글 메뉴 닫기
    };
    const handlePostMenuItemClick = (e, action, target_seq) => {// 게시글 메뉴 항목 클릭 핸들러 : 게시글 수정 삭제
        e.stopPropagation();
        // 실제 로직: 신고, 수정, 삭제 API 호출 및 페이지 이동
        if (action === "수정") {
            handleEditBoard(target_seq);

        } else if (action === "삭제") {
            handleDeleteBoard(target_seq);
        }

        setPostMenuOpen(false); // 메뉴 닫기
    };
    const handleSubmit = async () => { //댓글 작성 완료
        if (!id || id == "anonymousUser") {
            alert("로그인 후 이용 가능한 서비스 입니다");
            navigate("/login");
            return;
        }
        if (!commentContent.trim()) {
            alert("댓글을 입력하세요.");
            return;
        }
        try {
            //1. 수정모드 일때
            if (isEdit && editCommentId) {
                await caxios.put(`/comment/${editCommentId}`, {
                    comment_content: commentContent
                });
                setCommentContent("");
                setIsEdit(false);
                setEditCommentId(null);
                alert("댓글이 수정되었습니다.");

            } else {//2. 일반 작성 모드일 때
                await caxios.post("/comment", {
                    board_seq: Number(seq),
                    parent_comment_seq: parentCommentId,
                    comment_content: commentContent
                })
                    .then(resp => {
                        sendMessage("/app/notify", { 
                            type: "NEW_COMMENT",
                            board_seq: Number(seq),
                            parent_comment_seq: parentCommentId,
                            comment_content: commentContent
                        });
                    });

                alert("댓글이 등록되었습니다.");
            }

            //3.댓글 재 렌더링
            reloadComments();
            setCommentContent("");
            clearReplyMode();

        } catch (error) {
            console.error("댓글 전송 실패:", error);
        }
    };

    //-----------------------함수모음
    const buildCommentTree = (oriCommentsArr) => { //댓글 트리구조화 함수
        const map = new Map();
        const roots = [];

        oriCommentsArr.forEach(comment => {
            map.set(comment.comment_seq, { ...comment, replies: [] })
        })
        oriCommentsArr.map(comment => {
            if (comment.parent_comment_seq) { //대댓글이라면
                const parent = map.get(comment.parent_comment_seq);
                if (parent) {
                    parent.replies.push(map.get(comment.comment_seq))
                }
            } else {//부모 댓글이라면
                roots.push(map.get(comment.comment_seq))
            }

            // 자식 댓글 정렬 (오래된 → 최신)
            roots.forEach(parent => {
                parent.replies.sort((a, b) =>
                    new Date(a.created_at) - new Date(b.created_at)
                );
            });

            // 부모 댓글 정렬 (최신순)
            roots.sort((a, b) =>
                new Date(b.created_at) - new Date(a.created_at)
            );
        })
        return roots;
    }
    const clearReplyMode = () => {//대댓글 모드에서 다시 일반 댓글 모드로 전환
        setIsReply(false);
        setParentCommentId(null);
    };
    const handleInputChange = (e) => {//댓글 입력창 내용 변경 핸들러
        e.stopPropagation();
        // 입력값 상태 업데이트 로직 추가
        setCommentContent(e.target.value);
    }
    const reloadComments = async () => {//리로딩 함수
        if (!seq) return;

        const resp = await caxios.get("/board/detail", { params: { seq } });
        setTargetBoardFile(resp.data.files);
        setTargetBoard(resp.data.boards);
        setComments(buildCommentTree(resp.data.comments));

        if (resp.data.boards.user_id == sessionStorage.getItem("id")) {
            setIsMine(true);
        }
    };

    //-----------------------이펙트 모음
    useEffect(() => { // 메뉴 외부 클릭 시 메뉴 닫기 핸들러 추가
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setPostMenuOpen(false);
                setCommentMenuOpenId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isSubmitted]);

    const viewOnceRef = useRef(false);
    useEffect(() => {//처음 게시글 정보 가져오기
        if (viewOnceRef.current) return;

        viewOnceRef.current = true;
        reloadComments();
    }, [seq]);


    useEffect(() => {//에디터 내용 복원(json 파싱)
        if (!editor || !targetBoard?.content) return;

        try {
            const parsed = JSON.parse(targetBoard.content);
            editor.commands.setContent(parsed);
        } catch (e) {
            console.error("에디터 복원 실패", e);
        }
    }, [editor, targetBoard]);



    return {
        comments,
        targetBoard,
        editor,
        targetBoardFile,
        handleNavigateBack,
        isMine,
        postMenuOpen,
        handlePostMenuToggle,
        handlePostMenuItemClick,
        commentMenuOpenId,
        setCommentMenuOpenId,
        menuRef,
        setPostMenuOpen,
        isReply,
        setIsReply,
        parentCommentId,
        setParentCommentId,
        clearReplyMode,
        handleSubmit,
        handleInputChange,
        reloadComments,
        commentContent,
        setCommentContent,
        isEdit,
        setIsEdit,
        setEditCommentId
    };
}
