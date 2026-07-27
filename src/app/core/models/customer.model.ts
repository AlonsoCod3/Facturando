export interface Customer {
    id: number;
    name: string;
    phone: string;
    createdAt: Date;
  }
  
  export type CustomerForm = Omit<Customer, 'createdAt'>;