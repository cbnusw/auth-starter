const httpErrors = require('http-errors');

const createError = err => {
  const e = httpErrors(err[0], err[1]);
  e.code = err[2];
  return e;
};

const errors = {
  // 여기에 HTTP Error 추가
  INVALID_PASSWORD: [400, '잘못된 비밀번호입니다.'],
  PASSWORD_REQUIRED: [400, '비밀번호가 필요합니다.'],
  EMAIL_REQUIRED: [400, '이메일이 필요합니다.'],
  TOKEN_REQUIRED: [400, '토큰이 필요합니다.'],
  EMAIL_USED: [400, '사용 중인 이메일입니다.'],
  PHONE_NUMBER_USED: [400, '사용 중인 연락처입니다.'],

  INVALID_AUTH_TOKEN: [401, '유효하지 않은 인증토큰입니다.'],
  INVALID_REFRESH_TOKEN: [401, '유효하지 않은 토큰입니다.'],
  LOGIN_REQUIRED: [401, '로그인이 필요합니다.'],
  WITHDRAWN_USER: [401, '탈퇴처리된 회원입니다.'],

  FORBIDDEN: [403, '권한이 없는 요청입니다.'],

  NOT_FOUND: [404, '찾을 수 없는 요청입니다.'],
  USER_NOT_FOUND: [404, '찾을 수 없는 사용자입니다.'],

  ACCESS_TOKEN_EXPIRED: [419, '만료된 인증토큰입니다.'],
  REFRESH_TOKEN_EXPIRED: [419, '만료된 토큰입니다.']
};

Object.keys(errors)
  .forEach(key => errors[key] = createError([...errors[key], key]));

module.exports = errors;
