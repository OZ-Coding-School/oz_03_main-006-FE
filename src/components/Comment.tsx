import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useAlertStore, useUserStore } from '../../config/store';
import Alert from './common/Alert';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from '../api/axios';

interface Comment {
  id: number;
  nickname: string;
  content: string;
  created_at: string;
  updated_at: string;
  post: number;
  user_id: number;
}

interface FormData {
  comment: string;
}

interface CommentProps {
  comments: Comment[];
}

const Comment: React.FC<CommentProps> = ({ comments: initialComments }) => {
  const param = useParams();
  const [comments, setComments] = useState<Comment[]>();
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
    setComments(initialComments);
  }, [param.post_id, initialComments]);

  const updateComments = async () => {
    try {
      const response = await axios.get(`/posts/${postId.current}/`);
      setComments(response.data.post.comments);
      resetCreateForm();
      resetEditForm();
    } catch (error) {
      console.error(error + '댓글 업데이트에 실패했습니다.');
      setAlert('댓글 업데이트에 실패했습니다.');
    }
  };

  const createComment: SubmitHandler<FormData> = async (data) => {
    if (user === null) {
      setAlert('로그인을 먼저 해주세요.');
      return;
    }
    try {
      await axios.post(
        `/posts/${postId.current}/comments/`,
        {
          user_id: 3,
          content: data.comment,
        },
        {
          withCredentials: true,
        }
      );
      updateComments();
    } catch (error) {
      console.error(error + '댓글 작성에 실패했습니다.');
      setAlert('댓글 작성에 실패했습니다.');
    }
  };

  const deleteComment = async (commentUserId: number, commentId: number) => {
    if (user?.user_id !== commentUserId) {
      setAlert('댓글 작성자만 삭제할 수 있습니다.');
      return;
    }
    try {
      await axios.delete(`/posts/comments/${commentId}/`, {
        data: {
          comment_pk: commentId,
        },
      });
      updateComments();
    } catch (error) {
      console.error(error + '댓글 삭제를 실패했습니다.');
      setAlert('댓글 삭제를 실패했습니다.');
    }
  };

  const startEditComment = (commentId: number, comment: string) => {
    setEditingCommentId(commentId);
    setEditValue('comment', comment);
  };

  const saveEditComment: SubmitHandler<FormData> = async (data) => {
    try {
      await axios.put(
        `/posts/comments/${editingCommentId}/`,
        {
          content: data.comment,
          user_id: user?.user_id,
        },
        {
          withCredentials: true,
        }
      );
      setEditingCommentId(null);
      updateComments();
    } catch (error) {
      console.error(error + '댓글 수정을 실패했습니다.');
      setAlert('댓글 수정을 실패했습니다.');
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
          className='mb-5 ml-auto mr-2 block h-[34px] w-[96px] cursor-pointer rounded-[6px] bg-[#28466A] font-semibold text-white hover:bg-[#1a2e46]'
        />
      </form>
      {comments?.map((comment) => (
        <div key={comment.id} className='border-b-[1px] p-2'>
          <div className='flex justify-between'>
            <div className='flex'>
              <div className='m-2 text-[16px] font-semibold'>
                {comment.nickname}
              </div>
              <div className='m-2 text-[#777777]'>{comment.created_at}</div>
            </div>
            {user?.user_id === comment.user_id && (
              <div>
                {editingCommentId === comment.id ? (
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
                        startEditComment(comment.id, comment.content)
                      }
                    >
                      수정
                    </button>
                    <button
                      className='m-2 text-[13px] text-red-400'
                      onClick={() => deleteComment(comment.user_id, comment.id)}
                    >
                      삭제
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
          {editingCommentId === comment.id ? (
            <form onSubmit={handleEditSubmit(saveEditComment)}>
              <textarea
                {...editRegister('comment')}
                className='h-[108px] w-full flex-grow resize-none border p-2'
              />
            </form>
          ) : (
            <div className='py-3'>{comment.content}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Comment;
