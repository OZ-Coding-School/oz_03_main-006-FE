import { useParams } from 'react-router-dom';
import PostsData from '../data/posts.json';
import { useEffect, useState } from 'react';
import { useAlertStore, useUserStore } from '../../config/store';
import Alert from './common/Alert';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';

interface Comment {
  comment_id: number;
  user_id: number;
  comment: string;
  created_at: string;
}

interface FormData {
  comment: string;
}

const Comment = () => {
  const param = useParams();
  const [comments, setComments] = useState<Comment[] | undefined>(undefined);
  const { user } = useUserStore();
  const { setAlert } = useAlertStore();
  const { register, handleSubmit, reset } = useForm<FormData>();

  useEffect(() => {
    const post = PostsData.find((item) => {
      const id = Number(param.post_id);
      return item.post_id === id;
    });
    if (post) {
      setComments(post.comments);
    }
  }, []);

  const createComment: SubmitHandler<FormData> = async (data) => {
    if (user === null) {
      setAlert('로그인을 먼저 해주세요.');
      return;
    }

    try {
      // 서버에 댓글 생성 요청
      const response = await axios.post('/api/comments', {
        user_id: user.user_id,
        post_id: param.post_id,
        comment: data.comment,
      });
      // 서버에서 최신 댓글 리스트를 받아와서 상태 업데이트
      const updatedComments = response.data.comments;
      setComments(updatedComments);
      reset();
    } catch (error) {
      setAlert('댓글 작성에 실패했습니다.');
    }
  };

  const deleteComment = async (comment_id: number) => {
    // 유저 정보가 일치할 때만 버튼이 보이도록 했지만, 혹~시~나~ 한번 더 막아주기
    if (user?.user_id !== comment_id) {
      setAlert('댓글 작성자만 삭제할 수 있습니다.');
      return;
    }
    try {
      await axios.delete(`/api/comments/${comment_id}`, {
        data: { user_id: user?.user_id },
      });

      // 댓글 삭제 후 서버에서 최신 댓글 리스트를 받아와서 상태 업데이트
      const response = await axios.get(`/api/posts/${param.post_id}/comments`);
      const updatedComments = response.data.comments;
      setComments(updatedComments);
    } catch (error) {
      setAlert('댓글 삭제에 실패했습니다.');
    }
  };

  return (
    <div className='mx-auto min-w-[1052px] max-w-[1052px]'>
      <Alert></Alert>
      <div className='ml-2 text-[18px]'>
        {comments ? `${comments?.length}개의 댓글` : '0개의 댓글'}
      </div>
      <form onSubmit={handleSubmit(createComment)}>
        <textarea
          {...register('comment', { required: true })}
          name='comment'
          className='my-3 h-[108px] w-full resize-none rounded-[10px] border border-solid border-[#7e7e7e] bg-[#d9d9d9] bg-opacity-[33%] p-4 outline-none'
          placeholder='댓글을 작성해주세요'
        ></textarea>
        <input
          type='submit'
          value='댓글 작성'
          className='mb-5 ml-auto mr-2 block h-[34px] w-[96px] cursor-pointer rounded-[6px] bg-[#28466A] font-semibold text-white'
        />
      </form>
      {comments?.map((comment) => (
        <div key={comment.comment_id} className='border-b-[1px] p-2'>
          <div className='flex justify-between'>
            <div className='flex'>
              <div className='m-2 text-[16px] font-semibold'>
                {comment.user_id}
              </div>
              <div className='m-2 text-[#777777]'>{comment.created_at}</div>
            </div>
            {user?.user_id === comment.user_id ? (
              <button
                className='m-2 text-[13px] text-red-400'
                onClick={() => deleteComment(comment.comment_id)}
              >
                삭제
              </button>
            ) : null}
          </div>
          <div className='py-3'>{comment.comment}</div>
        </div>
      ))}
    </div>
  );
};

export default Comment;
