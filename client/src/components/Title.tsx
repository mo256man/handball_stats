import irasutoya from '../assets/irasutoya.png'
import './Title.css'

const Title = () => {
  return (
    <div id="base" className="bgTeam0" style={{ width: '50%' }}>
      <img src={irasutoya} className="backgroundImage"/>
      <div className="titleString">ハンドスタッツ入力支援</div>
    </div>
  );
}

export default Title;
