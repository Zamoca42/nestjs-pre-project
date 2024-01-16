# 2024년 (주)두번째 사전 과제

## 목차 :clipboard:

- [2024년 (주)두번째 사전 과제](#2024년-주두번째-사전-과제)
  - [목차 :clipboard:](#목차-clipboard)
  - [개요](#개요)
  - [사용 기술](#사용-기술)
  - [프로젝트 진행 및 이슈 관리](#프로젝트-진행-및-이슈-관리)
  - [ERD](#erd)
  - [아키텍처](#아키텍처)
  - [구현 과정 및 설명](#구현-과정-및-설명)
  - [Did You Know](#did-you-know)
  - [API Endpoint](#api-endpoint)
  - [테스트 케이스](#테스트-케이스)
    - [이벤트](#이벤트)
    - [포토부스](#포토부스)
    - [리뷰](#리뷰)
    - [해시태그](#해시태그)
  - [API Reference](#api-reference)

## 개요

덤핀 어플리케이션은 사용자 주변의 다양한 포토부스를 소개하고 프레임 및 진행 중인 이벤트 정보를 제공하는 플랫폼입니다.
사용자들은 덤핀 어플을 통해 지역 내 포토부스의 다양한 특징과 프레임을 확인할 수 있으며, 현재 진행 중인 이벤트에 참여할 수 있습니다.

덤핀 어드민은 어플리케이션의 관리 백오피스로서, 포토부스 정보의 업데이트, 이벤트 관리, 사용자 데이터 분석 등을 수행합니다.
어드민을 통해 쉽게 어플리케이션의 콘텐츠를 관리하고 최신 정보를 반영할 수 있습니다.

이를 통해 사용자들은 항상 다양하고 흥미로운 포토부스 경험을 즐길 수 있으며,
어플리케이션은 지속적인 업데이트와 새로운 이벤트를 통해 사용자들을 유지하고 확장할 수 있습니다.

## 사용 기술

![NestJS][NestJS] ![TypeScript][TypeScript] ![TypeORM][TypeORM]
![PostgreSQL][PostgreSQL] ![Swagger][Swagger]
![GitHubActions][GitHubActions] ![EC2][AWS-EC2] ![Route53][AWS-Route53]

## 프로젝트 진행 및 이슈 관리

[![GitHub][GitHub]](https://github.com/orgs/develop-pix/projects/1/views/1)

![Project-Calander](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/d7620bae-fcaf-4d2b-87b4-29bb48013649)
![Project-Kanban](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/1f345570-1ec3-4fc5-b77a-a03a9a730997)

## ERD

![modeling](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/7f7d0eda-468e-44f8-819a-5df3006280c8)

## 아키텍처

![app-architecture](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/302d5157-1e8c-4eb6-a50a-ef106c7fe897)

## 구현 과정 및 설명

- **세션 인증 및 인가**

  - express-session을 이용해서 서버 메모리가 아닌 postgresql로 세션 스토어 사용
  - 쿠키 세션 적용
  - Guard로 인가 기능 적용
  - Rate Limiting으로 무작위 대입 방지

- **대시보드 기능**

  - 날짜별 가입자수, 리뷰수 보기 적용
  - TypeORM 쿼리빌더에서 groupBy를 이용

    ```typescript
      countUsersByDate(): Promise<RawCountByDate[]> {
      return this.createQueryBuilder('user')
        .select(['DATE(created_at) as created', 'COUNT(id) as user'])
        .where('deleted_at IS NULL')
        .groupBy('created')
        .orderBy('created', 'DESC')
        .getRawMany();
    }
    ```

  - 통합 대시보드 보기
    - 날짜별 가입자수, 리뷰수 쿼리 결과를 [대시보드 서비스 로직][dashboard]에서 통합

- **포토부스 관리 기능**

  - 포토부스 업체를 생성, 수정할 수 있는 기능 적용
  - 어플리케이션 내의 지도에 표시 지역별 포토부스 지점관리 기능 적용

- **이벤트 관리 기능**

  - 어플리케이션에서 포토부스 업체별 시행하고있는 이벤트나 한정 기간동안 프레임을 볼 수 있는 이벤트 생성 기능
  - 이벤트를 수정하면서 관련 이미지, 해시태그를 테이블로 정규화해서 관리

- **리뷰 관리 기능**

  - 유저가 작성한 리뷰를 확인하고 부적절한 내용은 삭제할 수 있게 조회 및 삭제기능 적용

- **유저 관리 기능**

  - 가입한 유저의 정보를 확인 (수정 불가)

- **로그 모니터링**

  - Sentry, Winston을 이용해 로그 레벨에 따라 알림
    - info 레벨: 이미 예외처리를 작성한 내용은 Winston으로 파일로 만들어서 관리
    - error 레벨: 내부 서버 에러나 예상치 못한 에러는 Sentry로 보내 이메일로 알림
  - Sentry의 Cron 모니터링과 NestJS 스케쥴링으로 주기적으로 서버 상태 모니터링

## Did You Know

:pushpin: [API 요청 시도 횟수 제한하기](https://zamoca.space/js-ts/nest-js/rate-limit.html)

:pushpin: [트랜잭션 롤백 해결하기](https://zamoca.space/db/transaction-rollback.html)

:pushpin: [sh: 1: nest: not found 해결](https://zamoca.space/js-ts/nest-js/error-cli-not-found.html)

:pushpin: [응답 객체 직렬화하기](https://zamoca.space/js-ts/nest-js/class-transformer.html)

:pushpin: [요청 객체 역직렬화하기](https://zamoca.space/js-ts/nest-js/class-validator.html)

:pushpin: [서버 상태 모니터링하기](https://zamoca.space/js-ts/nest-js/server-monitoring.html)

:pushpin: [외부 로거로 효율적으로 모니터링하기](https://zamoca.space/js-ts/nest-js/external-logger.html)

## API Endpoint

![API-endpoint-notion](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/961eacf8-4dee-4779-b748-7631e3687e48)

## 테스트 케이스

### 이벤트

![test-event](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/f61692a4-cfde-431e-b8e5-b39cde17d00b)

### 포토부스

![test-photobooth](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/b6f74c5e-8406-4207-b621-ec8c1125e522)

### 리뷰

![test-review](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/0b152ed3-1226-4d12-ab41-11eef0792c32)

### 해시태그

![test-hashtag](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/42a59297-dc87-4baa-89eb-646ff894886c)

## API Reference

<https://admin.dump-in.co.kr/api/swagger>

<details>

<summary>Swagger 이미지</summary>

![1](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/beecf55a-de66-4722-b237-17f46f78bc27)
![2](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/13fd5bec-4412-4d05-adb9-9c90dad679a9)

</details>

<br/>

[NestJS]: https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white
[TypeScript]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[TypeORM]: https://img.shields.io/badge/TypeORM-%2334567c.svg?style=for-the-badge&logo=adminer&logoColor=white
[PostgreSQL]: https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white
[Swagger]: https://img.shields.io/badge/swagger-%23Clojure.svg?style=for-the-badge&logo=swagger&logoColor=white
[GitHubActions]: https://img.shields.io/badge/GitHub%20Actions-%232088ff.svg?style=for-the-badge&logo=githubactions&logoColor=white
[GitHub]: https://img.shields.io/badge/GitHub%20Project-%23181717.svg?style=for-the-badge&logo=github&logoColor=white
[AWS-EC2]: https://img.shields.io/badge/AWS%20EC2-%23FF9900.svg?style=for-the-badge&logo=amazonec2&logoColor=white
[AWS-Route53]: https://img.shields.io/badge/AWS%20Route53-%238C4FFF.svg?style=for-the-badge&logo=amazonroute53&logoColor=white
[dashboard]: https://github.com/develop-pix/dump-in-Admin-BE/blob/main/src/dashboard/dashboard.service.ts
