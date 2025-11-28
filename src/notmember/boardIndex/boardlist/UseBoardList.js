// useBoardList.js
import { useEffect, useState } from "react";
import { caxios } from "../../../config/config";
import { useNavigate } from "react-router-dom";

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
        params: {
            sysname: sysname,
            file_type: "board/thumb"
        },
        responseType: "blob",
    });
    return URL.createObjectURL(resp.data);
}

export function UseBoardList({ handleDeleteBoard, handleEditBoard }) {
    const navigate = useNavigate();

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
    const [findTarget, setFindTarget] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // ---------신고 혹은 수정 버튼인 드롭다운 메뉴 상태 관리-----------
    const [openMenuId, setOpenMenuId] = useState(null);

    //---------내 글인지 확인용 임시 변수-----------
    const [isMine, setIsMine] = useState(false);




    // ----------- 컨텐츠 내용 임시 파싱하기 -----------
    const getPreviewText = (content) => { // 스트링으로 감싸진 json을 다시 json형식으로 파싱시키기
        try {
            const json = JSON.parse(content);
            return extractTextFromContent(json);
        } catch (e) {
            console.error("content 파싱 실패:", content);
            return "";
        }
    };

    const extractTextFromContent = (node) => { //json을 현재 노드가 text 키값 가지고 있다면 반환시키도록
        if (!node) return "";
        let text = "";
        if (node.type === "text") {
            return node.text;
        }
        if (node.content && Array.isArray(node.content)) {
            node.content.forEach(child => {
                text += extractTextFromContent(child);
            });
        }
        return text;
    };

    // ----------- 데이터 서버에서 받아오기 -----------
    useEffect(() => {


        Object.values(thumbsUrlMap).forEach(url => URL.revokeObjectURL(url));
        async function load() {
            let resp;
            //검색중일 경우에는 검색 api 호출
            if (isSearching && findTarget) {
                resp = await caxios.get("/board", {
                    params: { target: findTarget, board_type: typeBtn, page: page }
                });

                //아니면 기본 목록
            } else {
                resp = await caxios.get("/board", {
                    params: { board_type: typeBtn, page: page }
                });
                console.log("파일리스트 오는지", resp);
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

        //게시물 비어있으면 바로 나가도록
        if (!data.boards) {
            setMergedList([]);
            setThumbsUrlMap({});
            return;
        }

        const merged = data.boards.map(b => {

            //내글인지 남의 글인지 확인
            if (b.user_id === sessionStorage.getItem("id")) {
                setIsMine(true);
            }

            const preview = getPreviewText(b.content);
            console.log(preview)
            console.log(typeof b.content)
            return {
                board: b,
                thumb: thumbsMap.get(b.board_seq) || null,
                preview
            }
        }
        );
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
    //수정, 삭제 버튼 index에서 생성후 list와 detail로 props전달함 : seq번호만 전달하면 됨
    const handleTopBtn = (cat) => { //상단 카테고리 선택 버튼
        setActiveCategory(cat);
        setTypeBtn(CATEGORY_MAP[cat]);
        setPage(1);
    };

    const handleCardClick = (id) => {//카드 클릭 시 상세페이지로 이동
        navigate(`/board/detail?seq=${id}`);
    };

    const handleMenuClick = (e, id) => {
        e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
        setOpenMenuId(openMenuId === id ? null : id); // 현재 열려있으면 닫고, 닫혀있으면 엽니다.
    };

    const handleFindTarget = (e) => { //검색어 입력
        setFindTarget(e.target.value);
    }

    const handleSendFindTarget = (e) => { //검색어 전송
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

    const clearSearch = () => { //검색 초기화
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


    // 글작성 버튼 클릭 시 이동 함수
    const toWrite = () => {
        navigate("/board/write");
    };


    // 드롭다운 메뉴 항목 클릭 핸들러
    const handleMenuItemClick = (e, action, id) => {
        e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
        setOpenMenuId(null); // 메뉴 닫기

        switch (action) {
            case "edit":
                handleEditBoard(id)
                break;
            case "delete":
                handleDeleteBoard(id);
                break;
            case "report":
                console.log(`[${id}번] 게시글 신고 처리`);
                break;
            default:
                break;
        }
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


        toWrite,
        setPage,
        handleTopBtn,
        handleCardClick,
        handleMenuClick,
        handleFindTarget,
        handleSendFindTarget,
        setIsSearching,
        clearSearch,
        handleMenuItemClick,
        openMenuId,
        setOpenMenuId,
        isMine
    };
}
