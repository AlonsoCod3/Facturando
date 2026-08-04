export interface Customer {
  id: number;
  name: string;
  docType: 'dni' | 'ruc';
  docNumber: string;
  phone: string;
  createdAt: Date;
  updatedAt?: Date;
}

export type CustomerForm = Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>;

export interface ReniecResponse {
  first_name: string;
  first_last_name: string;
  second_last_name: string;
  mother_last_name: string;
  father_last_name: string;
  document_number: string;
}

export interface SunatResponse {
  condicion: string;
  departamento: string;
  direccion: string;
  distrito: string;
  dpto:string;
  estado: string;
  lote:string;
  manzana:string;
  numero:string;
  numero_documento: string;
  provincia: string;
  razon_social: string;
  ubigeo: string;
}

export interface CustomerSearchResult {
  docType: 'dni' | 'ruc';
  docNumber: string;
  name: string;
  raw: ReniecResponse | SunatResponse;
}