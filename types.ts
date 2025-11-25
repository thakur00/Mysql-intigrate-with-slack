export enum View {
  SIMULATOR = 'SIMULATOR',
  ARCHITECTURE = 'ARCHITECTURE',
  README = 'README',
}

export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text?: string;
  data?: any[]; // For tabular SQL results
  timestamp: Date;
  isError?: boolean;
}

export interface QueryStats {
  executionTime: number; // ms
  rowsAffected: number;
}
