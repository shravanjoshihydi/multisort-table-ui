import mongoose, { Document, Schema } from 'mongoose';

export type ClientType = 'Individual' | 'Company';

export interface IClient extends Document {
  clientId: number;
  name: string;
  type: ClientType;
  email: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<IClient>({
  clientId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['Individual', 'Company'], required: true },
  email: { type: String, required: true },
  status: { type: Boolean, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

export const Client = mongoose.model<IClient>('Client', ClientSchema);
