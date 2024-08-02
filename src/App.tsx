import { Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './components/common/Layout';
import HomePage from './pages/HomePage';
import CommunityPage from './pages/CommunityPage';
import PostDetailPage from './pages/PostDetailPage';
import PostingPage from './pages/PostingPage';
import MyPage from './pages/MyPage';
import LoginPage from './pages/LoginPage';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useUserStore } from '../config/store';

function App() {
  const clearUser = useUserStore((state) => state.clearUser);

  useEffect(() => {
    const jwt = Cookies.get('jwt');
    const refresh = Cookies.get('refresh_token');
    if (!jwt || !refresh) {
      clearUser();
    }
  }, [clearUser]);

  return (
    <>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path='/community/:location_id' element={<CommunityPage />} />
          <Route path='/post-detail/:post_id' element={<PostDetailPage />} />
        </Route>
        <Route path='/posting/:post_id?' element={<PostingPage />} />
        <Route path='/mypage' element={<MyPage />} />
        <Route path='/login' element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
