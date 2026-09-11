export interface PaymentAmounts {
  membershipAmount: number;
  onetimeAmount: number;
  totalAmount: number;
}

export interface PaymentsByStyle extends PaymentAmounts {
  key: string;
  styleId: string | null;
  styleName: string;
  membershipCount: number;
  onetimeCount: number;
  totalCount: number;
}

export interface PaymentsByDate extends PaymentAmounts {
  date: string;
}

export interface PaymentsReport extends PaymentAmounts {
  membershipCount: number;
  onetimeCount: number;
  byStyle: PaymentsByStyle[];
  byDate: PaymentsByDate[];
}
