import './RaspberryCodeModal.css';
import {useNavigate} from "react-router-dom";
import axiosInstance from "../api/api";

const RaspberryCodeModal = ({ onClose }) => {
  const navigate = useNavigate();
  const select = async () => {
    // 입력 후 확인
    // TODO : 번호 확인
    // const response = await axiosInstance.post()
    navigate('/ex');
  }

  return (
      <div className="modal-backdrop">
        <div className="modal-box">
          <p>라즈베리 고유 코드를 입력해주세요</p>
          <input/>
          <button className="open-box" onClick={select}>확인</button>
          <button className="close-btn" onClick={onClose}>닫기</button>
        </div>
      </div>
  );
};

export default RaspberryCodeModal;
