import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast'; // Importamos toast

export interface Message {
  text: string;
  user: string;
  time: string;
}

export interface TicketNotification {
  id: number;
  titulo: string;
  creadoPor: string;
  fecha: string;
}

interface ServerToClientEvents {
  receive_message: (msg: Message) => void;
  ticket_created: (ticket: TicketNotification) => void; // <-- NUEVO EVENTO
}

interface ServerToClientEvents {
  receive_message: (msg: Message) => void;
}

interface ClientToServerEvents {
  send_message: (msg: Message) => void;
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:3001');

interface UseSocketReturn {
  messages: Message[];
  sendMessage: (text: string, user: string) => void;
}

// Pasamos el currentUser actual como parámetro para saber a quién NO notificar
export function useSocket(currentUser: string): UseSocketReturn {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const handleReceiveMessage = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);

      // UX: Solo notificamos si el mensaje NO fue enviado por el usuario actual
      if (msg.user !== currentUser) {
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? 'animate-enter' : 'animate-leave'
              } max-w-md w-full bg-white shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 border border-l-4 border-l-blue-500`}
            >
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    {/* Ícono representativo */}
                    <span className="text-xl">💬</span>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-semibold text-gray-950">
                      Nuevo mensaje de {msg.user}
                    </p>
                    <p className="mt-1 text-xs text-gray-600 truncate max-w-[250px]">
                      {msg.text}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-100">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-xl p-4 flex items-center justify-center text-xs font-medium text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  Cerrar
                </button>
              </div>
            </div>
          ),
          { id: `msg-${msg.time}` } // Evita duplicados idénticos en ráfagas de milisegundos
        );
      }
    };

    const handleTicketCreated = (ticket: TicketNotification) => {
      toast.error(`⚠️ Nuevo Ticket #${ticket.id} creado por ${ticket.creadoPor}: "${ticket.titulo}"`, {
        duration: 6000,
        position: 'bottom-right',
        style: {
          border: '1px solid #f59e0b',
          padding: '16px',
          color: '#1e293b',
          fontWeight: '500',
        },
      });
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('ticket_created', handleTicketCreated);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('ticket_created', handleTicketCreated);
    };
  }, [currentUser]); // Añadimos currentUser a las dependencias

  const sendMessage = (text: string, user: string): void => {
    if (!text.trim() || !user.trim()) return;

    const msg: Message = { 
      text, 
      user, 
      time: new Date().toISOString() 
    };
    
    socket.emit('send_message', msg);
  };

  return { messages, sendMessage };
}