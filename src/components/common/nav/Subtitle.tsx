import React from 'react';

interface SubtitleProps {
  textColor: string;
}

const Subtitle: React.FC<SubtitleProps> = ({ textColor }) => {
  return (
    <div
      className={`mx-auto my-4 w-[312px] text-center font-chosun text-xl ${textColor}`}
    >
      한국을 한(韓)바퀴 돌아보세요
    </div>
  );
};

export default Subtitle;
