import React from 'react';

interface SubtitleProps {
  textColor: string;
}

const Subtitle: React.FC<SubtitleProps> = ({ textColor }) => {
  return (
    <p
      className={`mx-auto my-6 w-[312px] text-center font-chosun text-xl ${textColor}`}
    >
      한국을 한(韓)바퀴 돌아보세요
    </p>
  );
};

export default Subtitle;
