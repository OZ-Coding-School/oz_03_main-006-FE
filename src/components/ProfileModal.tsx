import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
  convertToPixelCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ModalProps {
  preview: string;
  onClose: () => void;
  onCrop: (file: File) => void;
}

const ProfileModal: React.FC<ModalProps> = ({ preview, onClose, onCrop }) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      const crop = centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 90,
          },
          1,
          width,
          height
        ),
        width,
        height
      );
      setCrop(crop);
      setCompletedCrop(convertToPixelCrop(crop, width, height));
    },
    []
  );

  const getCroppedImg = (
    image: HTMLImageElement,
    crop: PixelCrop
  ): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d')!;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), 'image/jpeg');
    });
  };

  const handleUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (imgRef.current && completedCrop) {
      const croppedImageBlob = await getCroppedImg(
        imgRef.current,
        completedCrop
      );
      const croppedImageFile = new File(
        [croppedImageBlob],
        'cropped-image.jpg',
        { type: 'image/jpeg' }
      );

      onCrop(croppedImageFile);
      onClose();
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-xl'>
        <h2 className='mb-4 text-xl font-bold'>이미지 자르기</h2>
        <div className='mb-4 w-full'>
          <ReactCrop
            crop={crop}
            onChange={(c, percentCrop) => {
              setCrop(percentCrop);
              setCompletedCrop(c);
            }}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
            circularCrop
          >
            <img
              ref={imgRef}
              src={preview}
              alt='Preview'
              onLoad={onImageLoad}
              className='max-w-full'
            />
          </ReactCrop>
        </div>
        <div className='flex justify-end space-x-2'>
          <button
            onClick={onClose}
            className='rounded bg-gray-300 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-400'
          >
            취소
          </button>
          <button
            onClick={handleUpload}
            className='rounded bg-[#28466A] px-4 py-2 text-white transition-colors hover:bg-[#1b2f48]'
          >
            적용
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
