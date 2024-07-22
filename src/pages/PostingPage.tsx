import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactQuill, { Quill } from 'react-quill';
import { useForm } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
import './PostingPage.css';
import { useTagStore } from '../../config/store';
import TagItem from '../components/TagItem';
import ImageResize from 'quill-image-resize';
Quill.register('modules/ImageResize', ImageResize);

const PostingPage = () => {
  const { register, handleSubmit, watch, setValue } = useForm();
  const { tags, addTag } = useTagStore((state) => ({
    tags: state.tags,
    addTag: state.addTag,
  }));
  const [travelPeriodError, setTravelPeriodError] = useState('');

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

      // clearErrors('endDate');
      // setTravelPeriodError('');
      if (startDate && endDate) {
        if (start > end) {
          setTravelPeriodError('*종료일은 시작일보다 이후이어야 합니다*');
          if (endDate !== null) {
            setValue('endDate', null);
          }
          // setError('endDate', {
          //   type: 'manual',
          //   message: '*종료일은 시작일보다 이후이어야 합니다*',
          // });
          return;
        }
        if (dayDiff < 5) {
          setTravelPeriodError('*여행 기간은 5일 이상이어야 합니다*');
          if (endDate !== null) {
            setValue('endDate', null);
          }
          return;
        }
        // setError('endDate', {
        //   type: 'manual',
        //   message: '*여행 기간은 5일 이상이어야 합니다*',
        // });
        setTravelPeriodError(''); // 유효성 검사 통과 시 오류 메시지 초기화
      }
    };
    checkDateValidity();
  }, [startDate, endDate]);

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
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <>
      <div className='fixed left-0 top-0 z-10 w-screen bg-white'>
        <Link to='/' className='flex items-center py-[20px] pl-[30px]'>
          <img src='/logo.svg' alt='한바퀴 로고' className='w-9' />
          <h1 className={'font-okgung text-2xl text-black'}>한바퀴</h1>
        </Link>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='relative mx-auto mt-24 w-full max-w-[1200px] px-4 sm:px-6 lg:px-8'>
          <div className='mb-4'>
            <select
              className='cursor-pointer rounded-sm border px-2 py-1 text-sm text-[#7e7e7e] hover:bg-[#eeeeeec8] hover:text-[#5b5b5b] focus:outline-none'
              id='location'
              {...register('location', { required: '지역을 선택해주세요.' })}
            >
              <option value='default'>지역을 선택해주세요</option>
              <option value='서울'>서울</option>
              <option value='경기도'>경기도</option>
              <option value='인천'>인천</option>
              <option value='강원도'>강원도</option>
              <option value='경상북도'>경상북도</option>
              <option value='경상남도'>경상남도</option>
              <option value='대구'>대구</option>
              <option value='울산'>울산</option>
              <option value='부산'>부산</option>
              <option value='충청북도'>충청북도</option>
              <option value='충청남도'>충청남도</option>
              <option value='세종'>세종</option>
              <option value='대전'>대전</option>
              <option value='전라북도'>전라북도</option>
              <option value='전라남도'>전라남도</option>
              <option value='광주'>광주</option>
              <option value='제주도'>제주도</option>
            </select>
          </div>
          <div>
            <textarea
              className='my-3 h-auto w-full resize-none overflow-hidden text-3xl focus:outline-none'
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
            <p className='my-auto ml-5 text-xs text-red-500'>
              {travelPeriodError}
            </p>
            {/* {errors.endDate && (
            <p className='my-auto ml-5 text-xs text-[#f85c5c]'>
              {errors.endDate.message}
            </p>
          )} */}
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
            modules={modules}
            placeholder='당신의 여행 이야기를 들려주세요..'
            className='quill-toolbar'
            onChange={handleQuillChange}
          />
          <input
            type='hidden'
            {...register('content', {
              required: '내용을 입력해주세요.',
              minLength: {
                value: 200,
                message: '내용은 최소 200자 이상이어야 합니다.',
              },
            })}
          />
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
