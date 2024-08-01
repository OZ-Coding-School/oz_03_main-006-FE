import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactQuill, { Quill } from 'react-quill';
import { useForm, SubmitHandler } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
import './PostingPage.css';
import TagItem from '../components/TagItem';
import { useTagStore, useUserStore, useAlertStore } from '../../config/store';
import { PostingFormData, PostResponse } from '../../config/types';
import { FaPlus } from 'react-icons/fa6';
import { locationList } from '../data/locationList';
import axios, { AxiosResponse } from 'axios';
import ImageResize from 'quill-image-resize';
import Alert, { MyPageConfirmAlert } from '../components/common/Alert';
import Error from '../components/common/Error';
Quill.register('modules/ImageResize', ImageResize);

const PostingPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PostingFormData>({
    defaultValues: {
      title: '',
      location: '',
      startDate: '',
      endDate: '',
      content: '',
      thumbnail: undefined,
    },
  });

  const { tags, addTag, clearTags } = useTagStore((state) => ({
    tags: state.tags,
    addTag: state.addTag,
    clearTags: state.clearTags,
  }));
  const user = useUserStore((state) => state.user);
  const setAlert = useAlertStore((state) => state.setAlert);
  const showConfirmAlert = useAlertStore((state) => state.showConfirmAlert);
  const [travelPeriodError, setTravelPeriodError] = useState<string>('');
  const [imageIds, setImageIds] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [viewCount, setViewCount] = useState<number>(0);
  const [quillContent, setQuillContent] = useState('');
  const [deleteState, setDeleteState] = useState<boolean>(false);
  const quillRef = useRef<ReactQuill>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { post_id } = useParams();

  const isEditMode = post_id ? true : false;
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!user) {
      setAlert('로그인이 필요한 페이지 입니다.');
      navigate('/login');
    }
  }, [user]);

  useEffect(() => {
    clearTags();
    if (isEditMode) {
      const fetchPostData = async () => {
        try {
          const response = await axios.get(
            `https://api.hancycle.site/posts/${post_id}/`
          );
          const postData = response.data.post;
          setViewCount(postData.view_count);

          setValue('title', postData.title);
          setValue('location', postData.location);
          setValue('startDate', postData.travel_start_date);
          setValue('endDate', postData.travel_end_date);
          setQuillContent(postData.body);
          setValue('content', postData.body);

          const tagArray = postData.tag
            .split(',')
            .map((tag: string) => tag.trim())
            .filter((tag: string) => tag !== '');

          tagArray.forEach((tag: string) => {
            addTag(tag);
          });

          if (postData.thumbnail) {
            setFileName(postData.thumbnail.split('/').pop());
          }

          setImageIds(postData.image_ids || []);
        } catch (error) {
          console.error('기존 글 데이터를 불러오는데 실패했습니다:', error);
        }
      };
      fetchPostData();
    }
  }, [post_id]);

  //이미지 올리기1
  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append('images', file);

        try {
          const response = await axios.post(
            'https://api.hancycle.site/posts/upload_image/',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );

          setImageIds((prev) => [...prev, response.data.images[0].id]);
          const imageUrl = response.data.images[0].image;

          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'image', imageUrl);
          }
        } catch (error) {
          console.error('이미지 업로드 실패:', error);
        }
      }
    };
  }, []);

  // 에디터 모듈 설정
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ align: [] }],
        [
          { list: 'ordered' },
          { list: 'bullet' },
          { indent: '-1' },
          { indent: '+1' },
        ],
        [{ color: [] }, { background: [] }],
        ['image'],
      ],
      handlers: {
        image: imageHandler,
      },
    },
    ImageResize: {
      parchment: Quill.import('parchment'),
    },
  };

  // 제목 textarea 길이가 내용에 맞춰서 높이 조절되도록
  const titleValue = watch('title');
  useEffect(() => {
    const textarea = document.querySelector<HTMLTextAreaElement>(
      "textarea[name='title']"
    );
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [titleValue]);

  // 여행기간 유효성 검사
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  useEffect(() => {
    const checkDateValidity = () => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const dayDiff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

      if (startDate && endDate) {
        if (start > end) {
          setTravelPeriodError('*종료일은 시작일보다 이후이어야 합니다*');
          if (endDate !== null) setValue('endDate', '');
          return;
        }
        if (dayDiff < 5) {
          setTravelPeriodError('*여행 기간은 5일 이상이어야 합니다*');
          if (endDate !== null) setValue('endDate', '');
          return;
        }
        setTravelPeriodError('');
      }
    };
    checkDateValidity();
  }, [startDate, endDate]);

  //quill에디터로 작성한 내용
  const handleQuillChange = (content: string) => {
    content === '<p><br></p>'
      ? setValue('content', '')
      : setValue('content', content);
    setQuillContent(content);
  };

  //태그입력하고 엔터쳤을 때
  const tagValue = watch('tagValue');
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (
        tagValue.trim() !== '' &&
        tags.length < 5 &&
        event.nativeEvent.isComposing === false
      ) {
        addTag(tagValue);
        setValue('tagValue', '');
      }
    }
  };

  //서버에 보낼때
  const onSubmit: SubmitHandler<PostingFormData> = async (data) => {
    const formData = new FormData();
    const temp_image_ids = imageIds.join(',');

    formData.append('user_id', user?.id?.toString() || '');
    formData.append('title', data.title);
    formData.append('tag', tags.map((tag) => tag.content).join(','));
    formData.append('body', data.content);
    formData.append('travel_start_date', data.startDate);
    formData.append('travel_end_date', data.endDate);
    formData.append('temp_image_ids', temp_image_ids);

    try {
      let response: AxiosResponse<PostResponse>;
      if (isEditMode) {
        const matchLocId = matchLocationId(data.location);
        formData.append('location', matchLocId.toString());
        formData.append('view_count', viewCount.toString());
        if (data.thumbnail && data.thumbnail.length > 0) {
          formData.append('thumbnail', data.thumbnail[0]);
        }
        if (watch('thumbnail') === null) {
          formData.append('thumbnail', '');
        }
        response = await axios.put(
          `https://api.hancycle.site/posts/${post_id}/`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
          }
        );
        if (response.status === 400) {
          setAlert('글 수정에 실패했습니다.');
        } else if (response.status === 404) {
          <Error status={404} />;
        }
        navigate(`/post-detail/${post_id}`);
      } else {
        formData.append('view_count', '0');
        formData.append('location', data.location);
        if (data.thumbnail && data.thumbnail.length > 0) {
          formData.append('thumbnail', data.thumbnail[0]);
        } else {
          formData.append('thumbnail', '');
        }
        response = await axios.post(
          'https://api.hancycle.site/posts/',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
          }
        );
        if (response.status === 200 || response.status === 201) {
          navigate(`/post-detail/${response.data.id}`);
        } else {
          setAlert('글 등록에 실패하였습니다. 다시 시도해 주세요.');
          navigate('/');
        }
      }
    } catch (error) {
      console.error(error);
      <Error status={500} />;
    }
  };

  const matchLocationId = (value: string) => {
    const location = locationList.find((loc) => loc.city === value);
    return location ? location.location_id : 0;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.currentTarget.files;
    if (fileList) {
      setValue('thumbnail', fileList);
      setFileName(fileList[0].name);
    }
  };

  const handleRemoveFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setValue('thumbnail', null);
    setFileName(null);
  };

  const handleClick = () => {
    setDeleteState(true);
    showConfirmAlert('정말 작성을 취소하고 돌아가시겠습니까?').then((res) => {
      if (res === true) {
        navigate(-1);
      }
    });
  };

  return (
    <>
      <div className='fixed left-0 top-0 z-10 w-screen bg-white'>
        <Alert></Alert>
        {deleteState ? <MyPageConfirmAlert></MyPageConfirmAlert> : <></>}
        <Link to='/' className='flex items-center py-[20px] pl-[30px]'>
          <img src='/logo.svg' alt='한바퀴 로고' className='w-9' />
          <h1 className={'font-okgung text-2xl text-black'}>한바퀴</h1>
        </Link>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='relative mx-auto mt-24 w-full max-w-[1200px] px-4 sm:px-6 lg:px-8'>
          <div className='mb-4'>
            <select
              className={`cursor-pointer rounded-sm border px-2 py-1 text-sm text-[#9f9f9f] hover:bg-[#eeeeeec8] hover:text-[#5b5b5b] focus:outline-none ${errors.location && 'border-red-500'}`}
              id='location'
              {...register('location', { required: '지역을 선택해주세요.' })}
            >
              <option value='' disabled>
                지역을 선택해주세요
              </option>
              {locationList.map((location) => (
                <option
                  key={location.location_id}
                  value={location.location_id}
                  selected={location.city === watch('location')}
                >
                  {location.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <textarea
              className={`my-3 h-auto w-full resize-none overflow-hidden text-3xl focus:outline-none ${errors.title && 'placeholder:text-red-500'}`}
              placeholder='제목을 입력하세요'
              rows={1}
              id='title'
              {...register('title', { required: '제목을 입력히주세요.' })}
            ></textarea>
          </div>
          <div className='mb-4 flex h-auto min-h-7 flex-wrap'>
            {tags.map((tag, index) => (
              <React.Fragment key={index}>
                <TagItem tagContent={tag} showDeleteButton={true} />
                <input
                  type='hidden'
                  {...register(`tag${index}`)}
                  value={tag.content}
                />
              </React.Fragment>
            ))}
            {tags.length < 5 && (
              <input
                className='focus:outline-none'
                type='text'
                id='tag'
                autoComplete='off'
                placeholder='태그를 입력하세요'
                onKeyDown={handleKeyDown}
                {...register('tagValue')}
              />
            )}
          </div>
          <div className='mb-1 mt-4 flex'>
            <p className='mr-8 flex items-center justify-center text-[#000000]'>
              여행 시작일
            </p>
            <input
              className='cursor-pointer text-sm focus:outline-none'
              type='date'
              id='start-date'
              {...register('startDate', {
                required: '여행 시작일을 선택해주세요.',
              })}
              max={today}
            />
          </div>
          <div className='mb-5 mt-1 flex'>
            <p className='mr-8 flex items-center justify-center text-[#000000]'>
              여행 종료일
            </p>
            <input
              className='cursor-pointer text-sm focus:outline-none'
              type='date'
              id='end-date'
              {...register('endDate', {
                required: '여행 종료일을 선택해주세요.',
              })}
              max={today}
            />
            {(errors.startDate || errors.endDate) && (
              <p className='my-auto ml-5 text-xs text-red-500'>
                *여행기간을 지정해주세요*
              </p>
            )}
            <p className='my-auto ml-5 text-xs text-red-500'>
              {travelPeriodError}
            </p>
          </div>
          <div className='mb-3 mt-1 flex'>
            <input
              className='hidden'
              type='file'
              id='thumbnail'
              {...register('thumnail')}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <label
              htmlFor='thumbnail'
              className='mr-4 flex cursor-pointer gap-2 border border-slate-200 bg-[#f8f8f8bb] px-3 py-2 text-xs text-[#9f9f9f] hover:border-slate-300 hover:bg-[#f4f4f4a6]'
            >
              <FaPlus className='my-auto size-3' />
              대표이미지
            </label>
            {fileName && (
              <>
                <p className='my-auto text-xs text-[#656565]'>{fileName}</p>
                <button
                  type='button'
                  className='my-auto ml-4 cursor-pointer text-xs text-gray-700 underline'
                  onClick={handleRemoveFile}
                >
                  제거
                </button>
              </>
            )}
          </div>
          <ReactQuill
            ref={quillRef}
            modules={modules}
            placeholder='당신의 여행 이야기를 들려주세요..'
            className={'quill-toolbar'}
            onChange={handleQuillChange}
            value={quillContent}
          />
          <input type='hidden' {...register('content')} />
          <div className='sticky bottom-0 flex w-full justify-end gap-2 border-t border-[#cdcdcd] bg-white py-2'>
            <button
              className='rounded-lg border border-[#28466A] bg-white px-5 py-1 text-sm text-[#28466A] hover:bg-[#f9fbff]'
              type='button'
              onClick={handleClick}
            >
              취소
            </button>
            <button
              className='rounded-lg bg-[#28466A] px-5 py-1 text-sm text-white hover:bg-[#1a2e46]'
              type='submit'
            >
              발행
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default PostingPage;
