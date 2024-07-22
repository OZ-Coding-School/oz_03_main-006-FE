import { Link } from 'react-router-dom';
import { PiPencilLine } from 'react-icons/pi';
import React from 'react';

interface PostingIconProps {
  iconColor: string;
}

const PostingIcon: React.FC<PostingIconProps> = ({ iconColor }) => {
  return (
    <Link to='/posting'>
      <PiPencilLine className={`text-2xl ${iconColor}`} />
    </Link>
  );
};

export default PostingIcon;
