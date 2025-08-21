export type ClientType = 'Individual' | 'Company';

export interface Client {
  _id: string;
  clientId: number;
  name: string;
  type: ClientType;
  email: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SortDirection = 'asc' | 'desc';

export interface SortCriterion {
  field: keyof Omit<Client, '_id'>;
  direction: SortDirection;
}
