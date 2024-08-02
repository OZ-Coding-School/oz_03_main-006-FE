import React, { useRef, useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import ProfileModal from './ProfileModal';

interface FileUploadProps {
  setImg: React.Dispatch<React.SetStateAction<string>>;
  onFileSelect: (file: File) => string;
  img?: string | null;
  setImgFile: React.Dispatch<React.SetStateAction<File | undefined>>;
}

const ProfileImage: React.FC<FileUploadProps> = ({ img, setImgFile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        console.log(croppedImage);
        setIsModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCroppedImage = (imageFile: File) => {
    setImgFile(imageFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCroppedImage(reader.result as string);
      // setImg(reader.result as string);
    };
    // 이미지 데이터를 Base64로 인코딩한 문자열
    reader.readAsDataURL(imageFile);
    setIsModalOpen(false);
  };
  const handleChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  return (
    <>
      <div className='relative size-28 rounded-full bg-gray-200'>
        <div className='flex h-full w-full items-center justify-center'>
          {img ? (
            <img
              src={img}
              alt='프로필 이미지'
              className='h-full w-full rounded-full object-cover text-3xl'
            />
          ) : (
            <FaCamera className='text-3xl text-gray-400' />
          )}
        </div>
        <input
          type='file'
          ref={fileInputRef}
          onChange={handleFileInput}
          accept='image/*'
          className='hidden'
        />
        <button
          onClick={handleChange}
          className='absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 text-white opacity-50 transition-opacity duration-200 hover:opacity-100'
        >
          프로필 사진 수정
        </button>
        {isModalOpen && preview && (
          <ProfileModal
            preview={preview}
            onClose={() => setIsModalOpen(false)}
            onCrop={handleCroppedImage}
          />
        )}
      </div>
    </>
  );
};

export default ProfileImage;
