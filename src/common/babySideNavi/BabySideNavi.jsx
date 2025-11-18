import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import BabyController from './babyController/BabyController';


//아기 선택 사이드네비
const BabySideNavi = ()=>{
return(
    <div>
        <div >
            {/*위측 아기용 버튼(산모수첩, 챗봇 등등으로 이동용)*/}
            여기다가 아기페이지 내에서 이동할 버튼 만들기
        </div>


        <div>
            {/*아래쪽 아기 추가 및 바꾸는 버튼*/}
            <BabyController />
        </div>
    </div>
);


}
export default BabySideNavi;
