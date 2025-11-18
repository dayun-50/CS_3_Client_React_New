import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Mypage from './mypage/Mypage';
import BabyController from '../../common/babySideNavi/babyController/BabyController';
import styles from "./ParentInfoIndex.module.css";

//부모마이페이지
const ParentInfoIndex = ()=>{
return(
    <div className={styles.container}>
        {/*좌측 부모 정보부분*/}
        <Mypage />

        {/*우측 : 아기 추가 및 이동 부분 = common/babySideNavi/babyController 컴포넌트 재사용(사용 ui및 내용 겹침) */}
        <BabyController />

    </div>
);


}
export default ParentInfoIndex;
