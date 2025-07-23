# 자판기 시뮬레이터 (Vending Machine Simulator)

React와 TypeScript로 구현한 자판기 시뮬레이터입니다.

## 📋 과제 개요

### 요구사항

1. 자판기에서 사용자가 원하는 음료수를 얻기까지의 메카니즘 다이어그램 작성
2. TypeScript + React를 사용한 프로그래밍 구현
3. 자판기 동작에 필요한 주요 로직 표현
4. 경우의 수, 예외 케이스를 가능한 많이 표현
5. 동작 가능한 코드 및 화면 구현

### 전제조건

- **결제수단**: 현금(100원/500원/1,000원/5,000원/10,000원), 카드
- **음료수**: 콜라(1,100원), 물(600원), 커피(700원)
- **예외상황**: 품절, 잔액부족, 거스름돈부족, 결제실패 등

### 평가 포인트

- 결과물의 동작과 버그 없음
- 사용자 중심의 UI
- 발생 가능한 케이스에 대한 고민
- 이해하기 쉬운 문서
- 적절한 코드 구조와 스타일

## 🚀 실행 방법

### 필요 조건

- Node.js (버전 18 이상)
- pnpm (버전 8 이상)

### 설치 및 실행

```bash
# 프로젝트 클론
git clone https://github.com/iDevBrandon/seongyeon-vending-machine.git
cd seongyeon-vending-machine

# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 브라우저에서 http://localhost:5173 접속
```

### 빌드

```bash
# 프로덕션 빌드
pnpm build
```

### 다이어그램 라이브

## 📊 자판기 메커니즘 다이어그램

### Mermaid 다이어그램 (실시간 확인)

