import { useRef, useState } from 'react';
import { s } from '../styles/CreateTicketsModal.style';

interface Props {
  processFiles: (files: FileList | null) => void;
  MAX_SIZE_MB: number;
}

export const TicketDropzone = ({ processFiles, MAX_SIZE_MB }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragging, setDragging] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e: React.DragEvent) => {
    handleDrag(e);
    setDragging(false);
    processFiles(e.dataTransfer.files);
  };

  return (
    <div
      style={{ ...s.dropzone, ...(dragging ? s.dropzoneDragging : {}) }}
      onDragOver={handleDrag}
      onDragEnter={() => setDragging(true)}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => processFiles(e.target.files)}
      />
      
      <div style={s.dropzoneIcon}>
        <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke={dragging ? '#1D9E75' : '#aaa'} strokeWidth={1.5}>
          <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      </div>

      <div style={s.dropzoneText}>
        {dragging ? (
          "Suelta los archivos aquí"
        ) : (
          <>Arrastra archivos o <span style={{ color: '#1D9E75', fontWeight: 500 }}>haz clic para seleccionar</span></>
        )}
      </div>
      <div style={s.dropzoneHint}>PNG, JPG, GIF, PDF, DOC · máx. {MAX_SIZE_MB} MB</div>
    </div>
  );
};