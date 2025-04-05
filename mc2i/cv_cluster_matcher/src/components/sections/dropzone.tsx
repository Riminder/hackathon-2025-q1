"use client"
import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { parseResume } from '@/app/actions/parse-resume';
import { motion } from 'framer-motion';
import { toast } from 'sonner'; 
import { FileText, Download } from '@/assets/svgs';

export default function DropzoneSection({ 
    onParseSuccess, 
    isLoading,
    setIsLoading 
  }: 
  { 
    onParseSuccess: (data: any) => void, 
    isLoading: boolean,
    setIsLoading: (loading: boolean) => void
  }) {

  const [parseResult, setParseResult] = useState(null);
  const [fileName, setFileName] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setIsLoading(true);
    setFileName(file.name);

    // Reset previous results when a new upload is attempted
    onParseSuccess(null); 
    
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('source_key', process.env.NEXT_PUBLIC_HRFLOW_SOURCE_KEY || '');
    
    try {
      const result = await parseResume(formData);
      
      if (result.success) {
        setParseResult(result.data);
        // Notify parent component about successful parsing
        onParseSuccess(result.data);
        // toast success message
        toast.success('CV Uploaded', {
          description: 'Your CV has been successfully uploaded'
        });
      } else {
        // Show error toast
        toast.error('Upload Failed', {
          description: result.error || 'Failed to parse resume'
        });
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while parsing the resume';
      // Show error toast
      toast.error('Upload Error', {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  }, [onParseSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    disabled: isLoading,
  });

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto rounded-2xl p-8 text-center cursor-pointer shadow-md bg-white"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div {...getRootProps()}>
        <form ref={formRef}>
          <input {...getInputProps()} />
        </form>
        <div className="flex items-center justify-center mb-4">
          {!isLoading && !parseResult ? (
            <motion.div 
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-inner bg-slate-100"
              animate={{ y: [0, -10, 0] }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            >
              <Download className="w-7 h-7 text-blue-400" />
            </motion.div>
            )
            : 
            <div className='flex items-center gap-2 py-3 px-5 bg-slate-100 rounded-xl'>
              <FileText className="h-5 w-5 text-blue-500" />
              <span className='font-semibold truncate max-w-xs'>{fileName}</span>
            </div>
          }
        </div>
        <h2 className="text-xl font-semibold tracking-tight mb-2">
          {!isLoading && !parseResult ? "Upload Your CV" : "CV Ready for Analysis"}
        </h2>
        <p className="text-slate-500 text-sm max-w-sm mx-auto text-semibold">
          {!isLoading && !parseResult ? 
            "Drag and drop your CV, or click to browse your files (PDF, DOC, DOCX)" 
              : 
            "Click to change the file if needed"
          }
        </p>
      </div>
    </motion.div>
  );
}