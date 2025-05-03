import './Exercise.css';
import YouTube from "react-youtube";
import {useRef, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Navbar from "../nav/Navbar";
import Content from "../common/Content";
import { fetchRecommendation, postExerciseRecord } from "../api/api";

const YoutubePlayer = () => {
  const playerRef = useRef(null);
  const navigate = useNavigate();
  const [videoId, setVideoId] = useState(null);

  useEffect(() => {
    async function loadVideo() {
      try {
        const data = await fetchRecommendation(1);  // 유저 ID 고정
        const filename = data.videos[0];             // 예: "hiit1.mp4"
        const id = filename.replace(".mp4", "").replace("hiit", "dQw4w9WgXcQ"); // 임시 예시
        setVideoId(id);  // 실제 서비스에서는 유튜브 ID 매핑 필요
      } catch (err) {
        console.error("추천 영상 불러오기 실패:", err);
      }
    }
    loadVideo();
  }, []);

  const onPlayerReady = (event) => {
    playerRef.current = event.target;
    event.target.playVideo(); // 자동 재생
  };

  const onPlayerStateChange = (event) => {
    const player = event.target;
    const state = event.data;

    if (state === 2) {
      console.log("⛔ 일시정지 시도! 다시 재생함");
      player.playVideo();
    }

    if (state === 0) {
      console.log("✅ 영상이 끝났습니다");
      alert("운동이 끝났어요! 기록 저장 중...");

      // 운동 기록 저장 예시
      postExerciseRecord(1, {
        poseAccuracy: 89,       // 예시값, 실제론 측정값 필요
        caloriesBurned: 37.5    // 예시값
      }).then(() => {
        console.log("✅ 운동 기록 저장됨");
        navigate("/complete");
      }).catch((err) => {
        console.error("❌ 저장 실패:", err);
        navigate("/complete");
      });
    }
  };

  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
      controls: 0
    }
  };

  return (
    <div className="exercise">
      <Navbar />
      <Content title="운동 영상" />
      {videoId && (
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={onPlayerReady}
          onStateChange={onPlayerStateChange}
        />
      )}
    </div>
  );
};

export default YoutubePlayer;
