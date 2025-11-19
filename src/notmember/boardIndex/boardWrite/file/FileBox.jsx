import styles from "./FileBox.module.css";

const FileBox = ({ uploadedFiles, setUploadedFiles }) => {

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.filebox}>
        
        {/* 스크롤 되는 파일 리스트 */}
        <div className={styles.fileListArea}>
            {uploadedFiles.map((file, index) => (
            <div key={index} className={styles.hwp}>
                {file.name}
                <button
                className={styles.fileBtn}
                onClick={() => handleRemoveFile(index)}
                >
                X
                </button>
            </div>
            ))}
        </div>

      {/* 아래 고정 버튼 */}
      <div className={styles.fileBtnArea}>
        <label htmlFor="fileUpload" className={styles.addFileLabel}>
            + 파일 추가
        </label>
        <input
            type="file"
            id="fileUpload"
            className={styles.hiddenFileInput}
            multiple
            onChange={handleFileChange}
        />
     </div>
    </div>
  );
};

export default FileBox;
