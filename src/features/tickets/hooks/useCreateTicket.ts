import { useState, useCallback } from 'react';
import { MAX_SIZE_MB, ACCEPTED } from '../data/ticketConstants';
import { FileItem } from '../types/tickets.types';

export const useCreateTicket = (onSuccess: () => void) => {
    const [form, setForm] = useState({
        asunto: '',
        descripcion: '',
        prioridad: '',
        cliente: '',
        responsable: '',
        sucesos: ['', '', '', '', ''],
        comments: [],
        files: []
    });
    const [files, setFiles] = useState<FileItem[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSucesoChange = (index: number, value: string) => {
        const newSucesos = [...form.sucesos];
        newSucesos[index] = value;
        setForm(prev => ({ ...prev, sucesos: newSucesos }));
    };

    const processFiles = useCallback((rawFiles: FileList | null) => {
        if (!rawFiles) return;
        const MAX_BYTES = MAX_SIZE_MB * 1024 * 1024;
        const newItems: FileItem[] = Array.from(rawFiles).map(file => {
            const isImage = file.type.startsWith('image/');
            const error = !ACCEPTED.includes(file.type) 
                ? 'Tipo no permitido' 
                : file.size > MAX_BYTES 
                    ? `Max ${MAX_SIZE_MB}MB` 
                    : undefined;
            
            return { 
                id: crypto.randomUUID(), 
                file, 
                error, 
                preview: isImage ? URL.createObjectURL(file) : undefined 
            };
        });

        setFiles(prev => [...prev, ...newItems]);
    }, [setFiles]);

    return { form, files, submitting, setSubmitting, handleChange, handleSucesoChange, processFiles, setFiles };
}