import { useParams, useNavigate } from "react-router-dom";
import { useTicketByUuid, useReplyTicket } from "@/hooks/useTicket";
import { MessageSquare, Send, ShieldCheck, ArrowLeft } from "lucide-react";
import { formatDateID } from "@/utils/date";
import { handleMutation } from "@/utils/handleMutation";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Can } from "@/components/auth/Can";
import { RESOURCES } from "@/constants/Resource";
import { buildPermission, PERMISSIONS } from "@/constants/Permissions";
import Spinner from "@/components/ui/loading/Spinner";

export default function TicketMobileChat() {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const { data: ticket, isLoading, refetch } = useTicketByUuid(uuid || "");
  const { mutateAsync: replyTicket } = useReplyTicket();
  const { user } = useAuth();
  const [isSending, setIsSending] = useState(false);
  const [response, setResponse] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.responses]);

  const handleSendResponse = async () => {
    if (!ticket || !response.trim() || isSending) return;
    setIsSending(true);
    await handleMutation(
      () => replyTicket({ uuid: ticket.uuid, payload: { response: response.trim() } }),
      {
        loading: "Sending...",
        success: "Sent",
        error: "Failed to send",
      }
    );
    setResponse("");
    setIsSending(false);
    refetch();
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Spinner /></div>;
  if (!ticket) return <div className="p-6 text-center text-red-500">Ticket not found</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-gray-900 dark:text-white truncate">{ticket.subject}</h2>
          <p className="text-xs text-gray-500 truncate">#{ticket.uuid.split('-')[0]} • <span className="capitalize">{ticket.status}</span></p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {ticket.responses?.map((res) => (
          <div key={res.uuid} className={`flex flex-col ${res.responder_id === user?.id ? "items-end" : "items-start"}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${res.responder_id !== user?.id
                ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm border border-gray-100 dark:border-gray-700"
                : "bg-blue-600 text-white rounded-tr-sm"
              }`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase opacity-70">{res.responder_name}</span>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{res.response}</p>
              <span className="text-[10px] mt-1 block opacity-60 text-right">{formatDateID(res.created_at)}</span>
            </div>
          </div>
        ))}
        {(!ticket.responses || ticket.responses.length === 0) && (
          <div className="text-center py-10 flex flex-col items-center justify-center h-full">
            <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="text-gray-400" size={28} />
            </div>
            <p className="text-sm text-gray-500 font-medium">No messages yet</p>
            <p className="text-xs text-gray-400 mt-1">Start the conversation below</p>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      {ticket.status !== "closed" ? (
        <div className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-3 pb-safe">
          <Can value={buildPermission(RESOURCES.TICKET, PERMISSIONS.TICKET.reply)}>
            {/* Auto Reply Suggestions - Scrollable horizontally */}
            <div className="flex overflow-x-auto no-scrollbar gap-2 mb-3 pb-1">
              {[
                "We are looking into this issue.",
                "Could you provide more details?",
                "The issue has been resolved.",
                "Thank you for your patience."
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => setResponse(suggestion)}
                  className="px-3 py-1.5 text-[11px] font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 rounded-full border border-blue-100 dark:border-blue-800/50 whitespace-nowrap flex-shrink-0 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <div className="relative flex items-end gap-2">
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Type a message..."
                rows={Math.min(Math.max(response.split('\n').length, 1), 5)}
                disabled={isSending}
                className="flex-1 bg-gray-100 dark:bg-gray-800 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white resize-none disabled:opacity-50 min-h-[44px] max-h-[120px]"
              />
              <button
                onClick={handleSendResponse}
                disabled={isSending || !response.trim()}
                className="h-[44px] w-[44px] flex items-center justify-center shrink-0 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} className={isSending ? "animate-pulse" : ""} />
              </button>
            </div>
          </Can>
        </div>
      ) : (
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 text-center pb-safe">
          <p className="text-xs font-medium text-gray-500 flex items-center justify-center gap-1.5">
            <ShieldCheck size={16} className="text-emerald-500" /> Case is closed. Replies disabled.
          </p>
        </div>
      )}
    </div>
  );
}
