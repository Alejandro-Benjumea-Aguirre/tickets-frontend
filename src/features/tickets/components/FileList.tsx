import { FileListProps } from '../types/tickets.types';

const FileList = ({ files, onRemove, formatSize, s }: FileListProps) => {
  return (
    <div style={s.fileList}>
      {files.map((item) => (
        <div key={item.id} style={{ ...s.fileItem, ...(item.error ? s.fileItemError : {}) }}>
          {item.preview ? (
            <img src={item.preview} alt={item.file.name} style={s.fileThumb} />
          ) : (
            <div style={s.fileIcon}>
              <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke={item.error ? '#A32D2D' : '#888'} strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          )}
          
          <div style={s.fileMeta}>
            <div style={s.fileName}>{item.file.name}</div>
            {item.error ? (
              <div style={s.fileError}>{item.error}</div>
            ) : (
              <div style={s.fileSize}>{formatSize(item.file.size)}</div>
            )}
          </div>

          <button type="button" style={s.fileRemove} onClick={() => onRemove(item.id)}>
            <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default FileList;