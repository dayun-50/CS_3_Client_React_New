
import { useEffect, useRef, useState } from "react";
import { caxios, FILE_SERVER } from "../../../config/config";
import { useLocation, useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import { setContent } from "@tiptap/core";


export function UseBoardWrite() {
    const navigate = useNavigate();
    // ----------- 일반작성 모드, 편집모드 감지하기 -----------
    const location = useLocation();
    const isEditMode = location.state?.mode == "edit";
    const editBoardSeq = location.state?.board_seq;



    // ----------- 버튼 상태변수 -----------
    const [selectedVisibility, setSelectedVisibility] = useState("all"); //공개여부
    // ----------- 드롭다운 상태변수 -----------
    const options = ["후기", "질문", "무료나눔"]; // 드롭다운 옵션
    const [selected, setSelected] = useState(options[0]); // 초기 선택값
    const [isOpen, setIsOpen] = useState(false);//드롭다운 여닫기 상태변수
    const CATEGORY_MAP = {
        "전체": "all",
        "후기": "review",
        "무료나눔": "free",
        "질문": "qna",
    };
    // ----------- 첨부 파일 파일 상태변수 -----------
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [originalServerFiles, setOriginalServerFiles] = useState([]);


    // ----------- 에디터 내의 이미지 상태변수 -----------
    const [inEditorUploadFiles, setInEditorUploadFiles] = useState([]);
    const [existingThumbnailSysname, setExistingThumbnailSysname] = useState(null);



    const [editorInstance, setEditorInstance] = useState(null);
    const [initialContent, setInitialContent] = useState(null);
    const editorRef = useRef(null);
    const titleRef = useRef(null);
    // ------------로그인 여부 -------------
    const id = sessionStorage.getItem("id");



    // ----------- 파일 관련 함수  -----------
    // 파일 크기 포매터
    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]; // 숫자를 소수점 두 자리까지 표시하고 단위와 함께 반환
    };

    // 파일 선택 핸들러 :FileList 객체를 배열로 변환
    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);// 기존 파일 목록에 새 파일을 추가
        setUploadedFiles((prevFiles) => [...prevFiles, ...files]);// 파일 선택 입력 필드를 초기화하여 동일한 파일을 다시 선택할 수 있도록 함
        event.target.value = null;
    };

    // 파일 삭제 핸들러 :인덱스를 사용하여 해당 파일만 제외하고 새 배열 생성
    const handleFileRemove = (indexToRemove) => {
        setUploadedFiles((prevFiles) =>
            prevFiles.filter((_, index) => index !== indexToRemove)
        );
    };

    //파일 사이즈 받아오기
    const getFileSize = async (sysname) => {
        const resp = await fetch(
            `${FILE_SERVER}/file/download?sysname=${encodeURIComponent(sysname)}&file_type=board/file/`
        );
        const blob = await resp.blob();
        return blob.size;
    };




    // ----------- 버튼  함수 -----------
    //드롭다운 선택
    const handleSelect = (option) => {
        setSelected(option);
        setIsOpen(false);
    };
    //공개버튼 세팅
    const handleVisibilityChange = (option) => {
        setSelectedVisibility(option);
    };
    //뒤로가기
    const handleBack = () => {
        navigate(-1);
    }

    // imageSysList용 :작성완료된 글에서 미리보기된 파일 sysname 추출
    const extractImages = (node, arr = []) => {
        if (!node) return arr;
        if (node.type === "image") {
            const url = node.attrs.src;
            const sysname = url.split("/").pop(); // 파일명 추출
            arr.push(sysname);
        }
        if (node.content) {
            node.content.forEach(child => extractImages(child, arr));
        }
        return arr;
    };
    //thumbnail용: 썸네일 파일 추출 함수
    const extractThumbnailFile = (contentJSON, inEditorUploadFiles) => { //에디터 객체 전체, 에디터에 업로드되었던 파일 리스트
        let firstImageUrl = null;
        const findFirstImage = (node) => {
            if (!node || firstImageUrl) return;
            if (node.type === "image") {//노드 타입이 이미지이면
                firstImageUrl = node.attrs.src; //첫번째 이미지 URL 저장
                return;
            }
            if (node.content) {
                node.content.forEach(findFirstImage);
            }
        };
        findFirstImage(contentJSON);//에디터 객체 전체를 돌려서 첫번째 이미지 URL 찾기

        if (!firstImageUrl) return null;
        const matched = inEditorUploadFiles.find(item => item.url === firstImageUrl);//에디터에 업로드되었던 파일 리스트에서 URL이 일치하는 파일 찾기
        return matched?.file || null;
    };
    //thumbnail 압축시키기
    const compressImage = async (file) => {
        const options = {
            maxSizeMB: 0.3,
            maxWidthOrHeight: 500,
            useWebWorker: true//성능향상
        }

        try {
            const compressedBlob = await imageCompression(file, options); //blob으로 압축
            const compressedFile = new File(//파일객체로 변환
                [compressedBlob],
                file.name,
                { type: compressedBlob.type }
            );
            return compressedFile;
        } catch (error) {
            console.error("이미지 압축 오류:", error);
            return file;
        }
    }
    // img src(URL) → File 객체로 변환
    const imageUrlToFile = async (imageUrl, filename = "thumbnail.jpg") => {
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        return new File([blob], filename, {
            type: blob.type || "image/jpeg",
            lastModified: Date.now(),
        });
    };

    //에디터 용량 제한
    const utf8Length = (str) => {
        let bytes = 0;
        for (let i = 0; i < str.length; i++) {
            const code = str.charCodeAt(i);
            if (code <= 0x7F) bytes += 1;
            else if (code <= 0x7FF) bytes += 2;
            else if (code <= 0xFFFF) bytes += 3;
            else bytes += 4;
        }
        return bytes;
    };
    const getContentBytes = (contentJSON) => {
        const json = JSON.stringify(contentJSON);
        return utf8Length(json);
    };


    //작성완료
    const handleComplete = async () => {
        if (!editorInstance) return;

        const title = titleRef.current?.value || "";

        // tiptap 에디터 텍스트 추출
        const editorText = editorInstance?.getText().replace(/\s/g, "");
        const contentJSON = editorInstance.getJSON(); //컨텐츠
        const imageSysList = extractImages(contentJSON); //이미지의 시스네임 리스트

        // 제목이 비었거나, 에디터가 비었거나, 엔터/공백만 있을 때
        if (!title.trim()) {
            alert("제목을 입력하세요");
            return;
        }

        if (!editorText && imageSysList.length === 0) {
            alert("내용을 입력하거나 이미지를 추가하세요");
            return;
        }

        const contentBytes = getContentBytes(contentJSON);
        const MAX_CONTENT_BYTES = 14 * 1024 * 1024; // 14MB
        if (contentBytes > MAX_CONTENT_BYTES) {
            alert(`본문 용량이 너무 큽니다. 현재 ${contentBytes} bytes / 제한 ${MAX_CONTENT_BYTES} bytes`);
            return;
        }


        const form = new FormData();
        // 1) 파일 담기
        uploadedFiles.forEach(file => {
            if (!file.isServerFile) {
                form.append("files", file);
            }
        });

        // 2) 에디터 JSON 담기
        form.append("content", JSON.stringify(contentJSON));
        form.append("imageSysList", JSON.stringify(imageSysList));


        //3) 작성 완료 시, 실제 보내지는 이미지 리스트와 미리보기 배열과 비교해서 썸네일 파일 한개 추출
        // 썸네일 파일 추출 기준: 1. 실제로 작성 완료시 보내진 에디터에 포함된 파일일 것 2.가장 첫번째 사진일 것
        // const thumbnailFile = extractThumbnailFile(contentJSON, inEditorUploadFiles);
        // const compressedThumbnail = thumbnailFile ? await compressImage(thumbnailFile) : null;
        // form.append("thumbnail", compressedThumbnail);

        // 3) 썸네일 처리
        // 에디터 내용에서 이미지 sysname 리스트 뽑기
        // const currentImageSysList = extractImages(contentJSON);
        // const firstImageSysname = currentImageSysList[0] || null;

        // // 3-1) 썸네일 파일 추출 (에디터에 올라갔던 파일 리스트 기준)
        // let thumbnailFile = extractThumbnailFile(contentJSON, inEditorUploadFiles);

        // // 3-2) 썸네일 파일이 있으면 압축해서 form에 추가
        // if (thumbnailFile) {
        //     const compressedThumbnail = await compressImage(thumbnailFile);
        //     form.append("thumbnail", compressedThumbnail);
        // }

        // // 3-3) 수정 모드 썸네일 처리
        // if (isEditMode) {
        //     // 1. 이미지 전부 삭제됨 → 썸네일 제거
        //     if (!firstImageSysname) {
        //         form.append("removeThumbnail", "true");
        //     }
        //     // 2. 기존 썸네일과 현재 첫 이미지가 다르면 → 썸네일 변경 필요
        //     else if (existingThumbnailSysname !== firstImageSysname) {

        //         // ✅ 새로 추가된 이미지가 썸네일이 된 경우도 여기 포함됨
        //         form.append("newThumbnailSysname", firstImageSysname);

        //         // ✅ 이 이미지가 새로 업로드된 경우라면 다시 thumbnail 파일도 포함
        //         const newThumbFile = extractThumbnailFile(contentJSON, inEditorUploadFiles);
        //         if (newThumbFile) {
        //             const compressedThumbnail = await compressImage(newThumbFile);
        //             form.append("thumbnail", compressedThumbnail);
        //         }
        //     }
        // }

        // ===== 썸네일 처리 (수정 모드 전용) =====
        const currentImageSysList = extractImages(contentJSON);
        const firstImageSysname = currentImageSysList[0] || null;

        if (!isEditMode) { // 작성 모드일때는 : 최초 작성 → 첫 이미지 썸네일
            const thumbnailFile = extractThumbnailFile(contentJSON, inEditorUploadFiles);
            if (thumbnailFile) {
                const compressedThumbnail = await compressImage(thumbnailFile);
                form.append("thumbnail", compressedThumbnail);
            }
        }
        else { // 수정 모드일때는 :
            // 1. 이미지가 아예 없음 → 썸네일 제거
            if (!firstImageSysname) {
                form.append("removeThumbnail", "true");
            }

            // 새 이미지가 추가됐는지 확인
            const newThumbFile = extractThumbnailFile(contentJSON, inEditorUploadFiles);

            // 2. 새로 추가된 이미지가 있으면 → 그게 썸네일
            if (newThumbFile) {
                const compressedThumbnail = await compressImage(newThumbFile);
                form.append("thumbnail", compressedThumbnail);
            }

            // 3. 기존 이미지 중 순서 변경 → 첫 이미지가 바뀐 경우
            if (existingThumbnailSysname !== firstImageSysname && firstImageSysname) {

                const imageUrl = `${FILE_SERVER}/file/download?sysname=${firstImageSysname}&file_type=board/img/`;
                // img src → File 객체 재생성
                const recreatedFile = await imageUrlToFile(imageUrl, firstImageSysname);
                // 압축
                const compressedThumbnail = await compressImage(recreatedFile);
                // form에 다시 추가
                form.append("thumbnail", compressedThumbnail);
                form.append("justChanged", true);
            }
        }



        // 3) 나머지 값 담기
        form.append("title", titleRef.current.value);
        const board_type = CATEGORY_MAP[selected];
        form.append("board_type", board_type);
        let is_privated = selectedVisibility === "member" ? true : false;
        if (selectedVisibility) form.append("is_privated", is_privated);


        //4) 수정 모드일때는
        if (isEditMode) {
            form.append("board_seq", editBoardSeq);

            try {
                //기존 파일 중 삭제된 것 서버에 알려주기
                const deletedFiles = originalServerFiles
                    .filter(orig =>
                        !uploadedFiles.some(cur => cur.file_seq === orig.file_seq)
                    )
                    .map(f => f.file_seq);

                form.append("deletedFiles", JSON.stringify(deletedFiles));
                await caxios.put("/board/update", form);
                alert("수정이 완료되었습니다!")
                navigate(-1);

            } catch (error) {
                alert("게시글 수정에 실패했습니다. 다시 시도하세요");
            }
        }


        else {
            try {
                await caxios.post("/board/write", form)
                    .then(resp => {
                        console.log(resp);
                        alert("작성이 완료되었습니다!")
                        navigate("/board");
                    })


            } catch (err) {
                alert("업로드에 실패했습니다. 다시 시도하세요");
            }
        }



    };

    ///-----------------------useEffect 모음
    useEffect(() => {
        if (!isEditMode) {
            setUploadedFiles([]);
            setExistingThumbnailSysname(null);
            setOriginalServerFiles([]);
            setInitialContent(null);
        }
    }, [isEditMode]);
    // 편집 모드라면, 기존 내용 가져와서 세팅하기
    useEffect(() => {
        if (!isEditMode) { return; }

        caxios.get(`/board/detail?seq=${editBoardSeq}`).then(async resp => {
            console.log("받아온 에디터 데이터", resp)


            const board = resp.data.boards;
            const files = resp.data.files;

            titleRef.current.value = board.title;
            setSelectedVisibility(board.is_privated ? "member" : "all");

            const reverseMap = {
                review: "후기",
                free: "무료나눔",
                qna: "질문",
            };
            setSelected(reverseMap[board.board_type]);
            const mappedFiles = new Map();
            await Promise.all(
                files.map(async (file) => {
                    const size = await getFileSize(file.sysname);
                    mappedFiles.set(file.file_seq, {
                        file: null,
                        name: file.oriname,
                        size: size,
                        sysname: file.sysname,
                        isServerFile: true,
                        file_seq: file.file_seq,
                    });
                })
            );
            const parsed = JSON.parse(board.content);
            console.log("파스드", parsed)
            const oldImages = extractImages(parsed);
            setExistingThumbnailSysname(oldImages[0] || null);//썸네일의 시스네임 저장하기

            setUploadedFiles(Array.from(mappedFiles.values()));
            setInitialContent(board.content);
            setOriginalServerFiles(
                files.map(f => ({
                    file_seq: f.file_seq
                }))
            );
        });

    }, [])




    useEffect(() => {
        if (!editorInstance) return;
        const parsed = JSON.parse(initialContent);
        editorInstance.commands.setContent(parsed);

        // const updateHeight = () => {
        //     requestAnimationFrame(() => {
        //         const pm = editorInstance.view.dom;
        //         const wrapper = pm.closest(".simple-editor-content");
        //         if (!wrapper) return;
        //         pm.style.minHeight = Math.max(wrapper.clientHeight, pm.scrollHeight + 50) + "px";
        //     });
        // };
        // updateHeight();

    }, [editorInstance, initialContent]);


    // useEffect(() => {
    //     if (!editorInstance || !initialContent) return;

    //     try {
    //         const parsed = JSON.parse(initialContent);
    //         editorInstance.commands.setContent(parsed);



    //         setTimeout(() => {
    //             if (editorInstance && editorInstance.view && editorInstance.view.dom) {
    //                 const editorDom = editorInstance.view.dom;

    //                 // 💡 핵심 코드: offsetHeight 값을 읽어 브라우저에게 강제 리플로우 유도
    //                 // 이 값을 변수에 저장할 필요는 없으며, 읽는 행위 자체가 목적입니다.
    //                 const reflow = editorDom.offsetHeight;

    //                 // *주의*: `reflow` 변수는 사용되지 않으므로 ESLint 경고가 뜰 수 있습니다. 
    //                 // 필요한 경우 주석 처리나 ESLint 비활성화를 고려하세요.

    //                 console.log('강제 리플로우 실행 완료. 새로운 높이:', reflow);
    //             }
    //         }, 1000);


    //     } catch (e) {
    //         console.error("에디터 내용 파싱 실패", e);
    //     }
    // }, [editorInstance, initialContent]);


    //로그인 안햇으면 빠꾸 시키기
    const alertShown = useRef(false);
    useEffect(() => {
        if (alertShown.current) return;

        if (!id || id === "anonymousUser") {
            alertShown.current = true;
            alert("로그인 후 이용 가능한 서비스 입니다");
            navigate("/login");
        }
    }, []);


    return {
        handleBack,
        handleComplete,
        handleVisibilityChange,
        handleSelect,
        setIsOpen,
        setUploadedFiles,
        formatFileSize,
        handleFileSelect,
        handleFileRemove,
        setInEditorUploadFiles,
        setEditorInstance,

        titleRef,
        editorRef,
        uploadedFiles,
        options,
        isOpen,
        selected,
        selectedVisibility,
    };
}
