import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import ResultPage from "../result/ResultPage";
import axiosInstance from "../api/api";

const ResultContainer = () => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null); // { similarity, burned, goal }
  const [error, setError] = useState(null);

  const fetchResult = async () => {
    try {
      setLoading(true);
      setError(null);

      // 🔁 실제 API 호출
      // const response = await axiosInstance.get('/api/result'); // ← 여기를 실제 엔드포인트로 변경
      // setResult(response.data);

      // 🔁 1~3초 랜덤 대기
      const delay = Math.random() * 2000 + 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));

      // ✅ 더미 결과 데이터 생성
      const fakeResult = {
        similarity: Math.floor(Math.random() * 21) + 80, // 80~100%
        burned: Math.floor(Math.random() * 100) + 400,   // 400~500 kcal
        goal: 600,
      };

      setResult(fakeResult);
    } catch (err) {
      console.error(err);
      setError('운동 결과를 불러오는 데 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResult();
  }, []);

  // 🔄 로딩 상태
  if (loading) {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            height="100vh"
        >
          <CircularProgress size={80} thickness={5} />
          <Typography mt={2}>운동 결과 분석 중입니다...</Typography>
        </Box>
    );
  }

  // ⛔ 오류 발생 시
  if (error) {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            height="100vh"
            textAlign="center"
        >
          <Typography color="error" variant="h6" gutterBottom>
            {error}
          </Typography>
          <Button variant="contained" color="primary" onClick={fetchResult}>
            다시 시도하기
          </Button>
        </Box>
    );
  }

  // ✅ 결과 정상 렌더링
  return <ResultPage />;
};

export default ResultContainer;