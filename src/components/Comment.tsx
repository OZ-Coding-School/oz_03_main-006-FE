import { useParams } from 'react-router-dom';
import PostsData from '../data/posts.json';
import { useEffect, useRef, useState } from 'react';
import { useAlertStore, useUserStore } from '../../config/store';
import Alert from './common/Alert';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';

// 스웨거 보고 응답형태로 변환 필요.
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
  const {
    register: createRegister,
    handleSubmit: handleCreateSubmit,
    reset: resetCreateForm,
  } = useForm<FormData>();
  const {
    register: editRegister,
    handleSubmit: handleEditSubmit,
    reset: resetEditForm,
    setValue: setEditValue,
  } = useForm<FormData>();
  const postId = useRef<number | undefined>();
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

  useEffect(() => {
    postId.current = Number(param.post_id);
    const post = PostsData.find((item) => {
      return item.post_id === postId.current;
    });
    if (post) {
      setComments(post.comments);
    }
  }, [param.post_id]);

  const updateComments = async () => {
    try {
      const response = await axios.get(`/posts/${postId.current}`);
      setComments(response.data.comments);
      resetCreateForm();
      resetEditForm();
    } catch (error) {
      setAlert('댓글 업데이트에 실패했습니다.');
    }
  };

  const createComment: SubmitHandler<FormData> = async (data) => {
    if (user === null) {
      setAlert('로그인을 먼저 해주세요.');
      return;
    }
    try {
      await axios.post(`/posts/${postId.current}/comments`, {
        user_id: user.user_id,
        content: data.comment,
      });
      updateComments();
    } catch (error) {
      setAlert('댓글 작성에 실패했습니다.');
    }
  };

  const deleteComment = async (comment_id: number) => {
    if (user?.user_id !== comment_id) {
      setAlert('댓글 작성자만 삭제할 수 있습니다.');
      return;
    }
    try {
      // delete에 body..?
      await axios.delete(`/posts/comments/${comment_id}`, {
        data: {
          user_id: user.user_id,
        },
      });
      updateComments();
    } catch (error) {
      setAlert('댓글 삭제에 실패했습니다.');
    }
  };

  const startEditComment = (comment_id: number, comment: string) => {
    setEditingCommentId(comment_id);
    setEditValue('comment', comment);
  };

  const saveEditComment: SubmitHandler<FormData> = async (data) => {
    try {
      await axios.put(`/posts/comments/${editingCommentId}`, {
        content: data.comment,
        user_id: user?.user_id,
      });
      setEditingCommentId(null);
      updateComments();
    } catch (error) {
      setAlert('댓글 수정에 실패했습니다.');
    }
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
  };

  return (
    <div className='mx-auto min-w-[1052px] max-w-[1052px]'>
      <Alert />
      <div className='ml-2 text-[18px]'>
        {comments ? `${comments?.length}개의 댓글` : '0개의 댓글'}
      </div>
      <form onSubmit={handleCreateSubmit(createComment)}>
        <textarea
          {...createRegister('comment', { required: true })}
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
            {user?.user_id === comment.user_id && (
              <div>
                {editingCommentId === comment.comment_id ? (
                  <>
                    <button
                      className='m-2 text-[13px] text-blue-400'
                      onClick={handleEditSubmit(saveEditComment)}
                    >
                      저장
                    </button>
                    <button
                      className='m-2 text-[13px] text-red-400'
                      onClick={cancelEditComment}
                    >
                      취소
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className='m-2 text-[13px] text-blue-400'
                      onClick={() =>
                        startEditComment(comment.comment_id, comment.comment)
                      }
                    >
                      수정
                    </button>
                    <button
                      className='m-2 text-[13px] text-red-400'
                      onClick={() => deleteComment(comment.comment_id)}
                    >
                      삭제
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
          {editingCommentId === comment.comment_id ? (
            <form onSubmit={handleEditSubmit(saveEditComment)}>
              <textarea
                {...editRegister('comment')}
                className='h-[108px] w-full flex-grow resize-none border p-2'
              />
            </form>
          ) : (
            <div className='py-3'>{comment.comment}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Comment;
