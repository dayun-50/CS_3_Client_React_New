// useBoardList.js
import { useEffect, useState } from "react";
import { caxios } from "../../../config/config";

const CATEGORY_MAP = {
    "전체": "all",
    "후기": "review",
    "무료나눔": "free",
    "질문": "qna",
};

const CATEGORY_MAP_REVERSE = Object.fromEntries(
    Object.entries(CATEGORY_MAP).map(([k, v]) => [v, k])
);

// 썸네일 blob url 생성
async function getThumbUrl(sysname) {
    const resp = await caxios.get("/file/download", {
        params: { sysname },
        responseType: "blob",
    });
    return URL.createObjectURL(resp.data);
}

export function UseBoardList() {


    // ----------- 필터 버튼 상태변수-----------
    const [typeBtn, setTypeBtn] = useState("all");
    const [activeCategory, setActiveCategory] = useState("전체");

    // ----------- 데이터에서 받아오는 서버 상태변수-----------
    const [thumbsUrlMap, setThumbsUrlMap] = useState({}); //보드 시퀀스를 키로 가지는 url만 value로 모아둔map
    const [mergedList, setMergedList] = useState([]); // 최종 맵돌리는 상태변수

    // ----------- 데이터에서 받아오는 서버 상태변수-----------
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState();
    const [count, setCount] = useState();

    // ----------- 검색용 상탭변수 -----------
    const [findTarget, setFindTarget] = useState();
    const [isSearching, setIsSearching] = useState();


    // ----------- 데이터 서버에서 받아오기 -----------
    useEffect(() => {
    Object.values(thumbsUrlMap).forEach(url => URL.revokeObjectURL(url));

    async function load() {

        let resp;

        if (isSearching && findTarget) {
            resp = await caxios.get("/board", {
                params: { target: findTarget, board_type: typeBtn, page: page }
            });
        } else {
            // 기본 목록 요청
            resp = await caxios.get("/board", {
                params: { board_type: typeBtn, page: page }
            });
        }

        await processBoardData(resp.data);
    }

    load();
}, [typeBtn, page, findTarget]);

    
    // ----------- 데이터 처리후 setMergedList 넣는 함수-----------    
    async function processBoardData(data) {
        setTotalCount(data.totalCount);
        setPage(data.page);
        setCount(data.count);

        const thumbs = data.thumb || data.thumbs || [];
        const thumbsMap = new Map();
        thumbs.forEach(t => thumbsMap.set(t.target_seq, t));

        const merged = data.boards.map(b => ({
            board: b,
            thumb: thumbsMap.get(b.board_seq) || null,
        }));
        setMergedList(merged);

        const urls = {};
        for (const item of merged) {
            if (item.thumb) {
            urls[item.board.board_seq] = await getThumbUrl(item.thumb.sysname);
            }
        }
        setThumbsUrlMap(urls);
        }

    
    // ----------- 버튼 onclick -----------
    const handleTopBtn = (cat) => {
        setActiveCategory(cat);
        setTypeBtn(CATEGORY_MAP[cat]);
        setPage(1);
    };

    const handleCardClick = (id) => {
        console.log(`${id}번 게시글로 이동!`);
    };

    const handleMenuClick = (e) => {
        e.stopPropagation();
    };

    const handleFindTarget = (e) => {
        setFindTarget(e.target.value);
    }

    const handleSendFindTarget = (e) => {
        setIsSearching(true);
    caxios.get("/board", {
        params: { target: findTarget, board_type: typeBtn, page: 1 }
    })
    .then(resp => {
        console.log("검색하고 나온 응답", resp);
        setPage(1);
        processBoardData(resp.data);
    });
    };

    const clearSearch = () => {
        setFindTarget("");
        setIsSearching(false);
        setPage(1);

        // 검색 조건 제거하고 기본목록 다시 불러오기
        caxios.get("/board", {
            params: { board_type: typeBtn, page: 1 }
        }).then(resp => {
            processBoardData(resp.data);
        });
        };



    return {
        CATEGORY_MAP,
        CATEGORY_MAP_REVERSE,
        activeCategory,
        typeBtn,
        page,
        count,
        totalCount,
        mergedList,
        thumbsUrlMap,
        isSearching,
        findTarget,        
        
        
        setPage,
        handleTopBtn,
        handleCardClick,
        handleMenuClick,
        handleFindTarget,
        handleSendFindTarget,
        setIsSearching,
        clearSearch,
    };
}
