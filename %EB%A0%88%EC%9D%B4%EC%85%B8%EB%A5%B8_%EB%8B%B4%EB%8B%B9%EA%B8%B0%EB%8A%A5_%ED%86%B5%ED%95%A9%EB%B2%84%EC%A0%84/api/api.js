
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://your-api-server.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchUserInfo = () => API.get('/api/user/info');
export const fetchWeeklyCalories = () => API.get('/api/exercise/weekly');
export const fetchExerciseRecommendation = () => API.get('/api/exercise/recommend');

export default API;
