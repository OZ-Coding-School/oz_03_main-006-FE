import React from 'react';

interface SubtitleProps {
  textColor: string;
}

const Subtitle: React.FC<SubtitleProps> = ({ textColor }) => {
  return (
    <div
      className={`waviy mx-auto my-4 w-[312px] text-center font-chosun text-xl ${textColor}`}
    >
      {/* 한국을 한(韓)바퀴 돌아보세요 */}
      <span style={{ '--i': 1 } as React.CSSProperties}>한</span>
      <span style={{ '--i': 2 } as React.CSSProperties}>국</span>
      <span style={{ '--i': 3 } as React.CSSProperties}>을</span>
      <span style={{ '--i': 4 } as React.CSSProperties}>&nbsp;</span>
      <span style={{ '--i': 5 } as React.CSSProperties}>한</span>
      <span style={{ '--i': 6 } as React.CSSProperties}>(韓)</span>
      <span style={{ '--i': 7 } as React.CSSProperties}>바</span>
      <span style={{ '--i': 8 } as React.CSSProperties}>퀴</span>
      <span style={{ '--i': 9 } as React.CSSProperties}>&nbsp;</span>
      <span style={{ '--i': 10 } as React.CSSProperties}>돌</span>
      <span style={{ '--i': 11 } as React.CSSProperties}>아</span>
      <span style={{ '--i': 12 } as React.CSSProperties}>보</span>
      <span style={{ '--i': 13 } as React.CSSProperties}>세</span>
      <span style={{ '--i': 14 } as React.CSSProperties}>요</span>
    </div>
  );
};

export default Subtitle;
