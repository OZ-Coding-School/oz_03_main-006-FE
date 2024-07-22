import { Link, useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FaUserEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import userData from '../data/user.json'
import { useUserStore } from "../../config/store";
import ProfileImage from "../components/ProfileImage";



const MyPage = () => {
  const [edit, setEdit] = useState(false)
  const [profileEdit, setProfileEdit] = useState(false)
  const navigate = useNavigate()

  const { user, setUser, updateProfileImage } = useUserStore((state) => state)

  const handleLogout = async() => {
    navigate('/')
  }

  useEffect(() => {
    if(!user) {
        setUser({...userData})
        // updateProfileImage(userData.profile_image)
    } 
  }, [user])

console.log(userData)

  const handleEdit = () => {
    console.log('edit')
    setEdit((edit) => !edit)
    setProfileEdit(edit => !edit)
  }
  console.log(edit)

  const handleNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log(e.target.value)
    console.log(user)
    const newNickname = e.target.value;
    if(user) {
      setUser({...user, nickname: newNickname})
    }

  }
  console.log(user?.nickname)

  const handleNewNick = () => {
    setEdit((edit) => !edit)
    setProfileEdit(edit => !edit)
  }


  console.log(profileEdit)

  const handleFileSelect = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    console.log(imageUrl);
    console.log(typeof imageUrl);

    updateProfileImage(imageUrl)
  }

console.log(user?.profile_image)
  return (
    <>
    <form>
        <div className="min-w-[1200px]">
          <div className='left-0 top-0 z-10 w-screen  bg-white'>
            <Link to='/' className='flex items-center py-[20px] pl-[30px]'>
              <img src='/logo.svg' alt='한바퀴 로고' className='w-9' />
              <h1 className={'font-okgung text-2xl text-black'}>한바퀴</h1>
            </Link>
          </div>


          <div className="px-32 mt-12">

            <div className="flex justify-between">
              <div className="flex">
                {/* <img src="/logo.svg" alt="사용자 이미지" className="w-[160px]"/> */}
                {
                    profileEdit ? (
                        <>
                            <ProfileImage onFileSelect={handleFileSelect} updateProfileImage={updateProfileImage}/>
                        </>
                    ) : ( 
                    <div>
                        {
                            user?.profile_image ? <img src= {user?.profile_image} className="text-3xl w-32 h-32 rounded-full"/> : <CgProfile className="text-[120px]"  /> 
                        }
                    </div>
                )
                }
                
                {
                  edit ? 
                    <>
                      <input placeholder="닉네임을 수정해주세요." className="ml-8 my-12 border border-gray  border-2 rounded-md" onChange={handleNickname} value={user?.nickname}/>
                    </>
                    : 
                    <span className="mt-12 ml-8 font-bold">{user?.nickname}</span>
                }
                
              </div>
              <div className="flex mt-12 mr-4 text-xl ">
                {
                    edit ? (
                        <button onClick={handleNewNick} className="bg-[#28466A] text-white rounded px-2 h-[23px] text-sm mr-4">수정</button>
                    ) : (
                        <FaUserEdit className="mr-4" onClick={handleEdit}/>
                    )
                }
                <MdLogout onClick={handleLogout} />
              </div>
            </div>

            <hr className="mt-8"/>

            <div className="flex justify-between mt-8">
              <p className="text-2xl">나의 게시글</p>
              <Link to={'/posting'} className="text-[10px] px-2 py-2  rounded  bg-[#28466A] text-white">게시글 작성</Link>
            </div>


            <div className="grid grid-cols-2 gap-6 mt-12">
                사용자가 좋아요 누른 포스터들
            </div>
          </div>
        </div>
      </form>
    </>
  )
};

export default MyPage;

