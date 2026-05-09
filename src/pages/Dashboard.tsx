import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, FileText, Trash2, ChevronLeft, ChevronRight, FolderOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { DocumentStatusBadge } from '@/components/StatusBadge';
import { getDocuments, subscribe } from '@/data/documentStore';
import { TaxDocument, DocumentStatus } from '@/types';

export default function Dashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [documents, setDocuments] = useState<TaxDocument[]>(getDocuments());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    return subscribe(() => setDocuments([...getDocuments()]));
  }, []);

  const filtered = documents.filter((doc) => {
    const matchesSearch = doc.taxpayerName.toLowerCase().includes(search.toLowerCase()) ||
      doc.cchId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleDocument = (id: string) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, isEnabled: !d.isEnabled } : d));
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Documents</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} documents found</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or CCH ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="pl-10 h-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-full sm:w-44 h-10">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">On/Off</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">CCH ID</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Taxpayer Name</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Client Email</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Preparer</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Reviewer</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Upload Date</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Progress</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Pages</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Sorted</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Unsorted</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((doc) => (
              <tr key={doc.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <Switch checked={doc.isEnabled} onCheckedChange={() => toggleDocument(doc.id)} />
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{doc.cchId}</td>
                <td className="px-4 py-3 font-medium text-foreground">{doc.taxpayerName}</td>
                <td className="px-4 py-3 text-muted-foreground">{doc.clientEmail}</td>
                <td className="px-4 py-3 text-muted-foreground">{doc.preparerName}</td>
                <td className="px-4 py-3 text-muted-foreground">{doc.reviewerName}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(doc.uploadDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-4 py-3"><DocumentStatusBadge status={doc.status} /></td>
                <td className="px-4 py-3 min-w-[120px]">
                  <div className="flex items-center gap-2">
                    <Progress value={doc.progress} className="h-2 flex-1" />
                    <span className="text-xs font-medium text-muted-foreground">{doc.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{doc.pagesProcessed}/{doc.totalPages}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 text-success font-medium">
                    <FolderOpen className="h-3 w-3" /> {doc.sortedForms}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 text-warning font-medium">
                    <FolderOpen className="h-3 w-3" /> {doc.unsortedForms}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/details/${doc.id}`)} className="h-8 text-xs gap-1">
                      <FileText className="h-3.5 w-3.5" /> View Summary
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive" onClick={() => { setDocuments(prev => prev.filter(d => d.id !== doc.id)); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(i + 1)}
                className="h-8 w-8 p-0"
              >
                {i + 1}
              </Button>
            ))}
            <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
