import DashboardLayout from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { FileText, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UploadData() {
  const { pdfs, addPdf, removePdf } = useApp();

  const handleAdd = () => {
    if (pdfs.length >= 2) return;
    const mock = pdfs.length === 0
      ? { name: "services-catalog.pdf", size: 2400000 }
      : { name: "patient-guide.pdf", size: 1800000 };
    addPdf(mock.name, mock.size);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Upload Data</h1>
          <p className="text-muted-foreground text-sm">Upload up to 2 PDF files (max 50MB each) to train your chatbot.</p>
        </div>

        <div className="space-y-3">
          {pdfs.map((pdf, i) => (
            <div key={i} className="glass rounded-xl p-4 flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">{pdf.name}</p>
                <p className="text-xs text-muted-foreground">{(pdf.size / 1024 / 1024).toFixed(1)} MB</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removePdf(i)} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {pdfs.length < 2 && (
          <button onClick={handleAdd} className="w-full border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-primary/30 transition-colors">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium">Click to upload PDF</p>
            <p className="text-xs text-muted-foreground mt-1">Max 50MB per file</p>
          </button>
        )}

        {pdfs.length >= 2 && (
          <p className="text-sm text-muted-foreground text-center">Maximum 2 files reached. Remove a file to upload a new one.</p>
        )}
      </div>
    </DashboardLayout>
  );
}
