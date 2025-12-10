import { useState } from "react";
import styles from "./BoardDetail.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal, MessageCircle, Send } from "lucide-react";
import Comment from "./comment/Comment";
import { UseBoardDetail } from "./UseBoardDetail";
import { EditorContent } from "@tiptap/react";
import CommentItem from "./comment/Comment";
import { FILE_SERVER } from "config/config";
import BoardOver from "../boardOver/BoardOver";
import useAuthStore from "store/useStore";

const BoardDetail = ({ handleDeleteBoard, handleEditBoard, isDeleting }) => {
  const {
    setIsMine,
    comments,
    targetBoard,
    editor,
    targetBoardFile,
    handleNavigateBack,
    postMenuOpen,
    handlePostMenuToggle,
    handlePostMenuItemClick,
    commentMenuOpenId,
    setCommentMenuOpenId,
    isMine,
    menuRef,
    setPostMenuOpen,
    isReply,
    setIsReply,
    parentCommentId,
    setParentCommentId,
    clearReplyMode,
    handleSubmit,
    handleInputChange,
    commentContent,
    reloadComments,
    setCommentContent,
    isEdit,
    setIsEdit,
    setEditCommentId,
    handleKeyDown
  } = UseBoardDetail({ handleDeleteBoard, handleEditBoard });

  const [reportOpen, setReportOpen] = useState(false);
  const [reportTargetSeq, setReportTargetSeq] = useState(null);
  const isLogin = useAuthStore(state => state.isLogin);

  const commentAreaClasses = [
    styles.commentInputArea,
    isEdit ? styles.editMode : "",
    isReply ? styles.replyMode : "",
  ].join(" ");

  return (
    <motion.div
      className={styles.parent}
      onClick={clearReplyMode}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className={styles.topBar}>
        <div className={styles.backButtonWrapper}>
          <button
            className={styles.backButtonText}
            onClick={handleNavigateBack}
          >
            뒤로가기
          </button>
        </div>
      </div>

      <div className={styles.mainContentWrapper}>
        <div className={styles.postContentArea}>
          <div className={styles.postHeader}>
            <div className={styles.postTitleWrapper}>
              <b className={styles.postTitle}>{targetBoard.title}</b>
              <div className={styles.menuContainer}>
                <MoreHorizontal
                  size={24}
                  color="#696b70"
                  onClick={handlePostMenuToggle}
                />

                <AnimatePresence>
                  {postMenuOpen && (
                    <motion.div
                      className={styles.dropdownMenu}
                      ref={menuRef}
                      initial={{ opacity: 0, scale: 0.9, y: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -5 }}
                      transition={{ duration: 0.15 }}
                    >
                      {isMine ? (
                        <>
                          <button
                            className={styles.menuItem}
                            onClick={(e) =>
                              handlePostMenuItemClick(
                                e,
                                "수정",
                                targetBoard.board_seq
                              )
                            }
                          >
                            수정
                          </button>
                          <button
                            disabled={isDeleting}
                            className={styles.menuItem}
                            onClick={(e) =>
                              handlePostMenuItemClick(
                                e,
                                "삭제",
                                targetBoard.board_seq
                              )
                            }
                          >
                            삭제
                          </button>
                        </>
                      ) : (
                        <button
                          className={styles.menuItem}
                          onClick={(e) => {
                            handlePostMenuItemClick(
                              e,
                              "신고",
                              targetBoard.board_seq
                            );
                            setReportOpen(true);
                            setReportTargetSeq(targetBoard.board_seq);
                          }}
                        >
                          신고
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className={styles.authorNicknameWrapper}>
              <div className={styles.userNickname}>{targetBoard.nickname}</div>
            </div>
          </div>

          <div className={styles.postBodyContainer}>
            <div className={styles.postBodyText}>
              {editor && <EditorContent editor={editor} />}
            </div>

            {targetBoardFile?.length > 0 && (
              <div className={styles.fileListContainer}>
                {targetBoardFile.map((file) => (
                  <>
                    <a
                      key={file.file_seq}
                      href={`${FILE_SERVER}/file/download?sysname=${encodeURIComponent(
                        file.sysname
                      )}&file_type=board/file/`}
                      download
                      className={styles.fileItem}
                    >
                      {file.oriname}
                    </a>
                    <br></br>
                  </>
                ))}
              </div>
            )}
          </div>
        </div>


        <div className={styles.commentSection}>
          <div className={styles.commentListWrapper}>
            <div className={styles.commentList}>
              {comments && comments.length > 0 ? (
                <AnimatePresence>
                  {comments.map((comment, index) => (
                    <motion.div
                      key={comment.comment_seq}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.04 }}
                    >
                      <CommentItem
                        key={comment.comment_seq}
                        comment={comment}
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
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <div
                  className={styles.emptyComment}
                  onClick={(e) => e.stopPropagation()}
                >
                  <MessageCircle size={36} />
                  <p className={styles.emptyCommentsText}>댓글이 없습니다</p>
                  <p className={styles.emptySubText}>첫 댓글을 작성해보세요</p>
                </div>
              )}
            </div>
          </div>

          <div className={commentAreaClasses}>
            <div className={styles.commentInputBox}>
              <div className={styles.inputField}>
                <input
                  onClick={(e) => e.stopPropagation()}
                  value={commentContent}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  type="text"
                  placeholder={
                    isEdit
                      ? "댓글을 수정하세요 (최대 50자)"
                      : isReply
                        ? "대댓글을 입력하세요 (최대 50자)"
                        : "메시지를 입력하세요 (최대 50자)"
                  }
                  className={styles.inputElement}
                />
              </div>
              <div className={styles.submitButton} onClick={handleSubmit}>
                <Send size={24} color="#fff" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <BoardOver
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        boardSeq={reportTargetSeq}
      />
    </motion.div>
  );
};

export default BoardDetail;
