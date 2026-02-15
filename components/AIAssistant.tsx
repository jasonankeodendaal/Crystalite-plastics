
import React, { useState, useEffect, useRef } from 'react';
import { addInquiry, loadState, updateInquiryChat } from '../stateManager';

const SupportChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'form' | 'chat'>('form');
  const [currentInquiryId, setCurrentInquiryId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', message: '' });
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, step]);

  useEffect(() => {
    if (currentInquiryId && isOpen) {
      const interval = setInterval(() => {
        const state = loadState();
        const inquiry = state.inquiries.find(i => i.id === currentInquiryId);
        if (inquiry && inquiry.chatHistory) {
          setMessages(inquiry.chatHistory);
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [currentInquiryId, isOpen]);

  const handleStartInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.message) return;
    
    const newInquiry = await addInquiry({
      fullName: formData.fullName,
      email: formData.email,
      type: 'General Support',
      message: formData.message
    });

    setCurrentInquiryId(newInquiry.id);
    setMessages(newInquiry.chatHistory || []);
    setStep('chat');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !currentInquiryId) return;

    updateInquiryChat(currentInquiryId, { sender: 'user', text: chatMessage });
    setChatMessage('');
    
    const state = loadState();
    const iq = state.inquiries.find(i => i.id === currentInquiryId);
    if (iq) setMessages(iq.chatHistory || []);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className="bg-white w-80 md:w-96 shadow-2xl border-t-4 border-[var(--primary-yellow)] rounded-t-[var(--border-radius)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#1a1a1a] p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <h4 className="font-black uppercase text-sm tracking-widest">Live Support</h4>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white text-xl">&times;</button>
          </div>
          
          <div className="p-4 h-80 overflow-y-auto bg-gray-50 text-sm flex flex-col" ref={scrollRef}>
            {step === 'form' ? (
              <form onSubmit={handleStartInquiry} className="space-y-4">
                <p className="text-gray-500 font-medium italic mb-2">Please introduce yourself to start a live consultation.</p>
                <input 
                  type="text" required placeholder="Full Name" 
                  className="w-full p-3 border border-gray-200 rounded-[var(--border-radius)] outline-none focus:ring-1 focus:ring-[var(--primary-yellow)]"
                  value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})}
                />
                <input 
                  type="email" required placeholder="Email Address" 
                  className="w-full p-3 border border-gray-200 rounded-[var(--border-radius)] outline-none focus:ring-1 focus:ring-[var(--primary-yellow)]"
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                />
                <textarea 
                  required placeholder="How can we help?" 
                  className="w-full p-3 border border-gray-200 rounded-[var(--border-radius)] outline-none focus:ring-1 focus:ring-[var(--primary-yellow)] h-24"
                  value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                />
                <button type="submit" className="w-full bg-[var(--primary-yellow)] p-3 text-black font-black uppercase text-xs tracking-widest hover:opacity-90 rounded-[var(--border-radius)]">Start Conversation</button>
              </form>
            ) : (
              <div className="space-y-4">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`p-3 rounded-[var(--border-radius)] text-xs shadow-sm max-w-[85%] ${msg.sender === 'admin' ? 'bg-white border-l-4 border-[var(--primary-yellow)]' : 'bg-[var(--primary-yellow)] text-black font-bold'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {messages.length === 1 && (
                  <p className="text-[10px] text-gray-400 text-center uppercase font-black tracking-widest pt-4">Waiting for agent to connect...</p>
                )}
              </div>
            )}
          </div>

          {step === 'chat' && (
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type message..."
                  className="flex-1 p-2 border border-gray-200 rounded-[var(--border-radius)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary-yellow)]"
                />
                <button type="submit" className="bg-[var(--primary-yellow)] p-2 px-4 rounded-[var(--border-radius)] text-black font-bold hover:opacity-90">
                  &rarr;
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-[#1a1a1a] text-[var(--primary-yellow)] w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all border-2 border-[var(--primary-yellow)] group"
        >
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] font-black flex items-center justify-center rounded-full animate-bounce">1</div>
          <svg className="w-7 h-7 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
        </button>
      )}
    </div>
  );
};

export default SupportChat;
