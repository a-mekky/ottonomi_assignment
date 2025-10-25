import React, { useRef, useState } from 'react';
import { Upload, File, X } from 'lucide-react';
import { ALLOWED_FILE_TYPES, validateFileType, validateFileSize, MAX_FILE_SIZE_MB } from '../../utils/validators';

export function FileUpload({
    label,
    error,
    onChange,
    onError,   
    accept = '.pdf,.doc,.docx',
    required = false,
    className = ''
}) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);

    const handleFile = (file) => {
        if (file) {
            // Immediate validation with error handling
            if (!validateFileType(file, ALLOWED_FILE_TYPES)) {
                onError?.('Only PDF, DOC, and DOCX files are allowed');
                return; // Stop here, don't set file
            }
            if (!validateFileSize(file, MAX_FILE_SIZE_MB)) {
                onError?.(`File size must be less than ${MAX_FILE_SIZE_MB}MB`);
                return;
            }
            
            // Clear any previous errors and set valid file
            onError?.(null);  // Clear error
            setSelectedFile(file);
            onChange?.(file);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        onChange?.(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {!selectedFile ? (
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${dragActive
                        ? 'border-blue-500 bg-blue-50'
                        : error
                            ? 'border-red-300 hover:border-red-400 bg-red-50'
                            : 'border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-blue-50'
                        }`}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        className="hidden"
                        onChange={handleChange}
                        accept={accept}
                    />
                    <Upload className={`w-12 h-12 mx-auto mb-4 ${error ? 'text-red-400' : 'text-gray-400'
                        }`} />
                    <p className="text-gray-700 font-medium mb-1">
                        Drop your CV here or click to browse
                    </p>
                    <p className="text-sm text-gray-500">
                        PDF, DOC, DOCX (Max 5MB)
                    </p>
                </div>
            ) : (
                <div className="border-2 border-green-300 bg-green-50 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                            <File className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">{selectedFile.name}</p>
                            <p className="text-sm text-gray-600">
                                {selectedFile.size > 1024 * 1024
                                    ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
                                    : `${(selectedFile.size / 1024).toFixed(2)} KB`
                                }
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={removeFile}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            {error && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                    {error}
                </p>
            )}
        </div>
    );
}