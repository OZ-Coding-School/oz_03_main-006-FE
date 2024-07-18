import React from 'react';
import { Tag } from '../../config/types';
import { RxCross2 } from 'react-icons/rx';
import { useTagStore } from '../../config/store';

interface TagItemProps {
  tagContent: Tag;
  showDeleteButton: boolean;
}

const TagItem: React.FC<TagItemProps> = ({ tagContent, showDeleteButton }) => {
  const removeTag = useTagStore((state) => state.removeTag);
  return (
    <div className='mr-2 flex h-auto rounded-md border-[#d9264d] bg-[#ffe9ed] px-2 text-[#d9264d]'>
      <p className='m-auto text-sm'>{tagContent.content}</p>
      {!showDeleteButton ? (
        <button
          className='ml-2 text-sm text-[#d9264d]'
          onClick={() => removeTag(tagContent.id)}
        >
          <RxCross2 />
        </button>
      ) : null}
    </div>
  );
};

export default TagItem;
