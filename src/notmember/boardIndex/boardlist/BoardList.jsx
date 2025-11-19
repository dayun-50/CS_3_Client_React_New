import React, { useState } from "react";
import {
  MoreHorizontal,
  Eye,
  MessageCircle,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Search,
} from "lucide-react"; // 아이콘 정리
import styles from "./BoardList.module.css";

// 서버에서 받아올 데이터 예시
const MOCK_DATA = [
  {
    id: 1,
    category: "질문",
    title: "2024년 부모급여 인상, 무엇이 달라지나?",
    description:
      "올해부터 0세 아동 가정에 월 100만원이 지급됩니다. 신청 방법과 지급 시기를 상세하게 정리해 드려요.",
    views: 1240,
    comments: 45,
    imageUrl:
      "https://cdn.billyapi.com/posts-seo/Image-seo-pregnant%20woman%20room-Korea.jpg",
  },
  {
    id: 2,
    category: "후기",
    title: "국민행복카드 바우처 알뜰하게 쓰는 꿀팁",
    description:
      "임신 출산 진료비 지원금, 어디서 쓰면 제일 좋을까요? 조리원부터 약국까지 사용처 총정리!",
    views: 85,
    comments: 12,
    imageUrl: "",
  },
  {
    id: 3,
    category: "질문",
    title: "32주차인데 가진통이랑 진진통 구분이 어려워요 ㅠㅠ",
    description:
      "배가 뭉치는 느낌이 계속 드는데 병원을 가야 할까요? 선배맘들의 조언 부탁드려요.",
    views: 342,
    comments: 28,
    imageUrl: "",
  },
  {
    id: 4,
    category: "무료나눔",
    title: "아기 침대랑 모빌 나눔합니다 (상태 A급)",
    description:
      "6개월 정도 깨끗하게 썼어요. 부피가 커서 직접 가져가실 분만 연락 주세요. 지역은 서울입니다.",
    views: 56,
    comments: 3,
    imageUrl: "",
  },
  {
    id: 5,
    category: "질문",
    title: "서울시 임산부 교통비 지원 신청하세요",
    description:
      "70만원 상당의 교통 포인트 지급! 지하철, 버스, 택시, 자차 유류비까지 사용 가능합니다.",
    views: 890,
    comments: 55,
    imageUrl:
      "https://via.placeholder.com/300x200/D8BFD8/ffffff?text=Transport",
  },
];

const CATEGORIES = ["전체", "후기", "무료나눔", "질문"];

const BoardList = () => {
  const [activeCategory, setActiveCategory] = useState("전체");

  // 카드 클릭 시 이동 함수
  const handleCardClick = (id) => {
    console.log(`${id}번 게시글로 이동!`);
  };

  // 메뉴 버튼 클릭 시 카드 클릭 이벤트 막기
  const handleMenuClick = (e) => {
    e.stopPropagation(); // 이벤트 전파 방지
    console.log("메뉴 열기");
  };

  return (
    <div className={styles.container}>
      {/* 상단 필터 및 검색 영역 */}
      <div className={styles.header}>
        <div className={styles.categoryList}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${styles.categoryItem} ${
                activeCategory === cat ? styles.active : ""
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            className={styles.searchInput}
          />
          <Search className={styles.searchIcon} size={24} />
        </div>
      </div>

      {/* 게시글 카드 그리드 */}
      <div className={styles.cardGrid}>
        <ul className={styles.gridContainer}>
          {MOCK_DATA.map((item) => (
            <li
              key={item.id}
              className={styles.card}
              onClick={() => handleCardClick(item.id)} // 카드 전체 클릭 이벤트
            >
              {/* 카드 상단 이미지 영역 */}
              <div className={styles.cardHeader}>
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className={styles.cardImage}
                />

                {/* 오버레이 메뉴 버튼 */}
                <button
                  className={styles.menuBtn}
                  aria-label="옵션 더보기"
                  onClick={handleMenuClick} // 이벤트 전파 방지 적용
                >
                  <MoreHorizontal size={24} color="#696b70" />
                </button>
              </div>

              {/* 텍스트 내용 */}
              <div className={styles.content}>
                <div className={styles.textGroup}>
                  {" "}
                  {/* 텍스트 그룹핑 */}
                  <span
                    className={`${styles.categoryTag} ${styles[item.category]}`}
                  >
                    {item.category}
                  </span>
                  <h3 className={styles.title}>{item.title}</h3>
                  <p className={styles.description}>{item.description}</p>
                </div>

                <div className={styles.stats}>
                  <div className={styles.statItem}>
                    <Eye size={16} />
                    <span>{item.views}</span>
                  </div>
                  <div className={styles.statItem}>
                    <MessageCircle size={16} />
                    <span>{item.comments}</span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 페이지네이션 */}
      <div className={styles.pagination}>
        <button className={styles.pageControl} disabled>
          <ChevronsLeft size={20} />
          <ChevronLeft size={20} />
        </button>
        <div className={styles.pageNumbers}>
          <button className={`${styles.pageBtn} ${styles.activePage}`}>
            1
          </button>
          <button className={styles.pageBtn}>2</button>
          <button className={styles.pageBtn}>3</button>
          <button className={styles.pageBtn}>4</button>
          <button className={styles.pageBtn}>5</button>
        </div>
        <button className={styles.pageControl}>
          <ChevronRight size={20} />
          <ChevronsRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default BoardList;
