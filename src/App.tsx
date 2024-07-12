import { Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './components/common/Layout';
import HomePage from './pages/HomePage';
import CommunityPage from './pages/CommunityPage';
import PostDetailPage from './pages/PostDetailPage';
import PostingPage from './pages/PostingPage';
import MyPage from './pages/MyPage';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path='/community/:location_id' element={<CommunityPage />} />
          <Route path='/post-detail' element={<PostDetailPage />} />
        </Route>
        <Route path='/posting' element={<PostingPage />} />
        <Route path='/mypage' element={<MyPage />} />
      </Routes>
    </>
  );
}

export default App;
