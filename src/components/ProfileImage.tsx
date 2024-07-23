import React, { useRef, useState } from 'react'
import { FaCamera } from 'react-icons/fa';

interface FileUploadProps {
    // onFileSelect: (file: File) => void;
    updateProfileImage: (imageUrl: string) => void;
    profile_img: (string)
}

const ProfileImage: React.FC<FileUploadProps> = ({ profile_img, updateProfileImage}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profileImg, setProfileImg] = useState<string | null>(null)

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // 파일 객체를 받아서 그 파일을 브라우저에서 바로 사용할 수 있는 URL로 변환하는 역할 -> 미리보기
            const imageUrl = URL.createObjectURL(file);
            setProfileImg(imageUrl);
            updateProfileImage(imageUrl);
            console.log(imageUrl);
        }
    };

    console.log(profileImg)

    const handleChange = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        fileInputRef.current?.click()
    }

  return (
    <>
        <div className='relative w-32 h-32 rounded-full rounded-full bg-gray-200'>
            {
                profileImg ? (
                    // object-cover : 가로세로 비율 유지 및 컨테이너 채우기, 잘림, 중앙정렬
                    <img src={profileImg} alt='프로필 이미지' className='w-full h-full object-cover rounded-full'/>
                ) : (
                    <div className='flex items-center justify-center w-full h-full' >
                        {/* <FaCamera className='text-gray-400 text-3xl'/> */}
                        {
                            profile_img ? (
                                <img src={profile_img} alt='프로필 이미지' className='text-3xl w-full h-full object-cover rounded-full'/>
                            ) : (
                                <FaCamera className='text-gray-400 text-3xl'/> 
                            )
                        }
                    </div>
                )
            }
            <input 
                type='file'
                ref={fileInputRef}
                onChange={handleFileInput}
                accept='image/*'
                className='hidden'
            />
            <button onClick={handleChange} className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-50 hover:opacity-100 rounded-full transition-opacity duration-200'>
                프로필 사진 수정
            </button>
        </div>
    </>
  )
}

export default ProfileImage