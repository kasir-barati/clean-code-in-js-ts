export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESSFUL = 'successful',
  FAILED = 'failed',
  OUT_OF_CALCULATION = 'out_of_calculation',
}
export enum PaymentLabel {
  'charge-account' = 'charge-account',
  'charged-by-admin' = 'charged-by-admin',
  'decrease-due-to-x' = 'decrease-due-to-x',
  'decrease-urgency-charge' = 'decrease-urgency-charge',
}
export interface Payment extends Document {
  _id: string;
  amount: number;
  status: PaymentStatus;
  userId: string;
  label: PaymentLabel[];
  description: string;
  discountId?: string;
  userCreditBeforePayment: number;
  paymentGateWayData: {
    refId: string;
    authority: string;
    createPaymentGateway?: string[];
    verifyPayment?: string[];
  };
  createdAt?: Date | any;
  updatedAt?: Date | any;
}
