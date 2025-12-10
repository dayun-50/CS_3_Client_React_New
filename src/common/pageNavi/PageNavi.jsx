import styles from "./PageNavi.module.css"
import doubleLeftArrow from "./icon/doubleLeftArrow.svg";
import leftArrow from "./icon/leftArrow.svg";
import rightArrow from "./icon/rightArrow.svg";
import doubleRightArrow from "./icon/doubleRightArrow.svg";
import { useEffect, useState } from "react";





function PageNavi({ page, setPage, count, totalCount, typeBtn }) {
    const [pageRange, setPageRange] = useState([]);
    const totalPage = Math.ceil(totalCount / count);
    const maxButtons = 5;
    const group = Math.floor((page - 1) / maxButtons);
    const start = group * maxButtons + 1;
    const end = Math.min(start + maxButtons - 1, totalPage);
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
            <nav className={styles.paginationParent}>
                <img
                    src={doubleLeftArrow}
                    alt="처음"
                    onClick={() => handlePageClick(1)}
                    className={group === 0 ? styles.disabled : ""}
                />

                <img
                    src={leftArrow}
                    alt="이전"
                    onClick={() => handlePageClick(Math.max(1, pageRange[0] - 1))}
                    className={pageRange[0] === 1 ? styles.disabled : ""}
                />

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
