
import { useEffect, useRef, useState } from "react";
import { caxios, FILE_SERVER } from "../../../config/config";
import { useLocation, useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import { setContent } from "@tiptap/core";


export function UseBoardWrite() {
    const navigate = useNavigate();
    const location = useLocation();
    const isEditMode = location.state?.mode == "edit";
    const editBoardSeq = location.state?.board_seq;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [selectedVisibility, setSelectedVisibility] = useState("all");
    const options = ["후기", "질문", "무료나눔"];
    const [selected, setSelected] = useState(options[0]);
    const [isOpen, setIsOpen] = useState(false);
    const CATEGORY_MAP = {
        "전체": "all",
        "후기": "review",
        "무료나눔": "free",
        "질문": "qna",
    };
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [originalServerFiles, setOriginalServerFiles] = useState([]);
    const [inEditorUploadFiles, setInEditorUploadFiles] = useState([]);
    const [existingThumbnailSysname, setExistingThumbnailSysname] = useState(null);



    const [editorInstance, setEditorInstance] = useState(null);
    const [initialContent, setInitialContent] = useState(null);
    const editorRef = useRef(null);
    const titleRef = useRef(null);
    const id = sessionStorage.getItem("id");

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const handleFileSelect = (event) => {
        const newFiles = Array.from(event.target.files);

        if (uploadedFiles.length + newFiles.length > 7) {
            alert("파일은 최대 7개까지 가능합니다.");
            event.target.value = null;
            return;
        }

        setUploadedFiles((prev) => [...prev, ...newFiles]);
        event.target.value = null;
    };

    const handleFileRemove = (indexToRemove) => {
        setUploadedFiles((prevFiles) =>
            prevFiles.filter((_, index) => index !== indexToRemove)
        );
    };

    const getFileSize = async (sysname) => {
        const resp = await fetch(
            `${FILE_SERVER}/file/download?sysname=${encodeURIComponent(sysname)}&file_type=board/file/`
        );
        const blob = await resp.blob();
        return blob.size;
    };


    const handleSelect = (option) => {
        setSelected(option);
        setIsOpen(false);
    };

    const handleVisibilityChange = (option) => {
        setSelectedVisibility(option);
    };

    const handleBack = () => {
        navigate(-1);
    }

    const extractImages = (node, arr = []) => {
        if (!node) return arr;
        if (node.type === "image") {
            const url = node.attrs.src;
            const sysname = url.split("/").pop();
            arr.push(sysname);
        }
        if (node.content) {
            node.content.forEach(child => extractImages(child, arr));
        }
        return arr;
    };

    const extractThumbnailFile = (contentJSON, inEditorUploadFiles) => {
        let firstImageUrl = null;
        const findFirstImage = (node) => {
            if (!node || firstImageUrl) return;
            if (node.type === "image") {
                firstImageUrl = node.attrs.src;
                return;
            }
            if (node.content) {
                node.content.forEach(findFirstImage);
            }
        };
        findFirstImage(contentJSON);

        if (!firstImageUrl) return null;
        const matched = inEditorUploadFiles.find(item => item.url === firstImageUrl);
        return matched?.file || null;
    };

    const compressImage = async (file) => {
        const options = {
            maxSizeMB: 0.3,
            maxWidthOrHeight: 500,
            useWebWorker: true
        }

        try {
            const compressedBlob = await imageCompression(file, options);
            const compressedFile = new File(
                [compressedBlob],
                file.name,
                { type: compressedBlob.type }
            );
            return compressedFile;
        } catch (error) {
            return file;
        }
    }

    const imageUrlToFile = async (imageUrl, filename = "thumbnail.jpg") => {
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        return new File([blob], filename, {
            type: blob.type || "image/jpeg",
            lastModified: Date.now(),
        });
    };

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

    const handleComplete = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        if (!editorInstance) return;
        if (titleRef.current?.value.length > 30) {
            alert("제목은 최대 30글자까지 가능합니다.");
            setIsSubmitting(false);
            return;
        }

        const title = titleRef.current?.value || "";
        const editorText = editorInstance?.getText().replace(/\s/g, "");
        const contentJSON = editorInstance.getJSON();
        const imageSysList = extractImages(contentJSON);

        if (!title.trim()) {
            alert("제목을 입력하세요");
            setIsSubmitting(false);
            return;
        }

        if (!editorText && imageSysList.length === 0) {
            alert("내용을 입력하거나 이미지를 추가하세요");
            setIsSubmitting(false);
            return;
        }

        const contentBytes = getContentBytes(contentJSON);
        const MAX_CONTENT_BYTES = 14 * 1024 * 1024;
        if (contentBytes > MAX_CONTENT_BYTES) {
            alert(`본문 용량이 너무 큽니다. 현재 ${contentBytes} bytes / 제한 ${MAX_CONTENT_BYTES} bytes`);
            setIsSubmitting(false);
            return;
        }


        const form = new FormData();
        uploadedFiles.forEach(file => {
            if (!file.isServerFile) {
                form.append("files", file);

            }
        });
        form.append("content", JSON.stringify(contentJSON));
        form.append("imageSysList", JSON.stringify(imageSysList));

        const currentImageSysList = extractImages(contentJSON);
        const firstImageSysname = currentImageSysList[0] || null;

        if (!isEditMode) {
            const thumbnailFile = extractThumbnailFile(contentJSON, inEditorUploadFiles);
            if (thumbnailFile) {
                const compressedThumbnail = await compressImage(thumbnailFile);
                form.append("thumbnail", compressedThumbnail);
            }
        }
        else {
            if (!firstImageSysname) {
                form.append("removeThumbnail", "true");
            }

            const newThumbFile = extractThumbnailFile(contentJSON, inEditorUploadFiles);

            if (newThumbFile) {
                const compressedThumbnail = await compressImage(newThumbFile);
                form.append("thumbnail", compressedThumbnail);
            }

            if (existingThumbnailSysname !== firstImageSysname && firstImageSysname) {

                const imageUrl = `${FILE_SERVER}/file/download?sysname=${firstImageSysname}&file_type=board/img/`;
                const recreatedFile = await imageUrlToFile(imageUrl, firstImageSysname);
                const compressedThumbnail = await compressImage(recreatedFile);
                form.append("thumbnail", compressedThumbnail);
                form.append("justChanged", true);
            }
        }

        form.append("title", titleRef.current.value);
        const board_type = CATEGORY_MAP[selected];
        form.append("board_type", board_type);
        let is_privated = selectedVisibility === "member" ? true : false;
        if (selectedVisibility) form.append("is_privated", is_privated);


        if (isEditMode) {
            form.append("board_seq", editBoardSeq);

            try {
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
            } finally {
                setIsSubmitting(false);
            }

        }

        else {
            try {
                await caxios.post("/board/write", form)
                    .then(resp => {
                        alert("작성이 완료되었습니다!")
                        navigate("/board");
                    })


            } catch (err) {
                alert("업로드에 실패했습니다. 다시 시도하세요");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    useEffect(() => {
        if (!isEditMode) {
            setUploadedFiles([]);
            setExistingThumbnailSysname(null);
            setOriginalServerFiles([]);
            setInitialContent(null);
        }
    }, [isEditMode]);
    useEffect(() => {
        if (!isEditMode) { return; }

        caxios.get(`/board/detail?seq=${editBoardSeq}`).then(async resp => {
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
            const oldImages = extractImages(parsed);
            setExistingThumbnailSysname(oldImages[0] || null);

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

    }, [editorInstance, initialContent]);
    useEffect(() => {
        if (isEditMode) {
            setUploadedFiles([]);
        }
    }, [isEditMode]);

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
        isSubmitting
    };
}
