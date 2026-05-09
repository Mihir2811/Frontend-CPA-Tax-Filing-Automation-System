import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, FileText, FolderOpen, AlertTriangle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { mockFormFiles, mockDocuments } from '@/data/mockData';
import { FormFile } from '@/types';

const FORM_TYPES = ['W-2', '1099-INT', '1099-DIV', '1099-R', '1099-B', '1099-MISC', '1099-NEC', '1099-K', '1099-G', '1099-Q', 'SSA-1099', '1098', '1098-T', '1098-E', 'K-1', 'Schedule C'];

export default function ClientForms() {
  const { id } = useParams();
  const navigate = useNavigate();
  const doc = mockDocuments.find(d => d.id === id);
  const [files, setFiles] = useState<FormFile[]>(mockFormFiles);
  const [sortingFileId, setSortingFileId] = useState<string | null>(null);
  const [selectedFormType, setSelectedFormType] = useState<string>('');
  const [viewingFile, setViewingFile] = useState<FormFile | null>(null);

  const sorted = files.filter(f => f.isSorted);
  const unsorted = files.filter(f => !f.isSorted);

  const startSort = (fileId: string) => {
    setSortingFileId(fileId);
    setSelectedFormType('');
  };

  const confirmSort = () => {
    if (!sortingFileId || !selectedFormType) return;
    setFiles(prev => prev.map(f => {
      if (f.id !== sortingFileId) return f;
      const newName = `${selectedFormType.replace(/[^a-zA-Z0-9]/g, '')}-${doc?.taxpayerName.replace(/\s+/g, '')}-${selectedFormType}.pdf`;
      return { ...f, isSorted: true, formType: selectedFormType, fileName: newName };
    }));
    setSortingFileId(null);
    setSelectedFormType('');
  };

  const moveToUnsorted = (fileId: string) => {
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, isSorted: false } : f));
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(id ? `/details/${id}` : '/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Form Manager</h1>
          <p className="text-sm text-muted-foreground">{doc?.taxpayerName || 'Client'} · Organize uploaded forms</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sorted */}
        <div className="rounded-lg border border-border bg-card shadow-card">
          <div className="flex items-center gap-2 border-b border-border p-4 bg-success/5">
            <FolderOpen className="h-5 w-5 text-success" />
            <h2 className="text-base font-semibold text-foreground">Sorted Forms ({sorted.length})</h2>
          </div>
          <div className="p-4 space-y-2">
            {sorted.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">No sorted forms</p>}
            {sorted.map(file => (
              <div key={file.id} className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="h-5 w-5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{file.fileName}</p>
                    <p className="text-xs text-muted-foreground">{file.formType}{file.payer ? ` · ${file.payer}` : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => setViewingFile(file)} className="h-8 w-8 p-0 text-muted-foreground hover:text-primary">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => moveToUnsorted(file.id)} className="h-8 w-8 p-0 text-muted-foreground hover:text-warning">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unsorted */}
        <div className="rounded-lg border border-border bg-card shadow-card">
          <div className="flex items-center gap-2 border-b border-border p-4 bg-warning/5">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <h2 className="text-base font-semibold text-foreground">Unidentified Forms ({unsorted.length})</h2>
          </div>
          <div className="p-4 space-y-2">
            {unsorted.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">All forms have been sorted!</p>}
            {unsorted.map(file => (
              <div key={file.id} className="flex items-center justify-between rounded-lg border border-warning/30 bg-warning/5 p-3 hover:bg-warning/10 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="h-5 w-5 text-warning shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{file.fileName}</p>
                    <p className="text-xs text-muted-foreground">{file.formType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => setViewingFile(file)} className="h-8 w-8 p-0 text-muted-foreground hover:text-primary">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => startSort(file.id)} className="h-8 text-xs gap-1 text-success hover:text-success">
                    <ArrowLeft className="h-3.5 w-3.5" /> Sort
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sort Form Type Selection Dialog */}
      <Dialog open={!!sortingFileId} onOpenChange={(open) => { if (!open) setSortingFileId(null); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Select Form Type</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Choose the correct form type so the file can be renamed and sorted properly.</p>
          <Select value={selectedFormType} onValueChange={setSelectedFormType}>
            <SelectTrigger><SelectValue placeholder="Select form type..." /></SelectTrigger>
            <SelectContent>
              {FORM_TYPES.map(ft => (
                <SelectItem key={ft} value={ft}>{ft}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setSortingFileId(null)}>Cancel</Button>
            <Button onClick={confirmSort} disabled={!selectedFormType}>Confirm & Sort</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* PDF Viewer Dialog */}
      <Dialog open={!!viewingFile} onOpenChange={(open) => { if (!open) setViewingFile(null); }}>
        <DialogContent className="sm:max-w-3xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>{viewingFile?.fileName}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 flex items-center justify-center bg-muted/30 rounded-lg border border-border h-full min-h-[400px]">
            <div className="text-center p-8">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm font-medium text-foreground mb-1">{viewingFile?.fileName}</p>
              <p className="text-xs text-muted-foreground">PDF preview would render here in production.</p>
              <p className="text-xs text-muted-foreground mt-1">Form Type: {viewingFile?.formType}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
