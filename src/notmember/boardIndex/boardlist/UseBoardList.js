// useBoardList.js
import { useEffect, useState } from "react";
import { caxios } from "../../../config/config";
import { useLocation, useNavigate } from "react-router-dom";

const CATEGORY_MAP = {
    "전체": "all",
    "후기": "review",
    "무료나눔": "free",
    "질문": "qna",
};

const CATEGORY_MAP_REVERSE = Object.fromEntries(
    Object.entries(CATEGORY_MAP).map(([k, v]) => [v, k])
);

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
    const location = useLocation();
    const [typeBtn, setTypeBtn] = useState("all");
    const [activeCategory, setActiveCategory] = useState("전체");
    const [thumbsUrlMap, setThumbsUrlMap] = useState({}); 
    const [mergedList, setMergedList] = useState([]); 
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState();
    const [count, setCount] = useState();
    const [findTarget, setFindTarget] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [isMine, setIsMine] = useState(false);

    const getPreviewText = (content) => { 
        try {
            const json = JSON.parse(content);
            return extractTextFromContent(json);
        } catch (e) {
            return "";
        }
    };

    const extractTextFromContent = (node) => { 
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

    async function load() {
        let resp;
        if (isSearching && findTarget) {
            resp = await caxios.get("/board", {
                params: { target: findTarget, board_type: typeBtn, page: page }
            });
        } else {
            resp = await caxios.get("/board", {
                params: { board_type: typeBtn, page: page }
            });
        }

        await processBoardData(resp.data);
    }

    useEffect(() => {
        if (location.state?.refresh) {
            load();
        }
    }, [location.state]);

    useEffect(() => {
        Object.values(thumbsUrlMap).forEach(url => URL.revokeObjectURL(url));
        load();
    }, [typeBtn, page, findTarget]);
 
    async function processBoardData(data) {
        setTotalCount(data.totalCount);
        setPage(data.page);
        setCount(data.count);

        const thumbs = data.thumb || data.thumbs || [];
        const thumbsMap = new Map();
        thumbs.forEach(t => thumbsMap.set(t.target_seq, t));

        if (!data.boards) {
            setMergedList([]);
            setThumbsUrlMap({});
            return;
        }

        const merged = data.boards.map(b => {
            const isMine = b.user_id === sessionStorage.getItem("id");


            const preview = getPreviewText(b.content);


            return {
                board: b,
                thumb: thumbsMap.get(b.board_seq) || null,
                preview,
                isMine
            };
        });

        setMergedList(merged);

        const urls = {};
        for (const item of merged) {
            if (item.thumb) {
                urls[item.board.board_seq] = await getThumbUrl(item.thumb.sysname);
            }
        }
        setThumbsUrlMap(urls);
    }

    const handleTopBtn = (cat) => { 
        setActiveCategory(cat);
        setTypeBtn(CATEGORY_MAP[cat]);
        setPage(1);
    };

    const handleCardClick = (id) => {
        navigate(`/board/detail?seq=${id}`);
    };

    const handleMenuClick = (e, id) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === id ? null : id); 
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
                setPage(1);
                processBoardData(resp.data);
            });
    };

    const clearSearch = () => {
        setFindTarget("");
        setIsSearching(false);
        setPage(1);

        caxios.get("/board", {
            params: { board_type: typeBtn, page: 1 }
        }).then(resp => {
            processBoardData(resp.data);
        });
    };

    const toWrite = () => {
        navigate("/board/write");
    };

    const handleMenuItemClick = (e, action, id) => {
        e.stopPropagation(); 
        setOpenMenuId(null);

        switch (action) {
            case "edit":
                handleEditBoard(id)
                break;
            case "delete":
                handleDeleteBoard(id);
                break;
            case "report":
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
