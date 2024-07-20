const Comment = () => {
  return (
    <div className='mx-auto max-w-[1052px]'>
      <div className='ml-2 text-[18px]'>2개의 댓글</div>
      <form>
        <textarea
          name=''
          id=''
          className='my-3 h-[108px] w-full resize-none rounded-[10px] border border-solid border-[#7e7e7e] bg-[#d9d9d9] bg-opacity-[33%] p-4 outline-none'
          placeholder='댓글을 작성해주세요'
        ></textarea>
        <input
          type='submit'
          value='댓글 작성'
          className='ml-auto mr-2 block h-[34px] w-[96px] rounded-[6px] bg-[#28466A] font-semibold text-white'
        />
      </form>
      <div className='border-b-[1px] p-2'>
        <div className='flex justify-between'>
          <div className='flex'>
            <div className='m-2 text-[16px] font-semibold'>User1</div>
            <div className='m-2 text-[#777777]'>2024.7.9</div>
          </div>
          <div className='flex'>
            <button className='m-2 text-[13px] text-blue-400'>수정</button>
            <button className='m-2 text-[13px] text-red-400'>삭제</button>
          </div>
        </div>
        <div className='py-3'>서울 여행 정말 재밌겠어요!</div>
      </div>
    </div>
  );
};

export default Comment;
