import { useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import { useForm } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
import './PostingPage.css';
import ImageResize from 'quill-image-resize';
Quill.register('modules/ImageResize', ImageResize);

const PostingPage = () => {
  const { register, handleSubmit, watch, setValue } = useForm();

  //에디터 모듈
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
        [
          {
            color: [],
          },
          { background: [] },
        ],
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

  //여행기간 유효성 검사
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  useEffect(() => {
    const checkDateValidity = () => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const dayDiff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24); //일수로변환
      if (start >= end) {
        alert('날짜를 확인해주세요');
        setValue('startDate', '');
        setValue('endDate', '');
      } else {
        if (dayDiff < 6) {
          alert('5일 이상의 일정만 가능합니다.');
          setValue('endDate', '');
        }
      }
    };
    checkDateValidity();
  }, [startDate, endDate]);

  //서버에 보낼때
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='mx-auto my-20 w-screen max-w-[1200px] px-20'>
        <div className='my-4'>
          <select
            className='rounded-sm border px-2 py-1 text-sm text-[#7e7e7e] hover:bg-[#eeeeeec8] hover:text-[#5b5b5b] focus:outline-none'
            id='loaction'
            {...register('location', { required: true })}
          >
            <option value='defualt'>지역을 선택해주세요</option>
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
            className='mt-3 h-auto w-full resize-none overflow-hidden text-3xl focus:outline-none'
            placeholder='제목을 입력하세요'
            rows={1}
            id='title'
            {...register('title', { required: true })}
          ></textarea>
        </div>
        <div className='my-4 flex'>
          <input
            className='focus:outline-none'
            type='text'
            id='tag'
            placeholder='태그를 입력하세요'
            {...register('tag')}
          />
        </div>
        <div className='mb-1 mt-4 flex'>
          <p className='mr-7 flex items-center justify-center text-[#646464]'>
            여행 시작일
          </p>
          <input
            className='text-sm focus:outline-none'
            type='date'
            id='start-date'
            {...register('startDate', { required: true })}
          />
        </div>
        <div className='mb-2 mt-1 flex'>
          <p className='mr-7 flex items-center justify-center text-[#646464]'>
            여행 종료일
          </p>
          <input
            className='text-sm focus:outline-none'
            type='date'
            id='end-date'
            {...register('endDate', { required: true })}
          />
        </div>
        {/* <div className='mb-2 mt-1 flex'></div> */}
        {/* <div className='mb-5 ml-1 text-xs text-[#f85c5c]'>
          *여행기간은 5일이상만 가능합니다*
        </div> */}
        <ReactQuill
          modules={modules}
          placeholder='당신의 여행 이야기를 들려주세요..'
          className='quill-toolbar'
        />
        <button type='submit'>제출</button>
      </div>
    </form>
  );
};

export default PostingPage;
