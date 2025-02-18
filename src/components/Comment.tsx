import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
  useAlertStore,
  useConfirmAlertStore,
  useUserStore,
} from '../../config/store';
import { MyPageConfirmAlert } from './common/Alert';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from '../api/axios';
import { FaRegUser } from 'react-icons/fa';
import Pagination from 'react-js-pagination';
import { RxDoubleArrowRight, RxDoubleArrowLeft } from 'react-icons/rx';

interface Comment {
  id: number;
  nickname: string;
  content: string;
  created_at: string;
  updated_at: string;
  post: number;
  user_id: number;
  profile_image: string | null;
}

interface FormData {
  comment: string;
}

interface CommentProps {
  comments: Comment[];
}

const Comment: React.FC<CommentProps> = ({ comments: initialComments }) => {
  const param = useParams();
  const [comments, setComments] = useState<Comment[]>([]);
  const { user } = useUserStore();
  const setAlert = useAlertStore((state) => state.setAlert);
  const { showConfirmAlert, setConfirmAlert } = useConfirmAlertStore();
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const commentsPerPage = 10;
  const [deleteState, setDeleteState] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    postId.current = Number(param.post_id);
    setComments(
      initialComments.sort(
        (a, b) =>
          new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
      )
    );
    setCurrentPage(1);
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

    if (!isLoading) {
      try {
        setIsLoading(true);
        await axios.post(
          `/posts/${postId.current}/comments/`,
          {
            user_id: user.id,
            content: data.comment,
          },
          {
            withCredentials: true,
          }
        );
        await updateComments();
        setIsLoading(false);
      } catch (error) {
        console.error(error + '댓글 작성에 실패했습니다.');
        setAlert('댓글 작성에 실패했습니다.');
      }
    }
  };

  const deleteComment = async (commentUserId: number, commentId: number) => {
    if (user?.id !== commentUserId) {
      setAlert('댓글 작성자만 삭제할 수 있습니다.');
      return;
    }
    setDeleteState(true);
    setConfirmAlert('정말 댓글을 삭제 하시겠습니까?').then(async (res) => {
      if (res) {
        try {
          await axios.delete(`/posts/comments/${commentId}/`, {
            data: {
              comment_pk: commentId,
            },
          });
          await updateComments();
          setDeleteState(false);
        } catch (error) {
          console.error(error + '댓글 삭제를 실패했습니다.');
          setAlert('댓글 삭제를 실패했습니다.');
        }
      }
    });
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
          user_id: user?.id,
        },
        {
          withCredentials: true,
        }
      );
      setEditingCommentId(null);
      await updateComments();
    } catch (error) {
      console.error(error + '댓글 수정을 실패했습니다.');
      setAlert('댓글 수정을 실패했습니다.');
    }
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = comments.slice(
    indexOfFirstComment,
    indexOfLastComment
  );

  return (
    <div className='mx-auto min-w-[1052px] max-w-[1052px]'>
      {deleteState ? showConfirmAlert && <MyPageConfirmAlert /> : <></>}
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
      <div className='pb-10'>
        {currentComments.map((comment) => (
          <div key={comment.id} className='border-b-[1px] p-2 last:border-none'>
            <div className='flex justify-between'>
              <div className='flex items-center'>
                {comment.profile_image === null ? (
                  <div className='flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#28466A]'>
                    <FaRegUser className='light-white'></FaRegUser>
                  </div>
                ) : (
                  <img
                    className='h-[30px] w-[30px] rounded-full'
                    src={`${comment.profile_image}`}
                  ></img>
                )}
                <div className='m-2 text-[16px] font-semibold'>
                  {comment.nickname}
                </div>
                <div className='m-2 text-[#777777]'>
                  {comment.created_at.substring(0, 10)}
                </div>
              </div>
              {user?.id === comment.user_id && (
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
                        onClick={() =>
                          deleteComment(comment.user_id, comment.id)
                        }
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
                  className='h-[108px] w-full flex-grow resize-none border p-2 outline-none'
                />
              </form>
            ) : (
              <p className='whitespace-pre-wrap py-3'>{comment.content}</p>
            )}
          </div>
        ))}
        {comments.length === 0 ? (
          ''
        ) : (
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={commentsPerPage}
            totalItemsCount={comments.length}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
            itemClass='pagination-item'
            linkClass='pagination-link'
            activeClass='active'
            activeLinkClass=''
            firstPageText={<RxDoubleArrowLeft />}
            lastPageText={<RxDoubleArrowRight />}
            itemClassFirst='pagination-nav'
            itemClassLast='pagination-nav'
            itemClassPrev='pagination-nav'
            itemClassNext='pagination-nav'
            disabledClass='disabled'
          />
        )}
      </div>
    </div>
  );
};

export default Comment;
