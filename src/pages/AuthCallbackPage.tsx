const AuthCallbackPage = () => {
  // 확인해야 할 것
  // header에 쿠키로 토큰을 받을 수 있는건 알겠음
  // 그럼 body로 유저 정보를 담아줄 수 있는지? (user_id, nickname, profile_image)
  // 그럼 프론트는 body에 담긴 유저정보를 어떻게 받아보는지?
  // 아니면 /users/accounts/user 로 유정정보를 요청하면 될지?
  // 근데 /users/accounts/user 는 어떤 데이터로 유저 정보를 요청할 수 있나? 쿠키에 있는 토큰으로 가져오나?

  return (
    <div>
      <h2>로그인 처리 중...</h2>
    </div>
  );
};

export default AuthCallbackPage;
