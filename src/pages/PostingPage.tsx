import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactQuill, { Quill } from 'react-quill';
import { useForm, SubmitHandler } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
import './PostingPage.css';
import TagItem from '../components/TagItem';
import { useTagStore, useUserStore, useAlertStore } from '../../config/store';
import ImageResize from 'quill-image-resize';
import Alert from '../components/common/Alert';
import axios from 'axios';
Quill.register('modules/ImageResize', ImageResize);

interface FormData {
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  content: string;
  tagValue: string;
  thumnail: FileList;
  [key: string]: string | FileList;
}

const PostingPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      location: '',
      startDate: '',
      endDate: '',
      content: '',
    },
  });
  const { tags, addTag } = useTagStore((state) => ({
    tags: state.tags,
    addTag: state.addTag,
  }));
  const user = useUserStore((state) => state.user);
  const setAlert = useAlertStore((state) => state.setAlert);
  const [travelPeriodError, setTravelPeriodError] = useState<string>('');
  const [imageIds, setImageIds] = useState<string[]>([]);
  const quillRef = useRef<ReactQuill>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setAlert('로그인이 필요한 페이지 입니다.');
      navigate('/login');
    }
  }, [user, navigate]);

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append('image', file);

        try {
          const response = await axios.post('/posts/images', formData);
          console.log(response);

          setImageIds((prev) => [...prev, response.data.imaages.id]);
          const imageUrl = response.data.images.image;
          console.log('업로드된 이미지 URL:', imageUrl);

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
      const dayDiff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24); // 일수로 변환

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
  }, [startDate, endDate, setValue]);

  //quill에디터로 작성한 내용
  const handleQuillChange = (content: string) => {
    setValue('content', content);
    console.log(content);
  };

  //태그입력하고 엔터쳤을 때
  const tagValue = watch('tagValue');
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (
        tagValue.trim() !== '' &&
        tags.length < 5 &&
        event.nativeEvent.isComposing === false //마지막글자남지않도록
      ) {
        addTag(tagValue);
        setValue('tagValue', '');
      }
    }
  };

  //서버에 보낼때
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log(data);
    const formData = new FormData();
    const temp_image_ids = imageIds.join(',');
    // const postData = {
    //   user_id: user?.user_id,
    //   title: data.title,
    //   tag: tags.map((tag) => tag.content).join(','),
    //   region: data.location,
    //   body: data.content,
    //   view_count: 0,
    //   travel_start_date: data.startDate,
    //   travel_end_date: data.endDate,
    //   temp_image_ids: temp_image_ids,
    // };

    formData.append('user_id', user?.user_id?.toString() || '');
    formData.append('title', data.title);
    formData.append('tag', tags.map((tag) => tag.content).join(','));
    formData.append('region', data.location);
    formData.append('body', data.content);
    formData.append('view_count', '0');
    formData.append('travel_start_date', data.startDate);
    formData.append('travel_end_date', data.endDate);
    formData.append('temp_image_ids', temp_image_ids);

    if (data.thumnail && data.thumnail.length > 0) {
      formData.append('thumbnail', data.thumnail[0]);
    }

    console.log('FormData contents:');
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await axios.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className='fixed left-0 top-0 z-10 w-screen bg-white'>
        <Alert></Alert>
        <Link to='/' className='flex items-center py-[20px] pl-[30px]'>
          <img src='/logo.svg' alt='한바퀴 로고' className='w-9' />
          <h1 className={'font-okgung text-2xl text-black'}>한바퀴</h1>
        </Link>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='relative mx-auto mt-24 w-full max-w-[1200px] px-4 sm:px-6 lg:px-8'>
          <div className='mb-4'>
            <select
              className={`cursor-pointer rounded-sm border px-2 py-1 text-sm text-[#7e7e7e] hover:bg-[#eeeeeec8] hover:text-[#5b5b5b] focus:outline-none ${errors.location && 'border-red-500'}`}
              id='location'
              {...register('location', { required: '지역을 선택해주세요.' })}
            >
              <option value='' disabled>
                지역을 선택해주세요
              </option>
              <option value='1'>서울</option>
              <option value='2'>경기도</option>
              <option value='3'>인천</option>
              <option value='4'>강원도</option>
              <option value='5'>경상북도</option>
              <option value='6'>경상남도</option>
              <option value='7'>대구</option>
              <option value='8'>울산</option>
              <option value='9'>부산</option>
              <option value='10'>충청북도</option>
              <option value='11'>충청남도</option>
              <option value='12'>세종</option>
              <option value='13'>대전</option>
              <option value='14'>전라북도</option>
              <option value='15'>전라남도</option>
              <option value='16'>광주</option>
              <option value='17'>제주도</option>
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
          <div className='mb-4 flex h-7'>
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
          <div>
            <input
              className='mb-4 text-sm'
              type='file'
              id='thumnail'
              {...register('thumnail')}
            />
          </div>
          <ReactQuill
            ref={quillRef}
            modules={modules}
            placeholder='당신의 여행 이야기를 들려주세요..'
            className={'quill-toolbar'}
            onChange={handleQuillChange}
          />
          <input type='hidden' {...register('content')} />
          <div className='sticky bottom-0 flex w-full justify-end gap-2 border-t border-[#cdcdcd] bg-white py-2'>
            <button className='rounded-lg border border-[#28466A] bg-white px-5 py-1 text-sm text-[#28466A] hover:bg-[#f3f7ff]'>
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
