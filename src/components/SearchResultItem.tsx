import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface SearchResultItemProps {
  id: number;
  title: string;
  body: string;
  representative_image_id: string;
  textColor: string;
  clickedHover: string;
  activeTab?: string;
  index?: number;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({
  id,
  title,
  body,
  representative_image_id,
  textColor,
  clickedHover,
  activeTab,
  index,
}) => {
  const [imgSrc, setImgSrc] = useState<string>(
    representative_image_id ? representative_image_id : '/logo.svg'
  );
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const errorLogoWidth = imgSrc === '/logo.svg' ? 'w-10' : '';
  const errorLogoHeight = imgSrc === '/logo.svg' ? 'h-10' : '';
  const errorLogoMargin = imgSrc === '/logo.svg' ? 'm-4' : '';

  const handleError = () => {
    setImgSrc('/logo.svg');
  };

  const contentTruncate = (str: string, n: number) => {
    return str?.length > n ? str.substring(0, n) + '...' : str;
  };

  const rankingBG =
    pathname === '/' ? 'bg-[#28466A] text-white' : 'bg-[#f9f9f9] text-black';

  return (
    <div
      className={`flex w-full gap-2 rounded-lg p-2 ${clickedHover}`}
      onClick={() => navigate(`/post-detail/${id}`)}
    >
      <div className='relative h-[72px] w-[72px] rounded-lg bg-[#F4F4F4]'>
        {activeTab === 'ranking' && (
          <p
            className={`absolute -left-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full font-okgung text-sm ${rankingBG}`}
          >
            {index! + 1}
          </p>
        )}
        <img
          className={`rounded-lg ${errorLogoMargin} ${errorLogoWidth} ${errorLogoHeight}`}
          src={imgSrc}
          onError={handleError}
          alt='게시글 썸네일'
        />
      </div>
      <div className='flex w-[230px] flex-col gap-1'>
        <h2 className={`truncate font-semibold ${textColor} cursor-pointer`}>
          {title}
        </h2>
        <p
          className={`flex-grow text-justify text-sm ${textColor} cursor-pointer`}
        >
          {contentTruncate(body, 42)}
        </p>
      </div>
    </div>
  );
};

export default SearchResultItem;
