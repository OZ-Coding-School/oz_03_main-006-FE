import React, { useRef, useState } from 'react'
import { FaCamera } from 'react-icons/fa';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    updateProfileImage: (imageUrl: string) => void;
}

const ProfileImage: React.FC<FileUploadProps> = ({onFileSelect, updateProfileImage}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profileImg, setProfileImg] = useState<string | null>(null)

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(file) {
            onFileSelect(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImg(reader.result as string);
            }
            reader.readAsDataURL(file)
        }
        
    }
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
                        <FaCamera className='text-gray-400 text-3xl'/>
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
            <button onClick={handleChange} className='bg-black bg-opacity-50 rounded-sm mt-1 ml-1 w-full'>
                이미지 업로드
            </button>
        </div>
    </>
  )
}

export default ProfileImage