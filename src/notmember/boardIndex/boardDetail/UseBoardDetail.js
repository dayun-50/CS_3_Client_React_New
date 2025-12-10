import { useEditor } from "@tiptap/react";
import { caxios } from "config/config";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { sendMessage } from "common/webSocket/connectWebSocket";
import { editorExtensions } from "member/utils/editorSetting";



export function UseBoardDetail({ initialComments, handleDeleteBoard, handleEditBoard }) {
    const [comments, setComments] = useState([]);
    const [isReply, setIsReply] = useState(false);
    const [parentCommentId, setParentCommentId] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [commentContent, setCommentContent] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [editCommentId, setEditCommentId] = useState(null);
    const [targetBoard, setTargetBoard] = useState({});
    const [targetBoardFile, setTargetBoardFile] = useState({});
    const [isMine, setIsMine] = useState(false);
    const [searchParams] = useSearchParams();
    const seq = searchParams.get("seq");
    const [postMenuOpen, setPostMenuOpen] = useState(false);
    const [commentMenuOpenId, setCommentMenuOpenId] = useState(null);
    const menuRef = useRef(null);

    const editor = useEditor({
        extensions: editorExtensions,
        content: "",
        editable: false
    });

    const navigate = useNavigate();
    const id = sessionStorage.getItem("id");

    const handleNavigateBack = () => {
        navigate("/board");
    }
    const handlePostMenuToggle = (e) => {
        e.stopPropagation();
        setPostMenuOpen(prev => !prev);
        setCommentMenuOpenId(null);
    };
    const handlePostMenuItemClick = (e, action, target_seq) => {
        e.stopPropagation();
        if (action === "수정") {
            handleEditBoard(target_seq);

        } else if (action === "삭제") {
            handleDeleteBoard(target_seq);
        }

        setPostMenuOpen(false);
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    }
    const handleSubmit = async () => {
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
            if (isEdit && editCommentId) {
                await caxios.put(`/comment/${editCommentId}`, {
                    comment_content: commentContent
                });
                setCommentContent("");
                setIsEdit(false);
                setEditCommentId(null);
                alert("댓글이 수정되었습니다.");

            } else {
                await caxios.post("/comment", {
                    board_seq: Number(seq),
                    parent_comment_seq: parentCommentId,
                    comment_content: commentContent
                })
                    .then(resp => {
                        sendMessage("/pub/notify", {
                            user_id: id,
                            board_seq: Number(seq),
                            parent_comment_seq: parentCommentId
                        });
                    });

                alert("댓글이 등록되었습니다.");
            }

            reloadComments();
            setCommentContent("");
            clearReplyMode();

        } catch (error) { }
    };

    const buildCommentTree = (oriCommentsArr) => {
        const map = new Map();
        const roots = [];

        oriCommentsArr.forEach(comment => {
            map.set(comment.comment_seq, { ...comment, replies: [] })
        })
        oriCommentsArr.map(comment => {
            if (comment.parent_comment_seq) {
                const parent = map.get(comment.parent_comment_seq);
                if (parent) {
                    parent.replies.push(map.get(comment.comment_seq))
                }
            } else {
                roots.push(map.get(comment.comment_seq))
            }

            roots.forEach(parent => {
                parent.replies.sort((a, b) =>
                    new Date(a.created_at) - new Date(b.created_at)
                );
            });

            roots.sort((a, b) =>
                new Date(b.created_at) - new Date(a.created_at)
            );
        })
        return roots;
    }
    const clearReplyMode = () => {
        setIsReply(false);
        setParentCommentId(null);
    };
    const handleInputChange = (e) => {
        e.stopPropagation();
        const value = e.target.value;

        if (value.length <= 50) {
            setCommentContent(value);
        }
    }
    const reloadComments = async () => {
        if (!seq) return;

        const resp = await caxios.get("/board/detail", { params: { seq } });
        setTargetBoardFile(resp.data.files);
        setTargetBoard(resp.data.boards);
        setComments(buildCommentTree(resp.data.comments));

        if (resp.data.boards.user_id == sessionStorage.getItem("id")) {
            setIsMine(true);
        }
    };

    useEffect(() => {
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
    useEffect(() => {
        if (viewOnceRef.current) return;
        reloadComments();
    }, [seq]);



    useEffect(() => {
        if (!editor || !targetBoard?.content) return;

        try {
            const parsed = JSON.parse(targetBoard.content);
            editor.commands.setContent(parsed);
        } catch (e) { }
    }, [editor, targetBoard, seq]);



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
        setEditCommentId,
        handleKeyDown
    };
}
