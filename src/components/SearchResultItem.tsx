import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
interface SearchResultItemProps {
  id: number;
  title: string;
  body: string;
  content?: string;
  thumbnail: string | null;
  textColor: string;
  clickedHover: string;
  activeTab?: string;
  index?: number;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({
  id,
  title,
  body,
  content,
  thumbnail,
  textColor,
  clickedHover,
  activeTab,
  index,
}) => {
  const [imgSrc, setImgSrc] = useState<string>(
    thumbnail ? thumbnail : '/logo.svg'
  );
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const contentRef = useRef<HTMLParagraphElement>(null);

  const errorLogoMargin = imgSrc === '/logo.svg' ? 'ml-1.5' : '';

  const handleError = () => {
    setImgSrc('/logo.svg');
  };

  const domParse = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const bodyLength = (str: string, n: number): string => {
    const cleanStr = domParse(str);
    return cleanStr?.length > n ? cleanStr.substring(0, n) + '...' : cleanStr;
  };

  const contentLength = (str: string, n: number): string => {
    const cleanStr = domParse(str);
    return cleanStr?.length > n ? cleanStr.substring(0, n) + '...' : cleanStr;
  };

  const imgBG = pathname === '/' ? 'bg-[#F4F4F4]' : 'bg-[#223F5A]';
  const rankingBG =
    pathname === '/' ? 'bg-[#28466A] text-white' : 'bg-[#f9f9f9] text-black';

  return (
    <div
      className={`flex w-full gap-2 rounded-lg p-2 ${clickedHover}`}
      onClick={() => navigate(`/post-detail/${id}`)}
    >
      <div className={`relative h-[72px] w-[72px] rounded-lg ${imgBG}`}>
        {activeTab === 'ranking' && (
          <p
            className={`absolute -left-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full font-okgung text-sm ${rankingBG}`}
          >
            {index! + 1}
          </p>
        )}
        <div className='flex h-full w-full items-center justify-center'>
          <img
            className={`rounded-lg ${errorLogoMargin}`}
            style={{
              width: '90%',
              height: '90%',
              objectFit: 'contain',
            }}
            src={imgSrc}
            onError={handleError}
            alt='게시글 썸네일'
          />
        </div>
      </div>
      <div className='flex w-[230px] flex-col gap-1'>
        <h2 className={`truncate font-semibold ${textColor} cursor-pointer`}>
          {title}
        </h2>
        {body && (
          <p
            className={`flex-grow text-justify text-sm ${textColor} cursor-pointer`}
            ref={bodyRef}
            title={domParse(body)}
          >
            {bodyLength(body, 42)}
          </p>
        )}
        {content && (
          <p
            className={`flex-grow text-justify text-sm ${textColor} cursor-pointer`}
            ref={contentRef}
            title={domParse(content)}
          >
            {contentLength(content, 42)}
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchResultItem;
