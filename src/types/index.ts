export type UserRole = 'admin' | 'preparer' | 'reviewer';

export type DocumentStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

export interface TaxDocument {
  id: string;
  cchId: string;
  taxpayerName: string;
  clientEmail: string;
  preparerName: string;
  reviewerName: string;
  uploadDate: string;
  status: DocumentStatus;
  pagesProcessed: number;
  totalPages: number;
  emailOpened: boolean;
  isEnabled: boolean;
  sortedForms: number;
  unsortedForms: number;
  progress: number;
  extractedData?: ExtractedFormData[];
  customFields?: CustomField[];
}

export interface ExtractedFormData {
  id: string;
  formType: string;
  pageNumber: number;
  data: Record<string, string | number>;
}

export interface CustomField {
  id: string;
  key: string;
  value: string;
  formType: string;
}

export interface ActivityLogEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  documentName?: string;
}

export interface FormFile {
  id: string;
  fileName: string;
  formType: string;
  payer?: string;
  recipient?: string;
  isSorted: boolean;
}
