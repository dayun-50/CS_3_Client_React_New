import { useState } from "react";
import styles from "./BoardDetail.module.css";
import { MoreHorizontal, MessageCircle, Send } from "lucide-react";
import Comment from "./comment/Comment";
import { UseBoardDetail } from "./UseBoardDetail";
import { EditorContent } from "@tiptap/react";
import CommentItem from "./comment/Comment";
import { FILE_SERVER } from "config/config";
import BoardOver from "../boardOver/BoardOver";

// --- 메인 컴포넌트 ---
const BoardDetail = ({ handleDeleteBoard, handleEditBoard }) => {
  // --- 댓글 데이터 ---

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
  } = UseBoardDetail({ handleDeleteBoard, handleEditBoard });

  const [reportOpen, setReportOpen] = useState(false);
  const [reportTargetSeq, setReportTargetSeq] = useState(null);

  // 상태에 따라 동적 클래스 생성 - css를 위해 추가한 사항 확인
  const commentAreaClasses = [
    styles.commentInputArea,
    isEdit ? styles.editMode : "",
    isReply ? styles.replyMode : "",
  ].join(" "); // 클래스 문자열 결합

  return (
    <div className={styles.parent} onClick={clearReplyMode}>
      {/* 상단 뒤로가기 버튼 영역 */}
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
        {/* 게시글 내용 영역 */}
        <div className={styles.postContentArea}>
          {/* 게시글 제목 및 작성자 정보 */}
          <div className={styles.postHeader}>
            <div className={styles.postTitleWrapper}>
              <b className={styles.postTitle}>{targetBoard.title}</b>
              {/* 게시글 옵션 아이콘 및 드롭다운 메뉴 */}
              <div className={styles.menuContainer}>
                <MoreHorizontal
                  size={24}
                  color="#696b70"
                  onClick={handlePostMenuToggle}
                />
                {postMenuOpen && (
                  <div className={styles.dropdownMenu} ref={menuRef}>
                    {isMine ? (
                      // 내가 작성한 글
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
                      // 남이 작성한 글
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
                  </div>
                )}
              </div>
            </div>
            <div className={styles.authorNicknameWrapper}>
              <div className={styles.userNickname}>{targetBoard.nickname}</div>
            </div>
          </div>

          {/* 게시글 본문 */}
          <div className={styles.postBodyContainer}>
            {/* 1. 게시글 본문 텍스트 */}
            <div className={styles.postBodyText}>
              {editor && <EditorContent editor={editor} />}
            </div>

            {/* 2. 첨부 파일 목록 (새로운 섹션) */}
            {targetBoardFile?.length > 0 && (
              <div className={styles.fileListContainer}>
                {targetBoardFile.map((file) => (
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
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 댓글 영역 */}
        <div className={styles.commentSection}>
          {/* 댓글 목록 */}
          <div className={styles.commentListWrapper}>
            <div className={styles.commentList}>
              {/* 배열 데이터를 맵핑하여 댓글 렌더링 */}
              {comments && comments.length > 0 ? (
                comments.map((comment) => (
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
                ))
              ) : (
                <div
                  className={styles.emptyComments}
                  onClick={(e) => e.stopPropagation()}
                >
                  <MessageCircle size={36} />
                  <p className={styles.emptyCommentsText}>댓글이 없습니다</p>
                  <p className={styles.emptySubText}>첫 댓글을 작성해보세요</p>
                </div>
              )}
            </div>
          </div>

          {/* 페이지네이션 영역 
          <div className={styles.paginationWrapper}>
            <PageNavi page={page} setPage={setPage} count={count} totalCount ={totalCount} typeBtn={type}/>
          </div>
            */}

          {/* 댓글 입력창 */}
          <div className={commentAreaClasses}>
            <div className={styles.commentInputBox}>
              <div className={styles.inputField}>
                <input
                  onClick={(e) => e.stopPropagation()}
                  value={commentContent}
                  onChange={handleInputChange}
                  type="text"
                  placeholder={
                    isEdit
                      ? "댓글을 수정하세요"
                      : isReply
                      ? "대댓글을 입력하세요"
                      : "메시지를 입력하세요"
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
    </div>
  );
};

export default BoardDetail;
