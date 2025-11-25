import React, { useState, useRef, useEffect } from 'react';
import { Send, Database, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { Message } from '../types';
import { simulateQuery } from '../services/geminiService';

export const SlackSimulator: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Welcome to #mysql-query-result! Connected to AWS EC2 instance (i-0123456789abcdef). Type a SQL query to execute.",
      timestamp: new Date()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const result = await simulateQuery(userMsg.text || '');
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: result.explanation,
        data: result.data,
        isError: result.isError,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: "Error executing query. Check database connection logs.",
        isError: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <span className="text-gray-500 font-bold text-lg">#</span>
          <span className="font-bold text-gray-800">mysql-query-result</span>
        </div>
        <div className="flex items-center text-xs text-green-600 font-medium">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
          AWS Connector Active
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[90%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className={`flex-shrink-0 h-9 w-9 rounded bg-gray-200 flex items-center justify-center ${msg.sender === 'user' ? 'ml-3' : 'mr-3'}`}>
                {msg.sender === 'user' ? (
                  <span className="text-xs font-bold text-gray-600">YOU</span>
                ) : (
                  <Database size={16} className="text-blue-600" />
                )}
              </div>

              {/* Content */}
              <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className="flex items-baseline space-x-2 mb-1">
                  <span className="font-bold text-sm text-gray-900">{msg.sender === 'user' ? 'You' : 'MySQL Bot'}</span>
                  <span className="text-xs text-gray-400">{msg.timestamp.toLocaleTimeString()}</span>
                </div>

                {msg.text && (
                  <div className={`text-sm mb-2 ${msg.isError ? 'text-red-600' : 'text-gray-800'}`}>
                     {msg.sender === 'user' ? <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-xs">{msg.text}</span> : msg.text}
                  </div>
                )}

                {/* Data Table Visualization (Block Kit simulation) */}
                {msg.data && msg.data.length > 0 && (
                  <div className="border border-gray-300 rounded-md overflow-hidden text-xs w-full shadow-sm">
                     <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              {Object.keys(msg.data[0]).map((key) => (
                                <th key={key} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {msg.data.map((row, idx) => (
                              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                {Object.values(row).map((val: any, vIdx) => (
                                  <td key={vIdx} className="px-3 py-2 whitespace-nowrap text-gray-700 font-mono">
                                    {String(val)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                     </div>
                     <div className="bg-gray-50 px-3 py-1 border-t border-gray-200 text-gray-400 text-[10px] flex items-center">
                        <CheckCircle size={10} className="mr-1 text-green-500" /> Query executed successfully
                     </div>
                  </div>
                )}
                
                {msg.isError && (
                   <div className="flex items-center text-red-500 text-xs mt-1">
                      <AlertCircle size={12} className="mr-1" /> SQL Syntax Error or Connection Failure
                   </div>
                )}

              </div>
            </div>
          </div>
        ))}
        {loading && (
           <div className="flex justify-start">
              <div className="ml-12 flex items-center space-x-2 text-gray-400 text-sm">
                 <Clock size={14} className="animate-spin" />
                 <span>Executing query on AWS EC2...</span>
              </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="relative border border-gray-400 rounded-lg shadow-sm focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a SQL query (e.g., SELECT * FROM users LIMIT 5)"
            className="block w-full rounded-lg border-none py-3 pl-3 pr-12 text-sm resize-none focus:ring-0 font-mono text-gray-800 placeholder-gray-400 h-24" // Made slightly taller for SQL
          />
          <div className="absolute bottom-2 right-2 flex space-x-2">
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className={`p-2 rounded ${loading || !input.trim() ? 'bg-gray-200 text-gray-400' : 'bg-[#007a5a] text-white hover:bg-[#148567]'} transition-colors`}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-400 flex justify-between">
           <span><strong>Tip:</strong> Use Shift+Enter for new line</span>
           <span>Mode: Read-Only (Safe)</span>
        </div>
      </div>
    </div>
  );
};
