import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import BabyInfoPic from './babyInfoPic/BabyInfoPic';
import BabyInfo from './babyInfo/BabyInfo';
import styles from "./BabyInfoIndex.module.css";


//아기 마이페이지 : "/babymypage"
const BabyInfoIndex = ()=>{


return(
    <div className={styles.container}>
        <BabyInfoPic /> {/*아기 마이페이지 왼쪽 사진 넣는곳*/}
        <BabyInfo /> {/*아기 마이페이지 오른쪽 정보 부분 넣는곳*/}
    </div>
);


}
export default BabyInfoIndex;