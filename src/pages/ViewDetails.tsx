import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, FileText, Download, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { DocumentStatusBadge } from '@/components/StatusBadge';
import { mockDocuments } from '@/data/mockData';
import { CustomField } from '@/types';

export default function ViewDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const doc = mockDocuments.find(d => d.id === id);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [emailTo, setEmailTo] = useState(doc?.clientEmail || '');
  const [customFields, setCustomFields] = useState<CustomField[]>(doc?.customFields || []);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newFormType, setNewFormType] = useState('');

  if (!doc) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Document not found</p>
      </div>
    );
  }

  const addCustomField = () => {
    if (!newKey.trim() || !newValue.trim()) return;
    setCustomFields(prev => [...prev, { id: crypto.randomUUID(), key: newKey, value: newValue, formType: newFormType || 'General' }]);
    setNewKey('');
    setNewValue('');
    setNewFormType('');
  };

  const removeCustomField = (cfId: string) => {
    setCustomFields(prev => prev.filter(f => f.id !== cfId));
  };

  const generateSummaryText = () => {
    let summary = `TAX DOCUMENT SUMMARY\n${'='.repeat(50)}\n`;
    summary += `Taxpayer: ${doc.taxpayerName}\n`;
    summary += `CCH ID: ${doc.cchId}\nTax Year: 2024\nStatus: ${doc.status}\n\n`;
    if (doc.extractedData) {
      doc.extractedData.forEach(form => {
        summary += `--- ${form.formType} (Page ${form.pageNumber}) ---\n`;
        Object.entries(form.data).forEach(([k, v]) => {
          summary += `  ${k}: ${v}\n`;
        });
        summary += '\n';
      });
    }
    if (customFields.length > 0) {
      summary += `--- Custom Fields ---\n`;
      customFields.forEach(cf => {
        summary += `  [${cf.formType}] ${cf.key}: ${cf.value}\n`;
      });
    }
    return summary;
  };

  const handleDownload = () => {
    const text = generateSummaryText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.taxpayerName.replace(/\s+/g, '_')}_Tax_Summary_2024.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{doc.taxpayerName}</h1>
            <p className="text-sm text-muted-foreground">CCH ID: {doc.cchId} · Tax Year 2024</p>
          </div>
          <DocumentStatusBadge status={doc.status} />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => setEmailModalOpen(true)}>
            <Mail className="h-4 w-4 mr-1" /> Send Email
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSummaryModalOpen(true)}>
            <FileText className="h-4 w-4 mr-1" /> View Summary
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" /> Download
          </Button>
        </div>
      </div>

      {/* Accordions */}
      <Accordion type="multiple" defaultValue={["extracted", "custom", "organize"]} className="space-y-4">
        {/* Extracted Tax Forms */}
        <AccordionItem value="extracted" className="rounded-lg border border-border bg-card shadow-card px-4">
          <AccordionTrigger className="text-base font-semibold">
            Extracted Tax Forms ({doc.extractedData?.length || 0})
          </AccordionTrigger>
          <AccordionContent>
            {doc.extractedData && doc.extractedData.length > 0 ? (
              <div className="space-y-4 pb-4">
                {doc.extractedData.map((form) => (
                  <div key={form.id} className="rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                          {form.formType}
                        </span>
                        <span className="text-xs text-muted-foreground">Page {form.pageNumber}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(form.data).map(([key, value]) => (
                        <div key={key} className="flex justify-between border-b border-border/50 pb-2 last:border-0">
                          <span className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="text-sm font-medium text-foreground">
                            {typeof value === 'number' ? `$${value.toLocaleString()}` : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-sm text-muted-foreground">No extracted data available</p>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Custom Fields */}
        <AccordionItem value="custom" className="rounded-lg border border-border bg-card shadow-card px-4">
          <AccordionTrigger className="text-base font-semibold">
            Custom Fields ({customFields.length})
          </AccordionTrigger>
          <AccordionContent>
            <div className="pb-4 space-y-4">
              {customFields.length > 0 && (
                <div className="space-y-2">
                  {customFields.map((cf) => (
                    <div key={cf.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">{cf.formType}</span>
                      <span className="text-sm text-muted-foreground">{cf.key}:</span>
                      <span className="text-sm font-medium text-foreground">{cf.value}</span>
                      <Button variant="ghost" size="sm" className="ml-auto h-7 w-7 p-0 text-destructive" onClick={() => removeCustomField(cf.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex flex-col sm:flex-row items-end gap-2 pt-2 border-t border-border">
                <div className="flex-1 w-full">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Form Type</label>
                  <Input value={newFormType} onChange={(e) => setNewFormType(e.target.value)} placeholder="e.g. W-2" className="h-9" />
                </div>
                <div className="flex-1 w-full">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Key</label>
                  <Input value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="Field name" className="h-9" />
                </div>
                <div className="flex-1 w-full">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Value</label>
                  <Input value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="Field value" className="h-9" />
                </div>
                <Button size="sm" onClick={addCustomField} className="h-9">
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Organize Forms */}
        <AccordionItem value="organize" className="rounded-lg border border-border bg-card shadow-card px-4">
          <AccordionTrigger className="text-base font-semibold">
            Organize Forms (Sorted: {doc.sortedForms} · Unsorted: {doc.unsortedForms})
          </AccordionTrigger>
          <AccordionContent>
            <div className="pb-4">
              <p className="text-sm text-muted-foreground mb-3">
                View and manage uploaded forms for this client.
              </p>
              <Button variant="outline" size="sm" onClick={() => navigate(`/client-forms/${doc.id}`)}>
                <FileText className="h-4 w-4 mr-1" /> Open Form Manager
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Email Modal */}
      <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Tax Report via Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email Address</label>
              <Input value={emailTo} onChange={(e) => setEmailTo(e.target.value)} placeholder="recipient@example.com" />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setEmailModalOpen(false)}>Cancel</Button>
              <Button onClick={() => setEmailModalOpen(false)}>
                <Mail className="h-4 w-4 mr-1" /> Send Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Summary Modal */}
      <Dialog open={summaryModalOpen} onOpenChange={setSummaryModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tax Document Summary — {doc.taxpayerName}</DialogTitle>
          </DialogHeader>
          <pre className="mt-4 whitespace-pre-wrap text-sm font-mono bg-muted/50 rounded-lg p-4 border border-border text-foreground">
            {generateSummaryText()}
          </pre>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setSummaryModalOpen(false)}>Close</Button>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" /> Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
