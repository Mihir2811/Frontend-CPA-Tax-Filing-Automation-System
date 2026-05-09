import { TaxDocument } from '@/types';
import { mockDocuments } from './mockData';

let documents: TaxDocument[] = [...mockDocuments];
let listeners: Array<() => void> = [];

export function getDocuments() {
  return documents;
}

export function addDocument(doc: TaxDocument) {
  documents = [doc, ...documents];
  listeners.forEach(fn => fn());
}

export function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(fn => fn !== listener);
  };
}
