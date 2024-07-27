import React, { useState } from 'react';
import SearchBar from './SearchBar';
import { useLocation } from 'react-router-dom';
import Ranking from './Ranking';

interface TabProps {
  textColor: string;
  backgroundColor: string;
}

const Tab: React.FC<TabProps> = ({ textColor, backgroundColor }) => {
  const { pathname } = useLocation();
  const [activeTab, setActiveTab] = useState('ranking');

  const handleTabClick = (tab: string) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
    }
  };

  const isHomePage = pathname === '/';
  const clickedHover = isHomePage
    ? 'hover:bg-white hover:shadow-md'
    : 'hover:bg-[#1F3653] hover:shadow-xl';
  const clickedTabRankingHome =
    activeTab === 'ranking' ? 'border-[#28466A] text-lg' : '';
  const clickedTabSearchingHome =
    activeTab === 'searching' ? 'border-[#28466A] text-lg' : '';
  const clickedTabRanking =
    activeTab === 'ranking' ? 'border-[#f9f9f9] text-lg' : 'border-[#868e96]';
  const clickedTabSearching =
    activeTab === 'searching' ? 'border-[#f9f9f9] text-lg' : 'border-[#868e96]';
  const clickedTabHome =
    'flex h-full cursor-pointer items-center justify-center rounded-t-lg border-b-2 text-center text-black font-chosun hover:text-lg hover:border-[#28466A]';
  const clickedTab =
    'flex h-full cursor-pointer items-center justify-center rounded-t-lg border-b-2 text-center light-white font-chosun hover:text-lg hover:border-[#f9f9f9]';

  return (
    <div className='mx-auto my-6 flex h-[calc(100vh-216px)] w-[340px] flex-col items-center justify-center gap-6'>
      <div className='grid h-[50px] w-full grid-cols-2 items-center justify-center px-2'>
        {isHomePage ? (
          <>
            <div
              className={`${clickedTabHome} ${clickedTabRankingHome}`}
              onClick={() => handleTabClick('ranking')}
            >
              한바퀴 랭킹
            </div>
            <div
              className={`${clickedTabHome} ${clickedTabSearchingHome}`}
              onClick={() => handleTabClick('searching')}
            >
              게시글 찾기
            </div>
          </>
        ) : (
          <>
            <div
              className={`${clickedTab} ${clickedTabRanking}`}
              onClick={() => handleTabClick('ranking')}
            >
              인기 게시글
            </div>
            <div
              className={`${clickedTab} ${clickedTabSearching}`}
              onClick={() => handleTabClick('searching')}
            >
              게시글 찾기
            </div>
          </>
        )}
      </div>
      <div className='w-full grow'>
        {activeTab === 'ranking' ? (
          <Ranking
            textColor={textColor}
            clickedHover={clickedHover}
            activeTab={activeTab}
          />
        ) : (
          <SearchBar
            textColor={textColor}
            backgroundColor={backgroundColor}
            clickedHover={clickedHover}
          />
        )}
      </div>
    </div>
  );
};

export default Tab;
