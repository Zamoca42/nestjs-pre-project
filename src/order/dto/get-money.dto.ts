export class Money {
  static currencyFormat(value: number): string {
    return Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(value);
  }
}
