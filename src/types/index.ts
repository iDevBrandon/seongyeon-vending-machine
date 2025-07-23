export interface Drink {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export type TransactionStatus =
  | "idle" // 대기 상태
  | "payment" // 결제 진행 중
  | "selection" // 음료 선택 완료, 구매 대기
  | "processing" // 구매 처리 중
  | "complete" // 구매 완료
  | "error"; // 오류 발생

export type PaymentMethod = "cash" | "card" | null;

export interface Transaction {
  selectedDrink: Drink | null;
  insertedAmount: number;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  errorMessage?: string;
}

export interface VendingMachineState {
  drinks: Drink[];
  transaction: Transaction;
  changeInventory: Record<number, number>; // 거스름돈 재고 {액면가: 개수}
  cardBalance: number; // 카드 잔고 (시뮬레이션용)
}

// 지폐/동전 액면가
export const DENOMINATIONS = [10000, 5000, 1000, 500, 100] as const;
export type Denomination = (typeof DENOMINATIONS)[number];

// 거스름돈 계산 결과
export interface ChangeResult {
  change: Record<number, number>;
  totalAmount: number;
  canProvideChange: boolean;
}
