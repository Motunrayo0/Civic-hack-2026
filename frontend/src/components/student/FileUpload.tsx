import { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Card from '../ui/Card';
import { uploadStudentNote } from '../../services/api';

interface FileUploadProps {
    studentName: string;
    className: string;
    courseName?: string;
    topic: string;
}

export default function FileUpload({ studentName, className, courseName, topic }: FileUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setStatus('idle');
            setErrorMessage('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setStatus('uploading');
        try {
            await uploadStudentNote(studentName, className, topic, file);
            setStatus('success');
            setFile(null);
        } catch (err: any) {
            setStatus('error');
            setErrorMessage(err.message || 'An error occurred during upload.');
        }
    };

    return (
        <Card className="mb-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <UploadCloud size={20} className="text-indigo-primary" />
                    <h2 className="font-serif text-xl text-gray-900">Upload Your Notes</h2>
                </div>
                {courseName && (
                    <span className="text-xs font-medium text-indigo-primary bg-indigo-50 px-3 py-1 rounded-full">
                        {courseName}
                    </span>
                )}
            </div>

            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 relative transition-colors hover:border-indigo-primary/50">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={status === 'uploading'}
                />

                {file ? (
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-900 mb-1">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-600 mb-1">Click or drag `.docx` file here</p>
                        <p className="text-xs text-gray-400">Supported formats: Word Document</p>
                    </div>
                )}
            </div>

            <div className="mt-4 flex flex-col items-center">
                {status === 'idle' && (
                    <button
                        onClick={handleUpload}
                        disabled={!file}
                        className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors ${file
                            ? 'bg-indigo-primary text-white hover:bg-indigo-secondary'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        Submit for AI Analysis
                    </button>
                )}

                {status === 'uploading' && (
                    <div className="flex items-center gap-2 text-indigo-primary text-sm font-medium">
                        <Loader2 size={16} className="animate-spin" />
                        Analyzing document with AI...
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium mb-2">
                            <CheckCircle size={16} />
                            Successfully merged into Classroom Pulse
                        </div>
                        <button
                            onClick={() => setStatus('idle')}
                            className="text-xs text-indigo-primary hover:underline hover:text-indigo-secondary transition-colors"
                        >
                            Upload another
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center w-full">
                        <div className="flex items-center gap-2 text-rose-600 text-sm font-medium mb-2 w-full justify-center">
                            <AlertCircle size={16} />
                            {errorMessage}
                        </div>
                        <button
                            onClick={() => setStatus('idle')}
                            className="text-xs text-indigo-primary hover:underline hover:text-indigo-secondary transition-colors"
                        >
                            Try again
                        </button>
                    </div>
                )}
            </div>
        </Card>
    );
}
