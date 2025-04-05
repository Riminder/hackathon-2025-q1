"use client"
import { useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { parseResume } from '@/app/actions/parse-resume';
import { motion } from 'framer-motion';
import { toast } from 'sonner'; 
import { FileText, Download } from '@/assets/svgs';
import ResumePreview from '../resume-preview';
import { cn } from '@/lib/utils';

export default function DropzoneSection({ 
    onParseSuccess, 
    isLoading,
    setIsLoading,
    parsedProfile,
    setParsedProfile
  }: 
  { 
    onParseSuccess: (data: any) => void, 
    isLoading: boolean,
    setIsLoading: (loading: boolean) => void,
    parsedProfile: any,
    setParsedProfile: (profile: any) => void
  }) {

  const formRef = useRef<HTMLFormElement>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setIsLoading(true);
    // Reset previous results when a new upload is attempted
    onParseSuccess(null); 
    
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('source_key', '98ef0e9ed130f2fe9fe85b01b082811ad89e6c01');
    
    try {
      const result = await parseResume(formData);
      
      if (result.success) {
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
    <div className='w-full'>
      {!parsedProfile ? (
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
              {!isLoading ? (
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
                <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-inner bg-slate-100">
                  <div className="flex flex-row gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-.3s]"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-.5s]"></div>
                  </div>
                </div>
              }
            </div>
            <h2 className="text-xl font-semibold tracking-tight mb-2">
              {!isLoading ? "Upload Your CV" : "Please wait we're analyzing your CV"}
            </h2>
            <p className={cn("text-slate-500 text-sm max-w-sm mx-auto text-semibold", isLoading && "hidden")}>
              Drag and drop your CV, or click to browse your files (PDF, DOC, DOCX)
            </p>
          </div>
        </motion.div>
      ) : (
        <div className='w-1/2 mx-auto'>
          <div className="relative w-fit">
            <div className="absolute top-0 left-0 w-full h-full rounded-md bg-white border border-gray-100 z-[0] rotate-[4deg]"></div>
            <div className="absolute top-0 left-0 w-full h-full rounded-md bg-white border border-gray-200 z-[1] rotate-[2deg]"></div>
            <div className="relative z-[2] bg-white rounded-md p-6 shadow-xs w-[600px] border border-gray-300">
              <ResumePreview 
                onClose={() => {
                  setParsedProfile(null);
                  onParseSuccess(null);
                }} 
                parsedProfile={parsedProfile}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}