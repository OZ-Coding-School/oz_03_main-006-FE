import React, { useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import { useForm } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
import './PostingPage.css';
import { useTagStore } from '../../config/store';
import TagItem from '../components/TagItem';
import ImageResize from 'quill-image-resize';
Quill.register('modules/ImageResize', ImageResize);

const PostingPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();
  const { tags, addTag } = useTagStore((state) => ({
    tags: state.tags,
    addTag: state.addTag,
  }));

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

      clearErrors('startDate');
      clearErrors('endDate');

      if (start > end) {
        // setError('startDate', {
        //   type: 'manual',
        //   message: '출발일은 종료일보다 이전이어야 합니다.',
        // });
        setError('endDate', {
          type: 'manual',
          message: '*종료일은 시작일보다 이후이어야 합니다*',
        });
        // setValue('endDate', '');
      } else if (dayDiff < 5) {
        setError('endDate', {
          type: 'manual',
          message: '*여행 기간은 5일 이상이어야 합니다*',
        });
      }
    };
    checkDateValidity();
  }, [startDate, endDate, setError, clearErrors]);

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
        event.nativeEvent.isComposing === false
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='mx-auto my-20 w-screen max-w-[1200px] px-20'>
        <div className='my-4'>
          <select
            className='cursor-pointer rounded-sm border px-2 py-1 text-sm text-[#7e7e7e] hover:bg-[#eeeeeec8] hover:text-[#5b5b5b] focus:outline-none'
            id='location'
            {...register('location', { required: true })}
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
            {...register('title', { required: true })}
          ></textarea>
        </div>
        <div className='my-4 flex'>
          {tags.map((tag, index) => (
            <TagItem tagContent={tag} key={index} showDeleteButton={false} />
          ))}
          <input
            className='focus:outline-none'
            type='text'
            id='tag'
            placeholder='태그를 입력하세요'
            onKeyDown={handleKeyDown}
            {...register('tagValue')}
          />
        </div>
        <div className='mb-1 mt-4 flex'>
          <p className='mr-8 flex items-center justify-center text-[#000000]'>
            여행 시작일
          </p>
          <input
            className='cursor-pointer text-sm focus:outline-none'
            type='date'
            id='start-date'
            {...register('startDate', { required: true })}
          />
          {errors.startDate && (
            <p className='my-auto ml-5 text-xs text-[#f85c5c]'>
              {errors.startDate.message}
            </p>
          )}
        </div>
        <div className='mb-2 mt-1 flex'>
          <p className='mr-8 flex items-center justify-center text-[#000000]'>
            여행 종료일
          </p>
          <input
            className='cursor-pointer text-sm focus:outline-none'
            type='date'
            id='end-date'
            {...register('endDate', { required: true })}
          />
          {errors.endDate && (
            <p className='my-auto ml-5 text-xs text-[#f85c5c]'>
              {errors.endDate.message}
            </p>
          )}
        </div>
        <div className='mb-5 ml-1 text-xs text-[#f85c5c]'>
          {/* *여행기간은 5일 이상만 가능합니다* */}
        </div>
        <ReactQuill
          modules={modules}
          placeholder='당신의 여행 이야기를 들려주세요..'
          className='quill-toolbar'
          onChange={handleQuillChange}
        />
        <input type='hidden' {...register('content', { required: true })} />
        <button type='submit'>제출</button>
      </div>
    </form>
  );
};

export default PostingPage;
