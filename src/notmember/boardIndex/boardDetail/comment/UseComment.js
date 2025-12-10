import { useNavigate } from "react-router-dom";
import styles from "../BoardDetail.module.css";
import { caxios } from "config/config";


export function UseComment({ comment, commentMenuOpenId, closePostMenu, setCommentMenuOpenId, reloadComments, setCommentContent, setIsEdit, setEditCommentId, setIsReply, setParentCommentId, setPostMenuOpen }) {
    const id = sessionStorage.getItem("id");
    const navigate = useNavigate();

    const wrapperClass = comment.parent_comment_seq
        ? styles.replyCommentWrapper
        : styles.parentCommentWrapper;
    const commentClass = comment.parent_comment_seq
        ? styles.replyComment
        : styles.parentComment;

    const isMenuOpen = commentMenuOpenId === comment.comment_seq;

    const handleCommentMenuToggle = (e) => {
        e.stopPropagation();
        closePostMenu();
        setCommentMenuOpenId(isMenuOpen ? null : comment.comment_seq);
    };

    const handleCommentMenuItemClick = async (e, action, comment_seq, comment_content) => {
        e.stopPropagation();
        setCommentMenuOpenId(null);

        if (action === "삭제") {
            if (window.confirm("정말 삭제하시겠습니까?")) {
                await caxios.delete(`/comment/${comment_seq}`);
                reloadComments();
            }
        }


        if (action === "수정") {
            setCommentContent(comment_content);  
            setIsEdit(true);                     
            setEditCommentId(comment_seq);     
        }
    };

    const handleReplyClick = (parent_comment_seq) => {
        if (!id || id == "anonymousUser") {
            alert("로그인 후 이용 가능한 서비스 입니다");
            navigate("/login");
            return;
        }

        setIsReply(true);
        setParentCommentId(parent_comment_seq);
        setPostMenuOpen(false);
    }

    const formatDate = (datetime) => {
        if (!datetime) return "";
        return datetime.split("T")[0];
    };

    return {
        wrapperClass,
        commentClass,
        id,
        isMenuOpen,
        handleCommentMenuToggle,
        handleCommentMenuItemClick,
        handleReplyClick,
        formatDate

    };


}








