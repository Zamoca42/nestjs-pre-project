# 2024년 (주)두번째 사전 과제

## 목차 :clipboard:

- [2024년 (주)두번째 사전 과제](#2024년-주두번째-사전-과제)
  - [목차 :clipboard:](#목차-clipboard)
  - [기술 스택](#기술-스택)
  - [ERD](#erd)
  - [DDL](#ddl)
  - [구현 과정 및 설명](#구현-과정-및-설명)
  - [API 문서](#api-문서)

## 기술 스택

![NestJS][NestJS] ![TypeScript][TypeScript] ![TypeORM][TypeORM]
![PostgreSQL][PostgreSQL]  
![Swagger][Swagger]
![GitHubActions][GitHubActions]
![DockerCompose][DockerCompose]

## ERD

![사전과제-erd](https://github.com/Zamoca42/nestjs-pre-project/assets/96982072/d29c745f-cc31-4166-8836-940d49308106)

## DDL

```sql
create type public.order_status_enum as enum ('order', 'refund');

create table
  "customer" (
    id integer primary key generated always as identity,
    name varchar(32),
    grade varchar(4)
  );

create table
  "order" (
    id integer primary key generated always as identity,
    customer_id integer,
    status order_status_enum,
    created_at date,
    amount integer
  );

alter table "order"
add constraint fk_customer_id foreign key (customer_id) references customer (id);
```

## 구현 과정 및 설명

- **고객정보 및 주문내역정보 업로드 API `api/upload-csv`**

  - xlsx 또는 csv 파일 업로드 관련 라이브러리로 [xlsx](https://www.npmjs.com/package/xlsx)를 사용했습니다

    - 라이브러리에는 exceljs와 xlsx 중 비교적 unpack 사이즈가 작은 xlsx를 선택했습니다.
    - xlsx라이브러리의 최신 버전은 npm으로 관리하고 있지 않아서 다음 명령어로 설치했습니다.

      - <https://docs.sheetjs.com/docs/getting-started/installation/nodejs/>

      ```bash
      npm i --save https://cdn.sheetjs.com/xlsx-0.20.1/xlsx-0.20.1.tgz
      ```

  - csv -> json으로 변환해서 엔티티로 전달하는 로직을 작성했습니다. (csvToJson, saveDataToEntity)
  - csv 파일이름 내에서 order, customer를 포함하도록 파이프를 추가했습니다.
  - csv가 정상적으로 전달되면 전달된 엔티티의 행의 수와 엔티티 이름을 반환하도록 작성했습니다.

- **월별 매출 통계 API `api/sales/monthly`**

  - findMonthlySales 메서드를 사용하여 월별 매출 통계를 조회합니다.
  - 주문일자를 date로 월별로 정리하고 주문금액을 주문타입에 따라 주문, 환불, 매출총액을 나눠서 반환하게 쿼리빌더를 만들었습니다.

    ```sql
      date_trunc('month', o.createdAt)::date as date,
      sum(CASE WHEN o.status = 'order' THEN o.amount ELSE 0 END) as order,
      sum(CASE WHEN o.status = 'refund' THEN o.amount ELSE 0 END) as refund,
      sum(CASE WHEN o.status = 'order' THEN o.amount ELSE -o.amount END) as amount`,
    ```

  - GetOrderStatistics 클래스를 사용하여 조회된 데이터를 직렬화합니다.

    ```json
    {
      "date": "YYYY년 M월", //(예) - 2024년 1월
      "order": "주문 총액(원)",
      "refund": "환불 총액(원)",
      "amount": "매출 총액(원)"
    }
    ```

- **주문 목록 조회 API `api/order`**

  - PaginationDto, OrderQueryParam에서 쿼리파라미터를 받아서 전달합니다.
    - 페이지네이션
      - PageNo `number`: 조회할 페이지 번호 (기본: 1)
      - pageSize `number`: 한 페이지 조회 건 수 (기본: 50)
    - 주문시 조회
      - startDate `string`: 기간 조회 시 시작일 (예시: 2024-01-01)
      - endDate `string`: 기간 조회 시 종료일 (예시: 2024-01-01)
      - orderType `number`: 주문 또는 반품만을 조회 (0: 주문, 1: 반품)
      - customerId `number`: 특정 고객의 주문만 조회 시 (고객 id)
  - 주문시 조회에 쿼리 파라미터를 넣지 않으면 전체 엔티티를 반환하도록 작성했습니다.
  - PageEntity.create 메서드를 사용하여 페이징된 응답(현재 페이지, 페이지에 가져온 항목수)을 생성합니다.

- **단위 테스트 작성**

  - 주문, 고객, 파일 변환, 통계에 관한 단위 테스트 작성

## API 문서

![1](https://github.com/Zamoca42/nestjs-pre-project/assets/96982072/762a1651-6c53-415a-9ba7-febc351d2100)
![2](https://github.com/Zamoca42/nestjs-pre-project/assets/96982072/ec25d675-ceff-4a67-b9fd-690c61c5a957)
![3](https://github.com/Zamoca42/nestjs-pre-project/assets/96982072/4344f4dd-755e-4845-aaea-1c275657547b)
![4](https://github.com/Zamoca42/nestjs-pre-project/assets/96982072/dc893cef-0c5d-4e7d-b00c-8bffef37bfa0)
![5](https://github.com/Zamoca42/nestjs-pre-project/assets/96982072/62f77b5b-6070-42a2-ad32-e071928db867)

<br/>

[NestJS]: https://img.shields.io/badge/nestjs%2010.-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white
[TypeScript]: https://img.shields.io/badge/typescript%205.-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[TypeORM]: https://img.shields.io/badge/TypeORM%200.3-%2334567c.svg?style=for-the-badge&logo=adminer&logoColor=white
[PostgreSQL]: https://img.shields.io/badge/postgres%2014.0-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white
[Swagger]: https://img.shields.io/badge/swagger-%23Clojure.svg?style=for-the-badge&logo=swagger&logoColor=white
[GitHubActions]: https://img.shields.io/badge/GitHub%20Actions-%232088ff.svg?style=for-the-badge&logo=githubactions&logoColor=white
[DockerCompose]: https://img.shields.io/badge/Docker%20Compose-%232496ED.svg?style=for-the-badge&logo=docker&logoColor=white
