# Authentication Server Stater

## 환경 구성
1. NPM 패키지 설치

```shell
$ npm i
```

2. .env 파일 작성
* .env-helper 파일 참고

3. key 파일 생성: [RS256 키 생성](https://travistidwell.com/jsencrypt/demo/) 참고(키 사이즈: 512)
* access-token.private.key
* access-token.public.key
* refresh-token.private.key
* refresh-token.public.key


## 서버 실행 관련 스크립트
1. 개발 모드 실행

```shell
$ npm run dev
```

2. 배포 모드 실행

```shell
$ npm start
```

3. 배포 모드 중지

```shell
$ npm run stop
```

4. 배포 모드 재실행

```shell
$ npm run restart
```

## API 테스트
* documents/api.rest 파일 참고