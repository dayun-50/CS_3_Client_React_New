import { MoreHorizontal } from "lucide-react";
import styles from "../BoardDetail.module.css";
import { caxios } from "config/config";
import { useNavigate } from "react-router-dom";
import { UseComment } from "./UseComment";



// --- 댓글 아이템 컴포넌트 ---
const CommentItem =
    ({ comment, commentMenuOpenId, setCommentMenuOpenId, menuRef, closePostMenu, setPostMenuOpen, setIsReply, setParentCommentId, reloadComments, commentContent, setCommentContent, setIsEdit, setEditCommentId }) => {

        const {
            wrapperClass,
            commentClass,
            id,
            isMenuOpen,
            handleCommentMenuToggle,
            handleCommentMenuItemClick,
            handleReplyClick,
            formatDate
        } = UseComment({ comment, commentMenuOpenId, closePostMenu, setCommentMenuOpenId, reloadComments, setCommentContent, setIsEdit, setEditCommentId, setIsReply, setParentCommentId, setPostMenuOpen });




        return (
            <div className={wrapperClass} >
                {/* 댓글 박스 */}
                <div className={commentClass}>
                    {/* 댓글 작성자 헤더 */}
                    <div className={styles.commentUserHeader}>
                        <div className={styles.userNicknameBold}>
                            {comment.is_deleted == 1 ? "알 수 없음" : comment.nickname}
                        </div>
                        {/* 댓글 옵션 아이콘 및 드롭다운 메뉴 */}
                        {!comment.is_deleted && id && id !== "anonymousUser" && (
                            <div className={styles.menuContainer}>
                                <MoreHorizontal
                                    size={24}
                                    color="#696b70"
                                    className={styles.commentOptionIcon}
                                    onClick={handleCommentMenuToggle}
                                />
                                {isMenuOpen && (
                                    <div className={styles.dropdownMenu} ref={menuRef}>
                                        {id == comment.user_id ? (
                                            // 내가 작성한 댓글
                                            <>
                                                <button className={styles.menuItem} onClick={(e) => handleCommentMenuItemClick(e, "수정", comment.comment_seq, comment.comment_content)}>
                                                    수정
                                                </button>
                                                <button className={styles.menuItem} onClick={(e) => handleCommentMenuItemClick(e, "삭제", comment.comment_seq, comment.comment_content)}>
                                                    삭제
                                                </button>
                                            </>
                                        ) : (
                                            // 남이 작성한 댓글
                                            <button className={styles.menuItem} onClick={(e) => handleCommentMenuItemClick(e, "신고", comment.comment_seq, comment.comment_content)}>
                                                신고
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}


                    </div>

                    {/* 댓글 본문 */}
                    <div className={styles.commentTextWrapper}>
                        <div className={styles.commentText}>
                            {comment.is_deleted == 1 ? "삭제 된 내용입니다" : comment.comment_content}
                        </div>
                    </div>

                    {/* 댓글 푸터 - 날짜와 답글 버튼 */}
                    <div className={styles.commentFooter}>
                        <div className={styles.commentDate}>{formatDate(comment.created_at)}</div>

                        {!comment.parent_comment_seq && (
                            <div
                                className={styles.replyButton}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleReplyClick(comment.comment_seq);
                                }}>
                                답글 달기
                            </div>
                        )}


                    </div>
                </div>

                {/* 답글이 있으면 재귀적으로 렌더링 */}
                {comment.replies &&
                    comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.comment_seq}
                            comment={reply}
                            commentMenuOpenId={commentMenuOpenId}
                            setCommentMenuOpenId={setCommentMenuOpenId}
                            menuRef={menuRef}
                            closePostMenu={() => setPostMenuOpen(false)}
                            setPostMenuOpen={setPostMenuOpen}
                            setIsReply={setIsReply}
                            setParentCommentId={setParentCommentId}
                            reloadComments={reloadComments}
                            commentContent={commentContent}
                            setIsEdit={setIsEdit}
                            setEditCommentId={setEditCommentId}
                            setCommentContent={setCommentContent}
                        />
                    ))}
            </div>
        );
    };

export default CommentItem;