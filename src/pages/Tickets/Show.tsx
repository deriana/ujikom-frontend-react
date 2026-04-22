import { useParams } from "react-router-dom";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import { 
  useTicketByUuid, 
  useUpdateTicketStatus, 
  useReplyTicket, 
  useRateTicket 
} from "@/hooks/useTicket";
import Badge from "@/components/ui/badge/Badge";
import { Calendar, Clock, User, MessageSquare, Send, AlertCircle, Tag, ShieldCheck, Star } from "lucide-react";
import { formatDateID } from "@/utils/date";
import { handleMutation } from "@/utils/handleMutation";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";

const TicketShowSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg mb-6" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex justify-between mb-6">
            <div className="h-8 w-1/2 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded-full" />
          </div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded" />
            <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded" />
            <div className="h-4 w-3/4 bg-gray-100 dark:bg-gray-800 rounded" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-24 w-full bg-gray-50 dark:bg-gray-800/50 rounded-2xl" />
        </div>
      </div>
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded mb-6" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded-lg" />
              <div className="space-y-2">
                <div className="h-3 w-12 bg-gray-100 dark:bg-gray-800 rounded" />
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default function TicketShow() {
  const { uuid } = useParams<{ uuid: string }>();
  const { data: ticket, isLoading, refetch } = useTicketByUuid(uuid || "");
  const { mutateAsync: updateStatus } = useUpdateTicketStatus();
  const { mutateAsync: replyTicket } = useReplyTicket();
  const { mutateAsync: rateTicket } = useRateTicket();
  const { user } = useAuth();
  const [isSending, setIsSending] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [response, setResponse] = useState("");
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleStatusSubmit = async () => {
    if (!ticket || !selectedStatus || selectedStatus === ticket.status) return;
    await handleMutation(() => updateStatus({ uuid: ticket.uuid, status: selectedStatus }), {
      loading: "Updating ticket status...",
      success: "Status updated",
      error: "Failed to update status",
    });
    refetch();
  };

  const handleSendResponse = async () => {
    if (!ticket || !response.trim() || isSending) return;
    setIsSending(true);
    await handleMutation(
      () => replyTicket({ uuid: ticket.uuid, payload: { response: response.trim() } }),
      {
        loading: "Sending response...",
        success: "Response sent",
        error: "Failed to send response",
      }
    );
    setResponse("");
    setIsSending(false);
    refetch();
  };

  const handleRateTicket = async () => {
    if (!ticket || rating === 0) return;
    await handleMutation(() => rateTicket({ 
      uuid: ticket.uuid, 
      payload: { rating, feedback: feedback.trim() } 
    }), {
      loading: "Submitting rating...",
      success: "Thank you for your feedback!",
      error: "Failed to submit rating",
    });
    refetch();
  };

  if (isLoading) return (
    <div className="p-6">
      <TicketShowSkeleton />
    </div>
  );
  if (!ticket) return <div className="p-6 text-center text-red-500">Ticket not found</div>;

  const statusSteps = [
    { id: "open", label: "Awaiting Review", icon: AlertCircle },
    { id: "in progress", label: "In Progress", icon: Clock },
    { id: "closed", label: "Case Closed", icon: ShieldCheck },
  ];
  console.log("Status Steps:", statusSteps);

  return (
    <>
      <PageMeta title={`Ticket: ${ticket.subject}`} />
      <PageBreadcrumb
        crumbs={[
          { name: "Tickets", href: "/tickets" },
          { name: "Detail" },
        ]}
      />

      {/* Status Timeline */}
      <div className="mb-8 pb-4">
        <div className="flex items-center justify-between px-4">
          {statusSteps.map((step, index) => {
            const isCompleted = statusSteps.findIndex(s => s.id === ticket.status) >= index;
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isCompleted ? "bg-blue-600 border-blue-600 text-white" : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-400"
                  }`}>
                    <Icon size={20} />
                  </div>
                  <span className={`absolute -bottom-7 text-xs font-bold uppercase tracking-tighter whitespace-nowrap ${isCompleted ? "text-blue-600" : "text-gray-400"}`}>
                    {step.label}
                  </span>
                </div>
                {index < statusSteps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    statusSteps.findIndex(s => s.id === ticket.status) > index ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-800"
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mt-10">
        {/* Left: Ticket Details & Chat */}
        <div className="xl:col-span-3 space-y-6">
          {/* Ticket Header Card */}
          <div className="rounded-3xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge 
                    color={ticket.priority === "high" ? "error" : ticket.priority === "mid" ? "warning" : "info"} 
                    variant="solid" 
                    size="sm"
                  >
                    {ticket.priority.toUpperCase()} PRIORITY
                  </Badge>
                  <span className="text-xs text-gray-400 font-medium">#{ticket.uuid.split('-')[0]}</span>
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{ticket.subject}</h1>
              </div>

              {/* Quick Status Actions */}
              <div className="flex items-center gap-2">
                <div className="w-40">
                  <Select
                    options={statusSteps.map((s) => ({ value: s.id, label: s.label }))}
                    value={selectedStatus || ticket.status}
                    onChange={(val) => setSelectedStatus(val)}
                    placeholder="Change Status"
                  />
                </div>
                <button
                  onClick={handleStatusSubmit}
                  disabled={!selectedStatus || selectedStatus === ticket.status}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    !selectedStatus || selectedStatus === ticket.status
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/25"
                  }`}
                >
                  Update
                </button>
              </div>
            </div>
            
            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>
          </div>

          {/* Chat UI */}
          <div className="rounded-3xl border border-gray-200 bg-white flex flex-col dark:border-gray-800 dark:bg-gray-900 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
              <MessageSquare size={20} className="text-blue-500" />
              <h3 className="font-bold text-gray-900 dark:text-white">Discussion</h3>
            </div>

            <div className="p-6 space-y-6 max-h-125 overflow-y-auto bg-gray-50/30 dark:bg-transparent">
              {ticket.responses?.map((res) => (
                <div key={res.uuid} className={`flex flex-col ${res.responder_id === user?.id ? "items-end" : "items-start"}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                    res.responder_id !== user?.id 
                      ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-700" 
                      : "bg-blue-600 text-white rounded-tr-none"
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase opacity-70">{res.responder_name}</span>
                    </div>
                    <p className="text-sm leading-relaxed">{res.response}</p>
                    <span className="text-[10px] mt-2 block opacity-60 text-right">{formatDateID(res.created_at)}</span>
                  </div>
                </div>
              ))}
              {(!ticket.responses || ticket.responses.length === 0) && (
                <div className="text-center py-10">
                  <div className="bg-gray-100 dark:bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="text-gray-400" size={20} />
                  </div>
                  <p className="text-sm text-gray-500 italic">No messages yet. Start the conversation.</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
              <div className="relative flex items-center gap-2">
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendResponse();
                    }
                  }}
                  placeholder="Type your message..."
                  rows={1}
                  disabled={isSending}
                  className="flex-1 bg-gray-100 dark:bg-gray-800 border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white resize-none disabled:opacity-50"
                />
                <button 
                  onClick={handleSendResponse}
                  disabled={isSending || !response.trim()}
                  className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Sidebar Info */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Stakeholders</h4>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600"><User size={24} /></div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Reporter</p>
                  <p className="text-sm font-bold dark:text-white">{ticket.reporter.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600"><ShieldCheck size={24} /></div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Assigned To</p>
                  <p className="text-sm font-bold dark:text-white">{ticket.operator.name || "Unassigned"}</p>
                </div>
              </div>
            </div>

            <hr className="my-6 border-gray-100 dark:border-gray-800" />

            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Metadata</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 flex items-center gap-2"><Tag size={14} /> Category</span>
                <span className="text-xs font-bold dark:text-gray-300">Technical Support</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 flex items-center gap-2"><Calendar size={14} /> Created</span>
                <span className="text-xs font-bold dark:text-gray-300">{formatDateID(ticket.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Rating Card if exists */}
          {ticket.status === "closed" && !ticket.rating && (
            <div className="rounded-3xl border border-blue-100 bg-blue-50/50 p-6 dark:border-blue-900/20 dark:bg-blue-900/10">
              <h4 className="text-xs font-bold text-blue-800 dark:text-blue-500 uppercase tracking-widest mb-4">Rate our service</h4>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`transition-transform hover:scale-110 ${rating >= star ? "text-amber-500" : "text-gray-300"}`}
                  >
                    <Star size={24} fill={rating >= star ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Any additional feedback?"
                className="w-full p-3 text-sm rounded-xl border border-blue-100 dark:border-blue-800 bg-white dark:bg-gray-900 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <Button
                size="sm"
                disabled={rating === 0}
                onClick={handleRateTicket}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Submit Feedback
              </Button>
            </div>
          )}

          {ticket.rating && (
            <div className="rounded-3xl border border-amber-100 bg-amber-50/50 p-6 dark:border-amber-900/20 dark:bg-amber-900/10">
              <h4 className="text-xs font-bold text-amber-800 dark:text-amber-500 uppercase tracking-widest mb-4">User Feedback</h4>
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-xl ${i < ticket.rating!.rating ? "text-amber-500" : "text-gray-300"}`}>★</span>
                ))}
              </div>
              <p className="text-sm italic text-amber-900/70 dark:text-amber-400/70 leading-relaxed">"{ticket.rating.feedback}"</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
