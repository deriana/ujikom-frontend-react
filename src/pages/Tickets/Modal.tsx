import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Input from "@/components/form/input/InputField";
import { Ticket as TicketType, TicketInput } from "@/types";
import { Ticket, AlertCircle, User, Calendar, ExternalLink, Bold, Italic, List, ImageIcon } from "lucide-react";
import CrudModal from "@/components/ui/modal/CrudModal";
import Select from "@/components/form/Select";
import Badge from "@/components/ui/badge/Badge";
import Checkbox from "@/components/form/input/Checkbox";
interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketData: TicketInput;
  setTicketData: (data: TicketInput) => void;
  onSubmit: () => void;
  isLoading?: any;
  duplicateTicket?: TicketType | null;
  forceCreate?: boolean;
  setForceCreate?: (val: boolean) => void;
}

export default function TicketModal({
  isOpen,
  onClose,
  ticketData,
  setTicketData,
  onSubmit,
  isLoading = false,
  duplicateTicket,
  forceCreate = false,
  setForceCreate,
}: TicketModalProps) {
  const existingTicket = duplicateTicket;
  const isEdit = Boolean(ticketData.uuid);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        allowBase64: true,
        inline: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg border border-gray-200',
        },
      }),
    ],
    content: ticketData.description,
    onUpdate: ({ editor }) => {
      setTicketData({ ...ticketData, description: editor.getHTML() });
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert focus:outline-none p-4 min-h-[150px] max-h-[300px] overflow-y-auto',
      },
    },
  });

  useEffect(() => {
    // Hanya jalankan jika editor ada dan modal baru saja dibuka
    if (editor && isOpen) {
      const currentEditorContent = editor.getHTML();

      // Bandingkan konten. Jika di editor kosong tapi di data ada isinya, baru kita set.
      // Gunakan timeout kecil (0ms) untuk memastikan Tiptap sudah selesai inisialisasi internal
      if (ticketData.description !== currentEditorContent) {
        setTimeout(() => {
          editor.commands.setContent(ticketData.description || "<p></p>");
        }, 0);
      }
    }
  }, [isOpen, editor]); // Hapus ticketData.description dari sini untuk mencegah loop/reset saat mengetik

  const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      if (input.files?.length) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          editor?.chain().focus().setImage({ src: reader.result as string }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <CrudModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      title={isEdit ? "Update Ticket" : "Create New Ticket"}
      submitLabel={isEdit ? "Update" : "Create"}
      icon={Ticket}
      isEdit={isEdit}
      isLoading={isLoading}
      maxWidth={existingTicket ? "max-w-4xl" : "max-w-xl"}
    >
      <div className={`grid grid-cols-1 ${existingTicket ? "lg:grid-cols-2 gap-8" : ""}`}>
        <div className="space-y-6">
          {/* Subject */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Subject
            </label>
            <Input
              type="text"
              value={ticketData.subject}
              onChange={(e) =>
                setTicketData({ ...ticketData, subject: e.target.value })
              }
              placeholder="e.g. Cannot access the dashboard"
              className="bg-gray-50 dark:bg-gray-900"
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Priority
            </label>
            <Select
              options={[
                { value: "low", label: "Low" },
                { value: "mid", label: "Medium" },
                { value: "high", label: "High" },
              ]}
              value={ticketData.priority}
              onChange={(value) =>
                setTicketData({ ...ticketData, priority: value })
              }
              placeholder="Select Priority"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Description
            </label>
            <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800/50">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    editor?.chain().focus().toggleBold().run();
                  }}
                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${editor?.isActive('bold') ? 'bg-blue-100 text-blue-600' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  <Bold size={16} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    editor?.chain().focus().toggleItalic().run();
                  }}
                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${editor?.isActive('italic') ? 'bg-blue-100 text-blue-600' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  <Italic size={16} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    editor?.chain().focus().toggleBulletList().run();
                  }}
                  className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${editor?.isActive('bulletList') ? 'bg-blue-100 text-blue-600' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  <List size={16} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addImage();
                  }}
                  className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                >
                  <ImageIcon size={16} />
                </button>
              </div>
              <EditorContent editor={editor} className="text-gray-900 dark:text-gray-100" />
            </div>
          </div>
        </div>

        {/* Duplicate Warning Panel */}
        {existingTicket && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6 dark:border-amber-900/30 dark:bg-amber-900/10 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-4">
              <AlertCircle size={20} />
              <h4 className="font-bold text-sm uppercase tracking-tight">Conflict: Existing Ticket Found</h4>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-amber-100 dark:border-amber-900/20 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-bold text-gray-900 dark:text-white line-clamp-1">{existingTicket.subject}</h5>
                  <Badge size="sm" color="warning" variant="solid">{existingTicket.status.toUpperCase()}</Badge>
                </div>
                <div 
                  className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 mb-4 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: existingTicket.description }}
                />
                
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-gray-400" />
                    <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400 truncate">
                      {existingTicket.reporter?.name || "Unknown"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">
                      {existingTicket.created_at ? new Date(existingTicket.created_at).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <a 
                href={`/tickets/${existingTicket.uuid}/show`}
                target="_blank"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs font-bold transition-colors"
              >
                View Existing Ticket <ExternalLink size={14} />
              </a>

              {setForceCreate && (
                <div className="flex items-center gap-2 pt-2">
                  <Checkbox
                    checked={forceCreate}
                    onChange={setForceCreate}
                    label="I still want to create this ticket"
                    className="text-amber-700 dark:text-amber-400 font-medium text-xs"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </CrudModal>
  );
}
