import { TaxDocument, User, ActivityLogEntry, FormFile, ExtractedFormData, CustomField } from '@/types';

export const mockUsers: User[] = [
  { id: '1', username: 'mpanchal', firstName: 'Mihir', lastName: 'Panchal', email: 'mihir@cpa.com', role: 'admin', isActive: true },
  { id: '2', username: 'asharma', firstName: 'Anita', lastName: 'Sharma', email: 'anita@cpa.com', role: 'preparer', isActive: true },
  { id: '3', username: 'vdesai', firstName: 'Vikram', lastName: 'Desai', email: 'vikram@cpa.com', role: 'reviewer', isActive: true },
  { id: '4', username: 'pgupta', firstName: 'Priya', lastName: 'Gupta', email: 'priya@cpa.com', role: 'preparer', isActive: false },
];

export const mockDocuments: TaxDocument[] = [
  {
    id: '1', cchId: 'CCH-2024-0001', taxpayerName: 'Suresh Mehta', clientEmail: 'suresh.mehta@email.com',
    preparerName: 'Anita Sharma', reviewerName: 'Vikram Desai', uploadDate: '2024-12-15T10:30:00',
    status: 'completed', pagesProcessed: 21, totalPages: 21, emailOpened: true, isEnabled: true,
    sortedForms: 8, unsortedForms: 2, progress: 100,
    extractedData: [
      { id: 'e1', formType: 'W-2', pageNumber: 1, data: { employer: 'Tech Corp', wages: '85000', federalTax: '15200', stateTax: '4800', socialSecurity: '5270', medicare: '1232' } },
      { id: 'e2', formType: '1099-INT', pageNumber: 3, data: { payer: 'First National Bank', interest: '1250', earlyWithdrawal: '0', taxExemptInterest: '0' } },
      { id: 'e3', formType: '1099-DIV', pageNumber: 5, data: { payer: 'Vanguard', ordinaryDividends: '3200', qualifiedDividends: '2800', capitalGains: '1500' } },
      { id: 'e4', formType: '1098', pageNumber: 7, data: { lender: 'Wells Fargo', mortgageInterest: '12500', propertyTax: '4200', insurancePremiums: '1800' } },
    ],
    customFields: [
      { id: 'c1', key: 'Estimated Payments Q1', value: '$5,000', formType: 'W-2' },
      { id: 'c2', key: 'HSA Contribution', value: '$3,650', formType: '1099-INT' },
    ],
  },
  {
    id: '2', cchId: 'CCH-2024-0002', taxpayerName: 'Kavita Reddy', clientEmail: 'kavita.reddy@email.com',
    preparerName: 'Anita Sharma', reviewerName: 'Vikram Desai', uploadDate: '2024-12-14T14:15:00',
    status: 'processing', pagesProcessed: 10, totalPages: 18, emailOpened: false, isEnabled: true,
    sortedForms: 5, unsortedForms: 4, progress: 56,
  },
  {
    id: '3', cchId: 'CCH-2024-0003', taxpayerName: 'Amit Joshi', clientEmail: 'amit.joshi@email.com',
    preparerName: 'Rajendra Patel', reviewerName: 'Vikram Desai', uploadDate: '2024-12-13T09:00:00',
    status: 'pending', pagesProcessed: 0, totalPages: 15, emailOpened: false, isEnabled: false,
    sortedForms: 0, unsortedForms: 0, progress: 0,
  },
  {
    id: '4', cchId: 'CCH-2024-0004', taxpayerName: 'Neha Kapoor', clientEmail: 'neha.kapoor@email.com',
    preparerName: 'Anita Sharma', reviewerName: 'Vikram Desai', uploadDate: '2024-12-12T16:45:00',
    status: 'completed', pagesProcessed: 11, totalPages: 11, emailOpened: true, isEnabled: true,
    sortedForms: 6, unsortedForms: 1, progress: 100,
  },
  {
    id: '5', cchId: 'CCH-2024-0005', taxpayerName: 'Rohit Malhotra', clientEmail: 'rohit.malhotra@email.com',
    preparerName: 'Rajendra Patel', reviewerName: 'Vikram Desai', uploadDate: '2024-12-11T11:30:00',
    status: 'failed', pagesProcessed: 5, totalPages: 20, emailOpened: false, isEnabled: true,
    sortedForms: 2, unsortedForms: 3, progress: 25,
  },
  {
    id: '6', cchId: 'CCH-2024-0006', taxpayerName: 'Deepa Iyer', clientEmail: 'deepa.iyer@email.com',
    preparerName: 'Anita Sharma', reviewerName: 'Vikram Desai', uploadDate: '2024-12-10T08:00:00',
    status: 'completed', pagesProcessed: 14, totalPages: 14, emailOpened: false, isEnabled: true,
    sortedForms: 7, unsortedForms: 0, progress: 100,
  },
];

