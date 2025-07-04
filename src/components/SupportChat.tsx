import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  X, 
  Send, 
  User, 
  Headphones, 
  Plus,
  Paperclip,
  Smile
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { formatDistanceToNow } from 'date-fns';

interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
}

interface SupportMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  is_staff: boolean;
  created_at: string;
  user?: {
    name: string;
    role: string;
  };
}

export const SupportChat: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && isOpen) {
      fetchTickets();
    }
  }, [user, isOpen]);

  useEffect(() => {
    if (activeTicket) {
      fetchMessages();
      setupRealtimeSubscription();
    }
  }, [activeTicket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchTickets = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching tickets:', error);
        return;
      }

      setTickets(data || []);
      
      // Auto-select the most recent open ticket
      const openTicket = data?.find(ticket => ticket.status !== 'closed' && ticket.status !== 'resolved');
      if (openTicket && !activeTicket) {
        setActiveTicket(openTicket);
      }
    } catch (error) {
      console.error('Error in fetchTickets:', error);
    }
  };

  const fetchMessages = async () => {
    if (!activeTicket) return;

    try {
      const { data, error } = await supabase
        .from('support_messages')
        .select(`
          *,
          profiles!support_messages_user_id_fkey (
            name,
            role
          )
        `)
        .eq('ticket_id', activeTicket.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages(data || []);
    } catch (error) {
      console.error('Error in fetchMessages:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!activeTicket) return;

    const subscription = supabase
      .channel('support_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'support_messages',
          filter: `ticket_id=eq.${activeTicket.id}`
        },
        (payload) => {
          const newMessage = payload.new as SupportMessage;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const createTicket = async () => {
    if (!user || !newTicketSubject.trim()) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          subject: newTicketSubject,
          status: 'open',
          priority: 'medium'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating ticket:', error);
        return;
      }

      setTickets(prev => [data, ...prev]);
      setActiveTicket(data);
      setNewTicketSubject('');
      setShowNewTicketForm(false);
    } catch (error) {
      console.error('Error in createTicket:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!user || !activeTicket || !newMessage.trim()) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('support_messages')
        .insert({
          ticket_id: activeTicket.id,
          user_id: user.id,
          message: newMessage,
          is_staff: false
        });

      if (error) {
        console.error('Error sending message:', error);
        return;
      }

      setNewMessage('');
      
      // Update ticket status to open if it was resolved
      if (activeTicket.status === 'resolved') {
        await supabase
          .from('support_tickets')
          .update({ status: 'open', updated_at: new Date().toISOString() })
          .eq('id', activeTicket.id);
        
        setActiveTicket(prev => prev ? { ...prev, status: 'open' } : null);
      }
    } catch (error) {
      console.error('Error in sendMessage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-purple-100 text-purple-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      {/* Support Chat Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-full shadow-lg z-40 transition-all"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      {/* Support Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
            />

            {/* Chat Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-amber-200 bg-amber-50">
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-600 p-2 rounded-lg">
                    <Headphones className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-amber-900">Support</h2>
                    <p className="text-sm text-amber-700">We're here to help</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-amber-600 hover:text-amber-800 p-2 hover:bg-amber-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Ticket Selection / New Ticket */}
              {!activeTicket ? (
                <div className="flex-1 p-6">
                  {/* New Ticket Form */}
                  {showNewTicketForm ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-amber-900">Create New Ticket</h3>
                      <div>
                        <label className="block text-sm font-medium text-amber-800 mb-2">
                          What can we help you with?
                        </label>
                        <input
                          type="text"
                          value={newTicketSubject}
                          onChange={(e) => setNewTicketSubject(e.target.value)}
                          placeholder="Describe your issue..."
                          className="w-full border border-amber-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setShowNewTicketForm(false)}
                          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={createTicket}
                          disabled={!newTicketSubject.trim() || isLoading}
                          className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {isLoading ? 'Creating...' : 'Create Ticket'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Existing Tickets */}
                      {tickets.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-amber-900 mb-3">Your Tickets</h3>
                          <div className="space-y-3">
                            {tickets.map((ticket) => (
                              <div
                                key={ticket.id}
                                onClick={() => setActiveTicket(ticket)}
                                className="p-4 border border-amber-200 rounded-lg hover:bg-amber-50 cursor-pointer transition-colors"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium text-amber-900 text-sm">
                                    {ticket.subject}
                                  </h4>
                                  <div className="flex space-x-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                      {ticket.status}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                      {ticket.priority}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-xs text-amber-600">
                                  {formatDistanceToNow(new Date(ticket.updated_at), { addSuffix: true })}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* New Ticket Button */}
                      <button
                        onClick={() => setShowNewTicketForm(true)}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>New Support Ticket</span>
                      </button>

                      {/* Quick Help */}
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <h4 className="font-medium text-amber-900 mb-2">Quick Help</h4>
                        <div className="space-y-2 text-sm text-amber-700">
                          <p>• Order issues: Check your order status first</p>
                          <p>• Delivery questions: Track your package</p>
                          <p>• Payment problems: Contact us immediately</p>
                          <p>• Product quality: We'll make it right</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Active Ticket Header */}
                  <div className="p-4 border-b border-amber-200 bg-amber-50">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setActiveTicket(null)}
                        className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                      >
                        ← Back to tickets
                      </button>
                      <div className="flex space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activeTicket.status)}`}>
                          {activeTicket.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(activeTicket.priority)}`}>
                          {activeTicket.priority}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-amber-900 mt-2">{activeTicket.subject}</h3>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.is_staff ? 'justify-start' : 'justify-end'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.is_staff
                            ? 'bg-gray-100 text-gray-900'
                            : 'bg-amber-600 text-white'
                        }`}>
                          <div className="flex items-center space-x-2 mb-1">
                            {message.is_staff ? (
                              <Headphones className="w-3 h-3" />
                            ) : (
                              <User className="w-3 h-3" />
                            )}
                            <span className="text-xs font-medium">
                              {message.is_staff ? 'Support' : 'You'}
                            </span>
                          </div>
                          <p className="text-sm">{message.message}</p>
                          <p className={`text-xs mt-1 ${
                            message.is_staff ? 'text-gray-500' : 'text-amber-200'
                          }`}>
                            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-amber-200">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 border border-amber-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        disabled={isLoading}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || isLoading}
                        className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};