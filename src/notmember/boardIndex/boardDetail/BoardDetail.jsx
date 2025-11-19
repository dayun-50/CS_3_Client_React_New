import { useState } from "react";

import styles from "./BoardDetail.module.css";

const BoardDetail = () => {
  return (
    <div className={styles.containerWrapper}>
      {/* --- 게시글 내용 영역 (Post Content) --- */}
      <div className={styles.postContentArea}>
        {/* 게시글 제목 및 작성자 정보 */}
        <div className={styles.postHeader}>
          <div className={styles.postTitleWrapper}>
            <b className={styles.postTitle}>여기 제목들어갈걸</b>
            <img className={styles.icon} alt="Options Icon" />
          </div>
          <div className={styles.authorNicknameWrapper}>
            <div className={styles.userNickname}>사용자 닉네임</div>
          </div>
        </div>
        <div className={styles.divider} />

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

      {/* --- 댓글 영역 (Comment Section) --- */}
      <div className={styles.commentSection}>
        {/* 댓글 목록 */}
        <div className={styles.commentListWrapper}>
          <div className={styles.commentList}>
            {/* 상위 댓글 (Parent Comment) */}
            <div className={styles.parentComment}>
              <div className={styles.commentUserHeader}>
                <div className={styles.nicknameGroup}>
                  <div className={styles.userNicknameBold}>사용자 닉네임</div>
                </div>
                <img className={styles.icon} alt="User Profile Image" />
              </div>
              <div className={styles.commentTextWrapper}>
                <div className={styles.commentText}>
                  여기에 댓글이 들어가는데 뭐라고 나오겠지
                </div>
              </div>
              <div className={styles.commentFooter}>
                <div className={styles.commentDate}>2025.11.17</div>
                <div className={styles.replyButton}>답글 달기</div>
              </div>
            </div>

            {/* 답글 (Reply Comment) */}
            <div className={styles.replyCommentWrapper}>
              <div className={styles.replyComment}>
                <div className={styles.commentUserHeader}>
                  <div className={styles.nicknameGroup}>
                    <div className={styles.userNicknameBold}>사용자 닉네임</div>
                  </div>
                  <img className={styles.icon} alt="User Profile Image" />
                </div>
                <div className={styles.commentTextWrapper}>
                  <div className={styles.commentText}>
                    여기에 댓글이 들어가는데 뭐라고 나오겠지
                  </div>
                </div>
                <div className={styles.commentFooter}>
                  <div className={styles.commentDate}>2025.11.17</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 페이지네이션 */}
        <div className={styles.paginationWrapper}>
          <div className={styles.paginationControls}>
            <img
              className={styles.collapseArrowIcon}
              alt="Previous Page Arrow"
            />
            <img
              className={styles.collapseArrowIcon}
              alt="Previous Group Arrow"
            />
          </div>
          <div className={styles.pageListContainer}>
            <div className={styles.pageList}>
              <div className={styles.pageNumberActive}>
                <div className={styles.pageNumber}>1</div>
              </div>
              <div className={styles.pageNumberInactive}>
                <div className={styles.pageNumber}>2</div>
              </div>
              <div className={styles.pageNumberInactive}>
                <div className={styles.pageNumber}>3</div>
              </div>
              <div className={styles.pageNumberInactive}>
                <div className={styles.pageNumber}>4</div>
              </div>
              <div className={styles.pageNumberInactive}>
                <div className={styles.pageNumber}>5</div>
              </div>
            </div>
          </div>
          <div className={styles.paginationControls}>
            <img className={styles.collapseArrowIcon} alt="Next Group Arrow" />
            <img className={styles.collapseArrowIcon} alt="Next Page Arrow" />
          </div>
        </div>

        {/* 댓글 입력창 */}
        <div className={styles.commentInputArea}>
          <div className={styles.commentInputBox}>
            <div className={styles.inputField}>
              <div className={styles.placeholderText}>메시지를 입력하세요</div>
            </div>
            <div className={styles.submitButton}>
              <img className={styles.messageIcon} alt="Send Message Icon" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardDetail;
