import { Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './components/common/Layout';
import HomePage from './pages/HomePage';
import CommunityPage from './pages/CommunityPage';
import PostDetailPage from './pages/PostDetailPage';
import PostingPage from './pages/PostingPage';
import MyPage from './pages/MyPage';
import LoginPage from './pages/LoginPage';

function App() {
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
