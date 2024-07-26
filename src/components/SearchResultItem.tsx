import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchResultItemProps {
  id: number;
  title: string;
  body: string;
  representative_image_id: string;
  textColor: string;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({
  id,
  title,
  body,
  representative_image_id,
  textColor,
}) => {
  const [imgSrc, setImgSrc] = useState<string>(
    representative_image_id ? representative_image_id : '/logo.svg'
  );
  const navigate = useNavigate();

  const errorLogoWidth = imgSrc === '/logo.svg' ? 'w-12' : '';
  const errorLogoHeight = imgSrc === '/logo.svg' ? 'h-12' : '';
  const errorLogoMargin = imgSrc === '/logo.svg' ? 'm-4' : '';

  const handleError = () => {
    setImgSrc('/logo.svg');
  };

  const contentTruncate = (str: string, n: number) => {
    return str?.length > n ? str.substring(0, n) + '...' : str;
  };

  return (
    <div className='flex w-full gap-2'>
      <div className='h-20 w-20 rounded-lg bg-[#F4F4F4]'>
        <img
          className={`rounded-lg ${errorLogoMargin} ${errorLogoWidth} ${errorLogoHeight}`}
          src={imgSrc}
          onError={handleError}
          alt='게시글 썸네일'
        />
      </div>
      <div className='flex w-[220px] flex-col gap-1'>
        <h2
          className={`mt-1 truncate font-semibold ${textColor} cursor-pointer`}
          onClick={() => navigate(`/post-detail/${id}`)}
        >
          {title}
        </h2>
        <p
          className={`flex-grow text-justify text-sm ${textColor} cursor-pointer`}
          onClick={() => navigate(`/post-detail/${id}`)}
        >
          {contentTruncate(body, 40)}
        </p>
      </div>
    </div>
  );
};

export default SearchResultItem;
