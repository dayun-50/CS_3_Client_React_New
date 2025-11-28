import { useNavigate } from "react-router-dom";
import styles from "../BoardDetail.module.css";
import { caxios } from "config/config";


export function UseComment({ comment, commentMenuOpenId, closePostMenu, setCommentMenuOpenId, reloadComments, setCommentContent, setIsEdit, setEditCommentId, setIsReply, setParentCommentId, setPostMenuOpen }) {
    //나의 아이디 스토리지에서 가져오기
    const id = sessionStorage.getItem("id");
    const navigate = useNavigate();

    // 상위 댓글인지 답글인지에 따라 wrapper 및 댓글 박스 클래스 선택
    const wrapperClass = comment.parent_comment_seq
        ? styles.replyCommentWrapper
        : styles.parentCommentWrapper;
    const commentClass = comment.parent_comment_seq
        ? styles.replyComment
        : styles.parentComment;

    // 드롭다운 메뉴 상태
    const isMenuOpen = commentMenuOpenId === comment.comment_seq;

    // 댓글 옵션 메뉴 토글 핸들러
    const handleCommentMenuToggle = (e) => {
        e.stopPropagation();
        closePostMenu();
        setCommentMenuOpenId(isMenuOpen ? null : comment.comment_seq);
    };

    // 댓글 메뉴 항목 클릭 핸들러 : 댓글 수정 삭제
    const handleCommentMenuItemClick = async (e, action, comment_seq, comment_content) => {
        e.stopPropagation();
        setCommentMenuOpenId(null);

        // 삭제 후 즉시 갱신
        if (action === "삭제") {
            if (window.confirm("정말 삭제하시겠습니까?")) {
                await caxios.delete(`/comment/${comment_seq}`);
                reloadComments();
            }
        }


        //수정 후 즉시 갱신
        if (action === "수정") {
            setCommentContent(comment_content);  // 입력창에 내용 넣기
            setIsEdit(true);                     // 수정 모드 ON
            setEditCommentId(comment_seq);       // 수정 대상 저장
        }
    };

    //댓글달기 눌렀을때
    const handleReplyClick = (parent_comment_seq) => {
        if (!id || id == "anonymousUser") {
            alert("로그인 후 이용 가능한 서비스 입니다");
            navigate("/login");
            return;
        }

        setIsReply(true);
        setParentCommentId(parent_comment_seq);
        console.log("부모 댓글 시퀀스:", parent_comment_seq);
        setPostMenuOpen(false);
    }

    //날짜포맷
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








