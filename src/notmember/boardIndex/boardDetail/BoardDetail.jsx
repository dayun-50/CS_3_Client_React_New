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

// --- 더미 댓글 데이터 (배열로 분리) ---
const initialComments = [
  {
    id: 1,
    nickname: "개발자1",
    date: "2025.11.17",
    text: "여기에 댓글이 들어가는데 뭐라고 나오겠지. 첫 번째 상위 댓글입니다.",
    isReply: false,
    replies: [
      {
        id: 1.1,
        nickname: "기획자A",
        date: "2025.11.18",
        text: "답글 내용입니다. 아이디어가 좋네요!",
        isReply: true,
      },
    ],
  },
  {
    id: 2,
    nickname: "디자이너B",
    date: "2025.11.19",
    text: "두 번째 상위 댓글입니다. 프로젝트 방향에 동의합니다.",
    isReply: false,
    replies: [],
  },
];

// --- 댓글 아이템 컴포넌트 ---
const CommentItem = ({ comment }) => {
  // 상위 댓글인지 답글인지에 따라 wrapper 및 댓글 박스 클래스 선택
  const wrapperClass = comment.isReply
    ? styles.replyCommentWrapper
    : styles.parentCommentWrapper;
  const commentClass = comment.isReply
    ? styles.replyComment
    : styles.parentComment;

  return (
    <div className={wrapperClass}>
      {/* 댓글 박스 */}
      <div className={commentClass}>
        {/* 댓글 작성자 헤더 */}
        <div className={styles.commentUserHeader}>
          <div className={styles.userNicknameBold}>{comment.nickname}</div>
          {/* 댓글 옵션 아이콘 */}
          <MoreHorizontal
            size={24}
            color="#696b70"
            className={styles.commentOptionIcon}
          />
        </div>

        {/* 댓글 본문 */}
        <div className={styles.commentTextWrapper}>
          <div className={styles.commentText}>{comment.text}</div>
        </div>

        {/* 댓글 푸터 - 날짜와 답글 버튼 */}
        <div className={styles.commentFooter}>
          <div className={styles.commentDate}>{comment.date}</div>
          <div className={styles.replyButton}>답글 달기</div>
        </div>
      </div>

      {/* 답글이 있으면 재귀적으로 렌더링 */}
      {comment.replies &&
        comment.replies.map((reply) => (
          <CommentItem key={reply.id} comment={reply} />
        ))}
    </div>
  );
};

// --- 메인 컴포넌트 ---
const BoardDetail = () => {
  const [comments, setComments] = useState(initialComments);

  return (
    <div className={styles.parent}>
      {/* 상단 뒤로가기 버튼 영역 */}
      <div className={styles.topBar}>
        <div className={styles.backButtonWrapper}>
          <button className={styles.backButtonText}>뒤로가기</button>
        </div>
      </div>

      <div className={styles.mainContentWrapper}>
        {/* 게시글 내용 영역 */}
        <div className={styles.postContentArea}>
          {/* 게시글 제목 및 작성자 정보 */}
          <div className={styles.postHeader}>
            <div className={styles.postTitleWrapper}>
              <b className={styles.postTitle}>여기 제목들어갈걸</b>
              <MoreHorizontal size={24} color="#696b70" />
            </div>
            <div className={styles.authorNicknameWrapper}>
              <div className={styles.userNickname}>아가미</div>
            </div>
          </div>

          {/* 게시글 본문 */}
          <div className={styles.postBodyContainer}>
            <div className={styles.postBodyText}>
              <p className={styles.paragraph}>대략적인</p>
              <ul className={styles.list}>
                <li className={styles.listItem}>파리콕? - 요리 레시피</li>
                <li className={styles.listItem}>커리어리? - 개발자끼리 소통</li>
              </ul>
              <p className={styles.paragraph}>&nbsp;</p>
              <p className={styles.paragraph}>관리자</p>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  전문적인 웹 사이트를 만드는건 보류
                </li>
                <li className={styles.listItem}>
                  가이드라인을 잡는 곳으로 - 관리자를 전문적으로 갈거면
                </li>
              </ul>
              <p className={styles.paragraph}>&nbsp;</p>
              <p className={styles.paragraph}>개발자</p>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  라이브러리, API 사용하는 과정으로 하는거
                </li>
                <li className={styles.listItem}>완성하는걸 목표로 하자</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 댓글 영역 */}
        <div className={styles.commentSection}>
          {/* 댓글 목록 */}
          <div className={styles.commentListWrapper}>
            <div className={styles.commentList}>
              {/* 배열 데이터를 맵핑하여 댓글 렌더링 */}
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          </div>

          {/* 페이지네이션 영역 */}
          <div className={styles.paginationWrapper}>
            <div className={styles.pagination}>
              {/* 이전 페이지 버튼 */}
              <button className={styles.pageControl} disabled>
                <ChevronsLeft size={20} color="#696b70" />
                <ChevronLeft size={20} color="#696b70" />
              </button>

              {/* 페이지 번호 버튼 */}
              <div className={styles.pageNumbers}>
                <button className={`${styles.pageBtn} ${styles.activePage}`}>
                  1
                </button>
                <button className={styles.pageBtn}>2</button>
                <button className={styles.pageBtn}>3</button>
                <button className={styles.pageBtn}>4</button>
                <button className={styles.pageBtn}>5</button>
              </div>

              {/* 다음 페이지 버튼 */}
              <button className={styles.pageControl}>
                <ChevronRight size={20} color="#696b70" />
                <ChevronsRight size={20} color="#696b70" />
              </button>
            </div>
          </div>

          {/* 댓글 입력창 */}
          <div className={styles.commentInputArea}>
            <div className={styles.commentInputBox}>
              <div className={styles.inputField}>
                <input
                  type="text"
                  placeholder=" 메시지를 입력하세요"
                  className={styles.inputElement}
                />
              </div>
              <div className={styles.submitButton}>
                <Send size={24} color="#fff" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardDetail;
