import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./BabyArticle.module.css";


const MOCK_CATEGORIES = [
  {
    id: 1,
    title: "국민행복카드안내",
    description: "'보육료', '유아학비', '건강보험 임신·출산 진료비 지원', '청소년산모 임신 · 출산 의료비 지원' 및 '사회서비스 전자바우처' 등 정부의 여러 바우처 지원을 공동으로 이용할 수 있는 통합카드입니다. 국민행복카드로 어린이집 · 유치원 어디서나 사용이 가능합니다.",
    bgColor: "#f0d827",
    bgImage: "https://cdn.cocoam.co.kr/upload/site/18201/5e5548927c831.png",
    path: "https://www.childcare.go.kr/?menuno=181",
    sourceName: "국민행복카드"
  },
  {
    id: 2,
    title: "공동육아방 서비스",
    description: "핵가족화로 인해 약화된 가족돌봄 기능을 보완하여 양육자의 육아부담을 경감하며 지역사회가 참여하는 돌봄공동체 조성을 통해 양육친화적인 사회 환경 조성",
    bgColor: "#e3adb9",
    bgImage: "https://umppa.seoul.go.kr/icare/webcontent/fcltyInfoManage/2025/8/11/0bd01c0d-48a5-42f7-a053-f3a530bbee04.jpg",
    path: "https://umppa.seoul.go.kr/icare/user/fcltyInfoManage/BD_selectCopertnChldcrContactList.do?q_svcClCode=1002&q_tap=1",
    sourceName: "우리동네키움포털"
  },
  {
    id: 3,
    title: "산후조리경비 지원사업 안내",
    description: "출산에 소요되는 경제적 부담을 경감하고 , 출산 이후 산모의 건강권을 확보하기 위하여 산후조리경비를 지원하는 사업입니다.",
    bgColor: "#add3e3",
    bgImage: "https://www.seoulmomcare.com/images/main_visual_img2_mobile.png",
    path: "https://www.seoulmomcare.com/notice/pcGuide.do",
    sourceName: "서울맘케어"
  },
  {
    id: 4,
    title: "임산부 교통비 지원사업 안내",
    description: "서울시 임산부 교통비 지원 사업은 교통약자인 임산부에게 이동 편의를 제공하여 건강한 출산을 지원하고출산 가정의 경제적인 부담을 경감하여 안정적인 출산환경을 조성하는 사업입니다.",
    bgColor: "#d5add3",
    bgImage: "https://www.seoulmomcare.com/images/main_visual_img1_pc.jpg",
    path: "https://www.seoulmomcare.com/notice/businessGuide.do",
    sourceName: "서울맘케어"
  },
  {
    id: 5,
    title: "온라인 발달검사",
    description: "가정에서 쉽고 편하게 상담할 수 있는 영유아 대상의 온라인 발달검사를 진행합니다.",
    bgColor: "#f0d827",
    bgImage: "https://iseoul.seoul.go.kr/images/portal/sub08/img_top_growth.png",
    path: "https://www.seoul-i.kr/",
    sourceName: "서울아이발달지원센터"
  },

  {
    id: 6,
    title: "서울시 난임부부 시술비 지원사업",
    description: "보건복지부에서 지원하는 서울시 난임부부 시술비 지원 서비스 안내입니다.",
    bgColor: "#f8e3ad",
    bgImage: "https://www.k-health.com/news/photo/202510/86347_93603_2748.jpg",
    path: "https://seoul-agi.seoul.go.kr/ifc-csp",
    sourceName: "https://www.k-health.com/news/articleView.html?idxno=86347"
  },


];


const ArticleCard = ({ category, articles }) => {

  const filteredArticles = articles
    .filter((a) => a.categoryId === category.id)
    .slice(-8)
    .reverse();




  return (
    <div className={styles.cardWrapper}>

      <div className={styles.cardContainer}>
        <Link to={category.path} className={styles.cardLink}>

          <div
            className={styles.cardHeader}
            style={{
              backgroundColor: category.bgColor,
              backgroundImage: category.bgImage ? `url(${category.bgImage})` : "none",
              backgroundSize: "cover",

              backgroundPosition: "center",
              backgroundRepeat: "no-repeat"

            }}
          >

            {category.sourceName && (
              <div className={styles.imageSource}>
                출처: {category.sourceName}
              </div>
            )}
          </div>


          <div className={styles.cardContent}>
            <b className={styles.cardTitle}>{category.title}</b>


            <div className={styles.cardDescription}>{category.description}</div>
          </div>
        </Link>
      </div>


      {filteredArticles.length > 0 && (
        <div className={styles.articleList}>
          {filteredArticles.map((article) => (
            <Link
              key={article.id}
              to={`/article/${article.id}`}
              className={styles.articleItem}
            >
              <div className={styles.articleTitle}>{article.title}</div>
              <div className={styles.articleDate}>{article.date}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};


const BabyArticle = () => {

  const [articles, setArticles] = useState([]);

  return (
    <div className={styles.sectionWrapper}>
      <div className={styles.cardGrid}>
        {MOCK_CATEGORIES.map((category) => (
          <ArticleCard
            key={category.id}
            category={category}
            articles={articles}
          />
        ))}
      </div>
    </div>
  );
};

export default BabyArticle;
