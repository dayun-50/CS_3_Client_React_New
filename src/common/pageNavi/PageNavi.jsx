import styles from "./PageNavi.module.css"
import doubleLeftArrow from "./icon/doubleLeftArrow.svg"; // << 아이콘
import leftArrow from "./icon/leftArrow.svg"; // < 아이콘
import rightArrow from "./icon/rightArrow.svg"; // > 아이콘
import doubleRightArrow from "./icon/doubleRightArrow.svg"; // >> 아이콘
import { useEffect, useState } from "react";





function PageNavi({ page, setPage, count, totalCount, typeBtn }) {
    const [pageRange, setPageRange] = useState([]); // 페이지 네비 1개당 그룹 묶기 1-10, 11-20
    const totalPage = Math.ceil(totalCount / count); // 총 페이지
    const maxButtons = 5;// 버튼개수
    const group = Math.floor((page - 1) / maxButtons); //0 번그룹[1-5번네비] , 1번그룹[6-10번 네비]
    const start = group * maxButtons + 1; //현재 그룹의 첫번째 버튼
    const end = Math.min(start + maxButtons - 1, totalPage); //현재그룹의 마지막 버튼
    const lastGroup = Math.floor((totalPage - 1) / maxButtons);
    useEffect(() => {




        const range = [];
        for (let i = start; i <= end; i++) range.push(i);
        setPageRange(range);
    }, [page, totalCount, typeBtn, count]);

    const handlePageClick = (p) => {
        if (p !== page) setPage(p);
    };

    return (
        <div className={styles.pageNaviContainer}>
            {/* 페이징 네비게이션 */}
            <nav className={styles.paginationParent}>
                {/* << */}
                <img
                    src={doubleLeftArrow}
                    alt="처음"
                    onClick={() => handlePageClick(1)}
                    className={group === 0 ? styles.disabled : ""}
                    />

                {/* < */}
                <img
                    src={leftArrow}
                    alt="이전"
                    onClick={() => handlePageClick(Math.max(1, pageRange[0] - 1))}
                    className={pageRange[0] === 1 ? styles.disabled : ""}
                />

                {/* 페이지 리스트 */}
                <div className={styles.pagination}>
                    <div className={styles.paginationList}>
                        {pageRange.map((p) => (
                            <div
                                key={p}
                                className={
                                    p === page
                                        ? styles.paginationPageActive
                                        : styles.paginationPage
                                }
                                onClick={() => handlePageClick(p)}
                            >
                                <div className={styles.pageNumber}>{p}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* > */}
                <img
                    src={rightArrow}
                    alt="다음"
                    onClick={() =>
                        handlePageClick(
                            Math.min(totalPage, pageRange[pageRange.length - 1] + 1)
                        )
                    }
                    className={
                        pageRange[pageRange.length - 1] === totalPage
                            ? styles.disabled
                            : ""
                    }
                />

                {/* >> */}
                <img
                    src={doubleRightArrow}
                    alt="끝"
                    onClick={() => handlePageClick(totalPage)}
                    className={group === lastGroup ? styles.disabled : ""}
                />
            </nav>
        </div>
    );
}

export default PageNavi;
