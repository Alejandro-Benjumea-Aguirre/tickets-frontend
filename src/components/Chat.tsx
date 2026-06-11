import React, { useState, useEffect, useRef, KeyboardEvent, ChangeEvent } from 'react';
import { useSocket, Message } from '../hooks/useSocket';

// 1. Definir la interfaz para los Props del componente
interface ChatProps {
  currentUser: string;
}

export const Chat: React.FC<ChatProps> = ({ currentUser }) => {
  const [input, setInput] = useState<string>('');
  const { messages, sendMessage } = useSocket(currentUser);
  
  // Referencia para controlar el scroll automático del contenedor de mensajes
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 2. UX: Scroll automático al recibir o enviar un nuevo mensaje
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = (): void => {
    const cleanInput = input.trim();
    if (!cleanInput) return;

    sendMessage(cleanInput, currentUser);
    setInput('');
  };

  // Manejar el evento de teclado de forma segura en TS
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Evita comportamientos extraños en inputs/formularios
      handleSend();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value);
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-md mx-auto border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden">
      
      {/* HEADER DE LA VENTANA DE CHAT (UI/UX) */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-150 flex items-center gap-3">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <div>
          <h3 className="text-sm font-semibold text-gray-800">Canal de Soporte / Mensajería</h3>
          <p className="text-xs text-gray-500">Conectado como: {currentUser}</p>
        </div>
      </div>

      {/* ÁREA DE MENSAJES (Con scroll independiente) */}
      <div 
        ref={containerRef}
        className="flex-1 p-4 overflow-y-auto bg-gray-50/50 space-y-3 custom-scrollbar"
      >
        {/* UX: Estado vacío si no hay interacciones previas */}
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <span className="text-2xl text-gray-400 mb-1">💬</span>
            <p className="text-sm font-medium text-gray-600">No hay mensajes aún</p>
            <p className="text-xs text-gray-400 max-w-[200px] mt-0.5">Sé el primero en escribir para iniciar la conversación.</p>
          </div>
        ) : (
          messages.map((msg: Message, i: number) => {
            const isMine = msg.user === currentUser;
            return (
              <div 
                key={i} 
                className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
              >
                {/* Nombre del remitente (Solo se muestra si es del otro usuario para limpiar la UI) */}
                {!isMine && (
                  <span className="text-xs font-medium text-gray-500 ml-1 mb-1">
                    {msg.user}
                  </span>
                )}

                {/* Burbuja del mensaje */}
                <div 
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm shadow-sm transition-all break-words
                    ${isMine 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                    }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  
                  {/* UX: Formatear y mostrar la estampa de tiempo legible en la esquina inferior */}
                  <div className={`text-[10px] mt-1 text-right block select-none ${isMine ? 'text-blue-200' : 'text-gray-400'}`}>
                    {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        {/* Div pivote para forzar el scroll inferior */}
        <div ref={messagesEndRef} />
      </div>

      {/* FORMULARIO DE ACCIÓN / INPUT */}
      <div className="p-3 bg-white border-t border-gray-100">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-400 py-1"
            maxLength={1000} // UX: Previene cargas excesivas maliciosas
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all
              ${input.trim() 
                ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-sm' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            Enviar
          </button>
        </div>
      </div>

    </div>
  );
};