[Mermaid Live Editor에서 보기](https://mermaid.live/edit#pako:eNp9VN1uGkcYfZXR9Na22B9j4CKVA9Rh18lVr7pwgWDXtoQhIqA2BUskXkfIcVWSgrK2gJKWOrZEpcUmFL_Szuw7dNiZxTsYh4sVM9853-_5pgZzpbwOY9AolH7O7WfLFfBjIl0E5bet4fdd3P8A1gE6azgzG-DjN-5xNwPW15-ApzX8doQvrnG_BXDnMz6xjiiNfp_OQXXXMp1ZE7jNEe6f1EFc4y4AvrHQ5SgTZODeGfr7DGBz4B736iChcRcrGXcT9EcXODc2HnTrIKlxFzyDfuNeAXGhRtNALQKeNUkRwD3v4N6MFRIXqP_uwL24cjs-iJQhaqwARkNNEw_eZDgaGk2WaZLm423LPbd8vOSls81Oonf6QcP9tpfRhy6ZAsCfTtBvNu5N3NMZV0vCgyeEmt-n_si5HfCFJFgh1IQ_vSNY0lpSxccmHjQBum7PJ_2lwaJlVtL6TUqT-JGg1pWPF4OFJGhZCbnGZs7mwVqAp9doan7PaSYhewH9Jk0b-POYBNzU8LTt2I0F9aKNb_7NrOJQr3WwozlfR-jL0OvDoMP061M2vcye1ZhbTr3PaM3UsixfDrIkO8723xV-R3qV0pyxjfoWoBfc4JJeEknBlyuVGTbHxGUDX_YYOCkEo1FRkWjigmYN0T_W_QhX0qhvQiMKZFtxekf0wbcyyc0vKVEPDPh-6J7NPcgLD97Nw8A8zRw7t1_rQPHnwW1jUg4GpN8d72pHqC0N0Gqh0zbrIxvVDq2RA9aBqvF64yIyymI-wciqF1klkcc2Ph2iSxP9TrzcmvitzSKqLGIQ4K-T8jjE7Zik0SQ1kfe9aldVkVs6pmdV0njmsIHuzMwqir82qsxT6D1Jt4X-9Nuh0gHsas6kQZo0f8pda4an_guwG5yPShdaCfZMoVeCxr8-2L5y7BZzoggUJPogZNv3IRQqOmWpQB7DIssLFZ2bnqMl7Sm0nOeLrfvrhMC4rUt5iJTgP-BMK9yDnKIJp0jCnk4eex9T4kP5PveuXmgSnjT5V-fFQ_CryuuCDraBcVAoxL7TBWPT0IMWhVlyET2ciwYtKWYxjFw-LwYtuwuLIemhoIU8z4-Rkt8wyY-aVN4E1-Be-SAPY5VyVV-Dh3r5MDs_wtqclIaVff1QT8MY-ZvXjWy1UEnDdPGI0F5miz-VSoc-s1yq7u3DmJEtvCKn6st8tqInDrJ75ew9RC_m9XK8VC1WYGzT8wBjNfgLjElyZCMkhkNhORoiv4gor8HXMCZsRTfCYTmyFYlEhUhEko7W4K9eTGEjFBK3ImEpuhWVpGj46H-AQ_yw)

### 상세 다이어그램 문서

📄 [자판기 메커니즘 다이어그램 상세 문서](./docs/mechanism-diagram.md)

## flowchart TD

    A[시작 - 대기 상태] --> B{사용자 액션}

    B -->|현금 투입| C[현금 투입 처리]
    B -->|음료 선택| D[음료 선택 처리]
    B -->|카드 결제| E[카드 결제 처리]

    C --> C1{투입된 금액 확인}
    C1 -->|유효한 금액| C2[투입 금액 누적]
    C1 -->|무효한 금액| C3[금액 반환]
    C3 --> A
    C2 --> F[잔액 표시 업데이트]

    D --> D1{음료 재고 확인}
    D1 -->|재고 없음| D2[품절 메시지 표시]
    D1 -->|재고 있음| D3[음료 선택됨]
    D2 --> A
    D3 --> D4{현금 결제 금액 충분?}

    D4 -->|금액 부족| D5[추가 금액 요청]
    D4 -->|금액 충분| G[구매 확정 대기]
    D5 --> H{추가 액션}
    H -->|추가 현금 투입| C
    H -->|카드 결제| E
    H -->|취소| I[거래 취소]

    E --> E1[카드 유효성 검증]
    E1 -->|카드 무효| E2[카드 오류 메시지]
    E1 -->|카드 유효| E3[결제 승인 요청]
    E2 --> A
    E3 -->|승인 실패| E4[결제 실패 메시지]
    E3 -->|승인 성공| J[구매 처리]
    E4 --> A

    G --> G1{구매 확정 또는 취소}
    G1 -->|구매 확정| K[현금 결제 처리]
    G1 -->|취소| I

    K --> K1{거스름돈 계산}
    K1 -->|거스름돈 없음| J
    K1 -->|거스름돈 필요| K2{거스름돈 재고 확인}
    K2 -->|재고 충분| K3[거스름돈 준비]
    K2 -->|재고 부족| K4[거스름돈 부족 에러]
    K4 --> L[관리자 호출]
    L --> A
    K3 --> J

    J --> J1[음료 재고 차감]
    J1 --> J2[음료 배출]
    J2 --> J3[거스름돈 배출]
    J3 --> J4[구매 완료 메시지]
    J4 --> M[거래 종료]

    I --> I1[투입 현금 반환]
    I1 --> I2[취소 메시지 표시]
    I2 --> A

    M --> N[3초 대기]
    N --> A

## 🎯 기능 개요

### 주요 기능

- **현금 결제**: 100원, 500원, 1,000원, 5,000원, 10,000원 지폐/동전 투입
- **카드 결제**: 카드 결제 시뮬레이션 (잔고 관리 포함)
- **카드 충전**: 1,000원, 5,000원, 10,000원, 20,000원 충전 가능
- **음료 선택**: 콜라(1,100원), 물(600원), 커피(700원)
- **재고 관리**: 실시간 재고 확인 및 품절 처리
- **거스름돈 계산**: 최적 거스름돈 조합 계산
- **거래 취소**: 언제든지 거래 취소 및 투입금 반환

### 예외 상황 처리

- **품절 상황**: 재고가 없는 음료 선택 시 품절 메시지
- **잔액 부족**: 투입 금액이 음료 가격보다 적을 때 추가 금액 요청
- **카드 잔고 부족**: 카드 잔고가 부족할 때 충전 안내
- **거스름돈 부족**: 자판기 내 거스름돈 재고 부족 시 에러 처리
- **카드 결제 실패**: 카드 결제 실패 시뮬레이션 (15% 확률)
- **거래 타임아웃**: 구매 완료 후 자동으로 초기 상태로 복귀

## 🏗️ 기술 스택

- **프론트엔드**: React 19 + TypeScript 5
- **스타일링**: Tailwind CSS v4
- **상태 관리**: React Hooks (useState, useCallback, useEffect)
- **빌드**: Vite 7, pnpm
- **개발 도구**: ESLint, PostCSS

## 📁 프로젝트 구조

```
seongyeon-vending-machine/
├── src/
│   ├── components/
│   │   └── VendingMachine.tsx    # 메인 자판기 컴포넌트
│   ├── types/
│   │   └── index.ts              # TypeScript 타입 정의
│   ├── utils/
│   │   └── changeCalculator.ts   # 거스름돈 계산 유틸리티
│   ├── App.tsx                   # 메인 앱 컴포넌트
│   └── main.tsx                  # 앱 진입점
├── docs/
│   └── mechanism-diagram.md      # 자판기 메커니즘 다이어그램
├── README.md                     # 프로젝트 문서
├── package.json                  # 패키지 정보
├── tailwind.config.js           # Tailwind CSS 설정
└── tsconfig.json                # TypeScript 설정
```

## 🎮 사용 방법

### 1. 현금으로 구매하기

1. 현금 투입 버튼 클릭 100원 / 500원 / 1,000원 / 5,000원 / 10,000원권 사용가능
2. 원하는 음료 선택
3. "구매확정" 버튼 클릭
4. 음료 배출 및 거스름돈 반환

### 2. 카드로 구매하기

1. 카드 잔고가 부족하면 충전 버튼으로 충전
2. 원하는 음료 선택
3. "카드결제" 버튼 클릭
4. 결제 처리 대기
5. 음료 배출

### 3. 거래 취소

- 언제든지 "취소/반환" 버튼을 눌러 투입한 현금 반환

## 🔧 핵심 구현 로직

### 상태 관리 (Transaction Status)

- `idle`: 대기 상태 → `payment`: 결제 진행 중 → `selection`: 음료 선택 완료 → `processing`: 구매 처리 중 → `complete`: 구매 완료
- `error`: 오류 발생 시 3초 후 이전 상태로 복귀

### 주요 알고리즘

1. **거스름돈 계산**: 탐욕 알고리즘으로 최소 개수의 지폐/동전 조합 계산
2. **재고 관리**: 실시간 재고 차감 및 품절 상태 관리
3. **카드 결제**: 잔고 확인 → 15% 확률 실패 시뮬레이션 → 성공 시 잔고 차감

### 데이터 구조

```typescript
interface Drink {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface Transaction {
  selectedDrink: Drink | null;
  insertedAmount: number;
  paymentMethod: "cash" | "card" | null;
  status: TransactionStatus;
  errorMessage?: string;
}
```

## 🧪 테스트 케이스

### 정상 케이스

- ✅ 충분한 금액으로 음료 구매
- ✅ 카드 결제로 음료 구매
- ✅ 거스름돈이 있는 현금 결제
- ✅ 딱 맞는 금액으로 현금 결제

### 예외 케이스

- ✅ 품절된 음료 선택 시도
- ✅ 금액 부족 상태에서 구매 시도
- ✅ 카드 잔고 부족 상태에서 구매 시도
- ✅ 거스름돈 재고 부족 상황
- ✅ 거래 중 취소 요청
- ✅ 카드 결제 실패 시뮬레이션

## 🎨 UI/UX & 성능 특징

- **직관적 인터페이스**: 실제 자판기와 유사한 레이아웃
- **실시간 피드백**: 모든 액션에 대한 즉각적인 상태 표시
- **반응형 디자인**: 다양한 화면 크기 지원
- **성능 최적화**: useCallback을 통한 함수 메모이제이션
- **메모리 관리**: useEffect cleanup을 통한 타이머 정리

## 🎯 구현 결과

✅ **모든 요구사항 완료**

- ✅ 메커니즘 다이어그램 (Mermaid flowchart)
- ✅ TypeScript + React 구현
- ✅ 주요 로직 구현 (상태 관리, 결제, 거스름돈 계산)
- ✅ 다양한 예외 케이스 처리 (품절, 잔액부족, 거스름돈부족, 결제실패)
- ✅ 동작 가능한 화면 제공
- ✅ 사용자 중심 UI 설계
- ✅ 버그 없는 안정적인 동작
- ✅ 이해하기 쉬운 코드 구조

**추가 구현사항:**

- 카드 잔고 충전 기능
- 실시간 상태 표시
- 접근성 고려사항
- 성능 최적화

---

_개발 시간: 약 4시간 (다이어그램 1시간, 구현 3시간)_