export const mockActivityLog: ActivityLogEntry[] = [
  { id: '1', action: 'Document Uploaded', user: 'Anita Sharma', timestamp: '2024-12-15T10:30:00', details: 'Uploaded tax organizer for Suresh Mehta', documentName: 'Mehta_2024_Organizer.pdf' },
  { id: '2', action: 'Extraction Completed', user: 'System', timestamp: '2024-12-15T10:35:00', details: 'Successfully extracted 21 pages for Suresh Mehta', documentName: 'Mehta_2024_Organizer.pdf' },
  { id: '3', action: 'Email Sent', user: 'Anita Sharma', timestamp: '2024-12-15T10:40:00', details: 'Sent tax summary email to suresh.mehta@email.com', documentName: 'Mehta_2024_Organizer.pdf' },
  { id: '4', action: 'Document Uploaded', user: 'Anita Sharma', timestamp: '2024-12-14T14:15:00', details: 'Uploaded tax organizer for Kavita Reddy', documentName: 'Reddy_2024_Organizer.pdf' },
  { id: '5', action: 'User Created', user: 'Rajendra Patel', timestamp: '2024-12-14T09:00:00', details: 'Created new preparer account for Priya Gupta' },
  { id: '6', action: 'Document Uploaded', user: 'Rajendra Patel', timestamp: '2024-12-13T09:00:00', details: 'Uploaded tax organizer for Amit Joshi', documentName: 'Joshi_2024_Organizer.pdf' },
  { id: '7', action: 'Extraction Failed', user: 'System', timestamp: '2024-12-11T11:35:00', details: 'Failed to extract pages for Rohit Malhotra - corrupt PDF', documentName: 'Malhotra_2024_Organizer.pdf' },
  { id: '8', action: 'Form Sorted', user: 'Anita Sharma', timestamp: '2024-12-10T08:30:00', details: 'Moved W-2 form to sorted section for Deepa Iyer', documentName: 'Iyer_2024_Organizer.pdf' },
];

export const mockFormFiles: FormFile[] = [
  { id: 'f1', fileName: 'TechCorp-SMehta-W2.pdf', formType: 'W-2', payer: 'Tech Corp', recipient: 'Suresh Mehta', isSorted: true },
  { id: 'f2', fileName: 'FirstNational-SMehta-1099INT.pdf', formType: '1099-INT', payer: 'First National Bank', recipient: 'Suresh Mehta', isSorted: true },
  { id: 'f3', fileName: 'Vanguard-SMehta-1099DIV.pdf', formType: '1099-DIV', payer: 'Vanguard', recipient: 'Suresh Mehta', isSorted: true },
  { id: 'f4', fileName: 'WellsFargo-SMehta-1098.pdf', formType: '1098', payer: 'Wells Fargo', recipient: 'Suresh Mehta', isSorted: true },
  { id: 'f5', fileName: 'Unknown_Page8.pdf', formType: 'Unknown', isSorted: false },
  { id: 'f6', fileName: 'Unknown_Page12.pdf', formType: 'Unknown', isSorted: false },
  { id: 'f7', fileName: 'Fidelity-SMehta-1099B.pdf', formType: '1099-B', payer: 'Fidelity', recipient: 'Suresh Mehta', isSorted: true },
  { id: 'f8', fileName: 'SSA-SMehta-SSA1099.pdf', formType: 'SSA-1099', payer: 'SSA', recipient: 'Suresh Mehta', isSorted: true },
];

export const currentUser: User = mockUsers[0];
