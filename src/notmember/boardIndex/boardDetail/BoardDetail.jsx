import { useState } from "react";
import styles from "./BoardDetail.module.css";
import {
  MoreHorizontal,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Send,
} from "lucide-react";
import Comment from "./comment/Comment";
import { UseBoardDetail } from "./UseBoardDetail";
import { EditorContent } from "@tiptap/react";
import CommentItem from "./comment/Comment";
import { FILE_SERVER } from "config/config";



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
    setEditCommentId
  } = UseBoardDetail({ handleDeleteBoard, handleEditBoard });


  const [reportOpen, setReportOpen] = useState(false);



  return (
    <div className={styles.parent} onClick={clearReplyMode}>
      {/* 상단 뒤로가기 버튼 영역 */}
      <div className={styles.topBar}>
        <div className={styles.backButtonWrapper}>
          <button className={styles.backButtonText} onClick={handleNavigateBack}>
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
                          onClick={(e) => handlePostMenuItemClick(e, "수정", targetBoard.board_seq)}
                        >
                          수정
                        </button>
                        <button
                          className={styles.menuItem}
                          onClick={(e) => handlePostMenuItemClick(e, "삭제", targetBoard.board_seq)}
                        >
                          삭제
                        </button>
                      </>
                    ) : (
                      // 남이 작성한 글
                      <button
                        className={styles.menuItem}
                        onClick={(e) => {
    handlePostMenuItemClick(e, "신고", targetBoard.board_seq);
    setReportOpen(true);  // 🔥 신고창 열기
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
            <div className={styles.postBodyText}>
              {editor && <EditorContent editor={editor} />}


              {/* 영서씨 여기에 첨부파일용 박스도 하나만 만들어 주세요*/}
              {/*아래 있는 내용은 css만 손봐주세요: 맵으로 불러오는 방식임*/}

              {targetBoardFile?.length > 0 ? (
                targetBoardFile.map(file => (
                  <a
                    key={file.file_seq}
                    href={`${FILE_SERVER}/file/download?sysname=${encodeURIComponent(file.sysname)}&file_type=board/file/`}
                    download
                    style={{ display: "block", marginBottom: "6px" }}
                  >
                    {file.oriname}
                  </a>
                ))
              ) : (
                <div>첨부파일 없음</div>
              )}


            </div>
          </div>
        </div>

        {/* 댓글 영역 */}
        <div className={styles.commentSection} >
          {/* 댓글 목록 */}
          <div className={styles.commentListWrapper}>
            <div className={styles.commentList} >

              {/* 배열 데이터를 맵핑하여 댓글 렌더링 */}
              {comments.map((comment) => (
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
              ))}

            </div>
          </div>


          {/* 페이지네이션 영역 
          <div className={styles.paginationWrapper}>
            <PageNavi page={page} setPage={setPage} count={count} totalCount ={totalCount} typeBtn={type}/>
          </div>
            */}

          {/* 댓글 입력창 */}
          <div className={styles.commentInputArea}>
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

      {reportOpen && (
  <div className={styles.reportOverlay} onClick={()=>setReportOpen(false)}>
    <div className={styles.reportBox} onClick={(e)=>e.stopPropagation()}>
      
      {/* 🔥 신고 사유 4개 선택 */}
      <div className={styles.reportOptions}>
        <label><input type="radio" name="reason" /> 욕설 및 부적절한 표현</label>
        <label><input type="radio" name="reason" /> 광고성 게시물</label>
        <label><input type="radio" name="reason" /> 태교와 관련 없는 글</label>
        <label><input type="radio" name="reason" /> 불법 복제 · 저작권 침해 글</label>
      </div>

      {/* 버튼 영역 */}
      <div className={styles.reportBtnArea}>
        <button className={styles.reportCancelBtn} onClick={()=>setReportOpen(false)}>취소</button>
        <button className={styles.reportSubmitBtn}>신고 완료</button>
      </div>

    </div>
  </div>
)}
    </div >

    
  );
};

export default BoardDetail;
