import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { addDocument } from '@/data/documentStore';
import { TaxDocument } from '@/types';

interface UploadedFile {
  file: File;
  id: string;
}

export default function UploadPage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList)
      .filter(f => f.type === 'application/pdf')
      .map(f => ({ file: f, id: crypto.randomUUID() }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  const removeFile = (id: string) => setFiles(prev => prev.filter(f => f.id !== id));

  const processDocuments = () => {
    setIsProcessing(true);
    setProgress(0);
    const filesToProcess = [...files];
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Add each uploaded file as a new document entry
            filesToProcess.forEach(f => {
              const name = f.file.name.replace(/\.pdf$/i, '').replace(/[_-]/g, ' ');
              const newDoc: TaxDocument = {
                id: crypto.randomUUID(),
                cchId: `CCH-2024-${String(Math.floor(Math.random() * 9000) + 1000)}`,
                taxpayerName: name,
                clientEmail: `${name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
                preparerName: 'Anita Sharma',
                reviewerName: 'Vikram Desai',
                uploadDate: new Date().toISOString(),
                status: 'processing',
                pagesProcessed: 0,
                totalPages: Math.floor(Math.random() * 20) + 5,
                emailOpened: false,
                isEnabled: true,
                sortedForms: 0,
                unsortedForms: 0,
                progress: 0,
              };
              addDocument(newDoc);
            });
            setIsProcessing(false);
            setFiles([]);
            navigate('/dashboard');
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className="p-6 animate-fade-in max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-2">Upload Documents</h1>
      <p className="text-sm text-muted-foreground mb-8">Upload PDF tax organizers for AI-powered extraction</p>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 cursor-pointer transition-colors ${
          dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'
        }`}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
          <Upload className="h-8 w-8 text-primary" />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">Drop PDF files here or click to browse</p>
        <p className="text-xs text-muted-foreground">Supports multiple PDF files</p>
        <input ref={inputRef} type="file" accept=".pdf" multiple onChange={(e) => e.target.files && addFiles(e.target.files)} className="hidden" />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Selected Files ({files.length})</h3>
          {files.map((f) => (
            <div key={f.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">{f.file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatSize(f.file.size)}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeFile(f.id)} className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button onClick={processDocuments} className="w-full h-11 mt-4 bg-success hover:bg-success/90 text-success-foreground font-semibold">
            Process Documents
          </Button>
        </div>
      )}

      {/* Processing Modal */}
      <Dialog open={isProcessing} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
          <div className="flex flex-col items-center py-6">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Processing Documents</h3>
            <p className="text-sm text-muted-foreground mb-6">Extracting tax form data...</p>
            <div className="w-full flex items-center gap-3">
              <Progress value={progress} className="flex-1 h-3" />
              <span className="text-sm font-semibold text-foreground">{progress}%</span>
            </div>
            <div className="mt-4 w-full space-y-1">
              {files.map((f) => (
                <p key={f.id} className="text-xs text-muted-foreground truncate">📄 {f.file.name}</p>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
