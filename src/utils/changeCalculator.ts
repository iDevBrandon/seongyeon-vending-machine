import type { ChangeResult } from "../types";
import { DENOMINATIONS } from "../types";

/**
 * 거스름돈 계산 함수
 * 탐욕 알고리즘을 사용하여 최적의 거스름돈 조합을 계산
 * @param changeAmount 거스름돈 총액
 * @param changeInventory 자판기 내 거스름돈 재고
 * @returns 거스름돈 조합과 지급 가능 여부
 */
export function calculateChange(
  changeAmount: number,
  changeInventory: Record<number, number>
): ChangeResult {
  const change: Record<number, number> = {};
  let remainingAmount = changeAmount;

  // 큰 액면가부터 처리 (탐욕 알고리즘)
  for (const denomination of DENOMINATIONS) {
    if (remainingAmount >= denomination && changeInventory[denomination] > 0) {
      const neededCount = Math.floor(remainingAmount / denomination);
      const availableCount = changeInventory[denomination];
      const usedCount = Math.min(neededCount, availableCount);

      if (usedCount > 0) {
        change[denomination] = usedCount;
        remainingAmount -= denomination * usedCount;
      }
    }
  }

  const canProvideChange = remainingAmount === 0;

  return {
    change,
    totalAmount: changeAmount - remainingAmount,
    canProvideChange,
  };
}

/**
 * 거스름돈 재고에서 사용된 거스름돈을 차감
 * @param inventory 현재 재고
 * @param usedChange 사용된 거스름돈
 * @returns 업데이트된 재고
 */
export function updateChangeInventory(
  inventory: Record<number, number>,
  usedChange: Record<number, number>
): Record<number, number> {
  const newInventory = { ...inventory };

  for (const [denomination, count] of Object.entries(usedChange)) {
    const denom = parseInt(denomination);
    newInventory[denom] = Math.max(0, newInventory[denom] - count);
  }

  return newInventory;
}

/**
 * 투입된 현금을 거스름돈 재고에 추가
 * @param inventory 현재 재고
 * @param insertedAmount 투입된 금액
 * @returns 업데이트된 재고
 */
export function addToChangeInventory(
  inventory: Record<number, number>,
  denomination: number
): Record<number, number> {
  return {
    ...inventory,
    [denomination]: (inventory[denomination] || 0) + 1,
  };
}

/**
 * 금액을 천 단위 콤마가 포함된 문자열로 포맷팅
 * @param amount 금액
 * @returns 포맷팅된 문자열
 */
export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString()}원`;
}
