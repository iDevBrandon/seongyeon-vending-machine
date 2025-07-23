import React, { useCallback, useEffect, useState } from "react";
import type {
  Denomination,
  Drink,
  Transaction,
  VendingMachineState,
} from "../types";
import { DENOMINATIONS } from "../types";
import {
  addToChangeInventory,
  calculateChange,
  formatCurrency,
  updateChangeInventory,
} from "../utils/changeCalculator";

// 초기 데이터
const INITIAL_DRINKS: Drink[] = [
  { id: "cola", name: "콜라", price: 1100, stock: 5 },
  { id: "water", name: "물", price: 600, stock: 3 },
  { id: "coffee", name: "커피", price: 700, stock: 4 },
];

const INITIAL_CHANGE_INVENTORY = {
  10000: 2,
  5000: 3,
  1000: 10,
  500: 15,
  100: 20,
};

const INITIAL_TRANSACTION: Transaction = {
  selectedDrink: null,
  insertedAmount: 0,
  paymentMethod: null,
  status: "idle",
  errorMessage: undefined,
};

export const VendingMachine: React.FC = () => {
  const [state, setState] = useState<VendingMachineState>({
    drinks: INITIAL_DRINKS,
    transaction: INITIAL_TRANSACTION,
    changeInventory: INITIAL_CHANGE_INVENTORY,
    cardBalance: 5000, // 카드 잔고 5,000원으로 시뮬레이션
  });

  // 상태 업데이트 헬퍼
  const updateTransaction = useCallback((updates: Partial<Transaction>) => {
    setState((prev) => ({
      ...prev,
      transaction: { ...prev.transaction, ...updates },
    }));
  }, []);

  // 현금 투입
  const insertCash = useCallback(
    (denomination: Denomination) => {
      if (
        state.transaction.status !== "idle" &&
        state.transaction.status !== "payment"
      ) {
        return;
      }

      setState((prev) => ({
        ...prev,
        transaction: {
          ...prev.transaction,
          insertedAmount: prev.transaction.insertedAmount + denomination,
          paymentMethod: "cash",
          status: "payment",
          errorMessage: undefined,
        },
        changeInventory: addToChangeInventory(
          prev.changeInventory,
          denomination
        ),
      }));
    },
    [state.transaction.status]
  );

  // 음료 선택
  const selectDrink = useCallback(
    (drink: Drink) => {
      // 품절 체크
      if (drink.stock <= 0) {
        updateTransaction({
          status: "error",
          errorMessage: `${drink.name}은(는) 품절입니다.`,
        });
        return;
      }

      // 현금 결제 시 잔액 체크
      if (state.transaction.paymentMethod === "cash") {
        if (state.transaction.insertedAmount < drink.price) {
          updateTransaction({
            selectedDrink: drink,
            status: "error",
            errorMessage: `${formatCurrency(
              drink.price - state.transaction.insertedAmount
            )} 더 투입해주세요.`,
          });
          return;
        }

        // 거스름돈 계산
        const changeAmount = state.transaction.insertedAmount - drink.price;
        if (changeAmount > 0) {
          const changeResult = calculateChange(
            changeAmount,
            state.changeInventory
          );
          if (!changeResult.canProvideChange) {
            updateTransaction({
              selectedDrink: drink,
              status: "error",
              errorMessage:
                "거스름돈이 부족합니다. 다른 음료를 선택하거나 정확한 금액을 투입해주세요.",
            });
            return;
          }
        }
      }

      updateTransaction({
        selectedDrink: drink,
        status: "selection",
        errorMessage: undefined,
      });
    },
    [state.transaction, state.changeInventory, updateTransaction]
  );

  // 구매 확정 (현금)
  const confirmPurchase = useCallback(() => {
    const { selectedDrink, insertedAmount } = state.transaction;
    if (!selectedDrink || state.transaction.paymentMethod !== "cash") return;

    updateTransaction({ status: "processing" });

    // 시뮬레이션 딜레이
    setTimeout(() => {
      const changeAmount = insertedAmount - selectedDrink.price;
      let newChangeInventory = state.changeInventory;

      if (changeAmount > 0) {
        const changeResult = calculateChange(
          changeAmount,
          state.changeInventory
        );
        newChangeInventory = updateChangeInventory(
          state.changeInventory,
          changeResult.change
        );
      }

      setState((prev) => ({
        ...prev,
        drinks: prev.drinks.map((drink) =>
          drink.id === selectedDrink.id
            ? { ...drink, stock: drink.stock - 1 }
            : drink
        ),
        changeInventory: newChangeInventory,
        transaction: { ...INITIAL_TRANSACTION, status: "complete" },
      }));

      // 3초 후 초기 상태로 복귀
      setTimeout(() => {
        updateTransaction({ status: "idle" });
      }, 3000);
    }, 2000);
  }, [state.transaction, state.changeInventory, updateTransaction]);

  // 카드 결제
  const payWithCard = useCallback(() => {
    const { selectedDrink } = state.transaction;
    if (!selectedDrink) return;

    // 카드 잔고 확인
    if (state.cardBalance < selectedDrink.price) {
      updateTransaction({
        status: "error",
        errorMessage: `카드 잔고가 부족합니다. (잔고: ${formatCurrency(
          state.cardBalance
        )}, 필요: ${formatCurrency(selectedDrink.price)})`,
      });
      return;
    }

    updateTransaction({
      status: "processing",
      paymentMethod: "card",
    });

    // 카드 결제 시뮬레이션 (15% 확률로 실패)
    setTimeout(() => {
      const isSuccess = Math.random() > 0.15;

      if (isSuccess) {
        setState((prev) => ({
          ...prev,
          drinks: prev.drinks.map((drink) =>
            drink.id === selectedDrink.id
              ? { ...drink, stock: drink.stock - 1 }
              : drink
          ),
          cardBalance: prev.cardBalance - selectedDrink.price, // 카드 잔고 차감
          transaction: { ...INITIAL_TRANSACTION, status: "complete" },
        }));

        // 3초 후 초기 상태로 복귀
        setTimeout(() => {
          updateTransaction({ status: "idle" });
        }, 3000);
      } else {
        updateTransaction({
          status: "error",
          errorMessage: "카드 결제에 실패했습니다. 다시 시도해주세요.",
        });
      }
    }, 3000);
  }, [state.transaction.selectedDrink, state.cardBalance, updateTransaction]);

  // 거래 취소
  const cancelTransaction = useCallback(() => {
    // 투입된 현금 반환 (재고에서 차감)
    if (
      state.transaction.paymentMethod === "cash" &&
      state.transaction.insertedAmount > 0
    ) {
      // 간단한 반환 로직: 투입된 순서대로 반환한다고 가정
      setState((prev) => ({ ...prev, transaction: INITIAL_TRANSACTION }));
    } else {
      setState((prev) => ({ ...prev, transaction: INITIAL_TRANSACTION }));
    }
  }, [state.transaction]);

  // 카드 충전
  const rechargeCard = useCallback((amount: number) => {
    setState((prev) => ({
      ...prev,
      cardBalance: prev.cardBalance + amount,
    }));
  }, []);

  // 에러 메시지 자동 제거
  useEffect(() => {
    if (state.transaction.status === "error") {
      const timer = setTimeout(() => {
        updateTransaction({
          status: state.transaction.paymentMethod ? "payment" : "idle",
          errorMessage: undefined,
        });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [
    state.transaction.status,
    state.transaction.paymentMethod,
    updateTransaction,
  ]);

  const { transaction, drinks } = state;
  const changeAmount = transaction.selectedDrink
    ? transaction.insertedAmount - transaction.selectedDrink.price
    : 0;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          자판기 시뮬레이터
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 자판기 디스플레이 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="bg-gray-900 text-white p-4 rounded-lg mb-6">
              <div className="text-center text-lg mb-2">
                {transaction.status === "idle" && "음료를 선택해주세요"}
                {transaction.status === "payment" &&
                  "금액을 투입하거나 음료를 선택해주세요"}
                {transaction.status === "selection" &&
                  "구매 방법을 선택해주세요"}
                {transaction.status === "processing" && "처리 중입니다..."}
                {transaction.status === "complete" && "구매가 완료되었습니다!"}
                {transaction.status === "error" && "오류가 발생했습니다"}
              </div>

              {transaction.errorMessage && (
                <div className="text-red-400 text-center text-sm">
                  {transaction.errorMessage}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div>
                  <span className="text-gray-400">투입 금액:</span>
                  <div className="font-bold">
                    {formatCurrency(transaction.insertedAmount)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">카드 잔고:</span>
                  <div className="font-bold">
                    {formatCurrency(state.cardBalance)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">선택 음료:</span>
                  <div className="font-bold">
                    {transaction.selectedDrink
                      ? transaction.selectedDrink.name
                      : "-"}
                  </div>
                </div>
                {transaction.selectedDrink && (
                  <div>
                    <span className="text-gray-400">음료 가격:</span>
                    <div className="font-bold">
                      {formatCurrency(transaction.selectedDrink.price)}
                    </div>
                  </div>
                )}
                {transaction.selectedDrink &&
                  transaction.paymentMethod === "cash" && (
                    <div>
                      <span className="text-gray-400">거스름돈:</span>
                      <div className="font-bold">
                        {formatCurrency(Math.max(0, changeAmount))}
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* 음료 선택 버튼들 */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {drinks.map((drink) => (
                <button
                  key={drink.id}
                  onClick={() => selectDrink(drink)}
                  disabled={
                    drink.stock <= 0 ||
                    transaction.status === "processing" ||
                    transaction.status === "complete"
                  }
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    drink.stock <= 0
                      ? "bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed"
                      : transaction.selectedDrink?.id === drink.id
                      ? "bg-blue-500 border-blue-600 text-white"
                      : "bg-white border-gray-300 text-gray-800 hover:border-blue-400 hover:bg-blue-50"
                  }`}
                >
                  <div className="font-semibold">{drink.name}</div>
                  <div className="text-sm">{formatCurrency(drink.price)}</div>
                  <div className="text-xs mt-1">
                    {drink.stock > 0 ? `재고: ${drink.stock}개` : "품절"}
                  </div>
                </button>
              ))}
            </div>

            {/* 구매/결제 버튼들 */}
            <div className="space-y-3">
              {transaction.status === "selection" &&
                transaction.paymentMethod === "cash" && (
                  <button
                    onClick={confirmPurchase}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                  >
                    구매 확정
                  </button>
                )}

              {transaction.selectedDrink &&
                transaction.status === "selection" &&
                transaction.paymentMethod !== "cash" && (
                  <button
                    onClick={payWithCard}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                  >
                    카드 결제
                  </button>
                )}

              {/* 처리 중일 때 표시 */}
              {transaction.status === "processing" &&
                transaction.paymentMethod === "card" && (
                  <div className="w-full bg-blue-400 text-white py-3 px-4 rounded-lg font-semibold text-center">
                    결제 중...
                  </div>
                )}

              {(transaction.status === "payment" ||
                transaction.status === "selection" ||
                transaction.status === "error") && (
                <button
                  onClick={cancelTransaction}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                >
                  취소/반환
                </button>
              )}
            </div>
          </div>

          {/* 현금 투입 패널 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              현금 투입
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {DENOMINATIONS.map((denomination) => (
                <button
                  key={denomination}
                  onClick={() => insertCash(denomination)}
                  disabled={
                    transaction.status === "processing" ||
                    transaction.status === "complete"
                  }
                  className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-4 px-3 rounded-lg font-semibold transition-colors text-sm"
                >
                  {formatCurrency(denomination)}
                </button>
              ))}
            </div>

            {/* 카드 충전 */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                카드 충전
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[1000, 5000, 10000, 20000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => rechargeCard(amount)}
                    disabled={
                      transaction.status === "processing" ||
                      transaction.status === "complete"
                    }
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-2 px-2 rounded-lg font-semibold transition-colors text-xs"
                  >
                    +{formatCurrency(amount)}
                  </button>
                ))}
              </div>
              <div className="mt-2 text-xs text-gray-600 text-center">
                현재 카드 잔고: {formatCurrency(state.cardBalance)}
              </div>
            </div>

            {/* 거스름돈 재고 정보 */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                거스름돈 재고
              </h3>
              <div className="space-y-2">
                {DENOMINATIONS.map((denomination) => (
                  <div
                    key={denomination}
                    className="flex justify-between text-sm"
                  >
                    <span>{formatCurrency(denomination)}:</span>
                    <span className="font-medium">
                      {state.changeInventory[denomination]}개
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 상태 정보 */}
            <div className="mt-6 p-3 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold mb-2 text-gray-600">
                거래 상태
              </h3>
              <div className="text-xs text-gray-600">
                {transaction.status === "idle" && "대기 중"}
                {transaction.status === "payment" && "결제 진행 중"}
                {transaction.status === "selection" && "음료 선택 완료"}
                {transaction.status === "processing" && "구매 처리 중"}
                {transaction.status === "complete" && "구매 완료"}
                {transaction.status === "error" && "오류 발생"}
              </div>
            </div>
          </div>
        </div>

        {/* 사용 설명 */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            사용 방법
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h3 className="font-semibold mb-2">현금 결제</h3>
              <ol className="list-decimal list-inside space-y-1">
                <li>원하는 금액의 현금을 투입하세요</li>
                <li>음료를 선택하세요</li>
                <li>"구매 확정" 버튼을 클릭하세요</li>
                <li>음료와 거스름돈을 받으세요</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold mb-2">카드 결제</h3>
              <ol className="list-decimal list-inside space-y-1">
                <li>원하는 음료를 선택하세요</li>
                <li>"카드 결제" 버튼을 클릭하세요</li>
                <li>결제 처리를 기다리세요</li>
                <li>음료를 받으세요</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
