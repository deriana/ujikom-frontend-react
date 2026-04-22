import {
  useTickets,
  useCreateTicket,
  useUpdateTicket,
  useDeleteTicket,
} from "@/hooks/useTicket";
import { Column, Ticket as TicketType, Ticket, TicketInput } from "@/types";
import TableActions from "../BasicTables/TableAction";
import { RESOURCES } from "@/constants/Resource";
import { DataTable } from "../BasicTables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import { useCrudModalForm } from "@/hooks/useCrudForm";
import { handleMutation } from "@/utils/handleMutation";
import { TicketCheck, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { useMemo, useState } from "react";
import FilterDropdown from "@/components/FilterDropdown";
import TicketModal from "@/pages/Tickets/Modal";
import { useNavigate } from "react-router-dom";

export default function TicketsTable() {
  const { data: ticketsData, isLoading, isError, error } = useTickets();

  const tickets = (ticketsData as Ticket[]) || [];

  const { mutateAsync: createTicket } = useCreateTicket();
  const { mutateAsync: updateTicket } = useUpdateTicket();
  const { mutateAsync: deleteTicket } = useDeleteTicket();

  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState("all");
  const [duplicateTicket, setDuplicateTicket] = useState<TicketType | null>(
    null,
  );
  const [forceCreate, setForceCreate] = useState(false);

  const stats = useMemo(() => {
    return {
      total: tickets.length,
      open: tickets.filter((t) => t.status === "open").length,
      inProgress: tickets.filter((t) => t.status === "in progress").length,
      closed: tickets.filter((t) => t.status === "closed").length,
    };
  }, [tickets]);

  const statusOptions = useMemo(() => {
    return [
      { label: "All", value: "all" },
      { label: "Open", value: "open" },
      { label: "In Progress", value: "in progress" },
      { label: "Closed", value: "closed" },
    ];
  }, []);

  const crud = useCrudModalForm<TicketInput, any>({
    label: "Ticket",
    emptyForm: {
      subject: "",
      description: "",
      priority: "mid",
    },

    validate: (form) => {
      if (!form.subject.trim()) return "Subject is required";
      if (!form.description.trim()) return "Description is required";
      return null;
    },

    mapToPayload: (form) => ({
      subject: form.subject.trim(),
      description: form.description,
      priority: form.priority,
      force: forceCreate,
    }),

    createFn: async (payload) => {
      setDuplicateTicket(null);
      try {
        return await createTicket(payload);
      } catch (error: any) {
        if (error.response?.status === 409) {
          setDuplicateTicket(error.response.data.existing_ticket);
        }
        throw error;
      }
    },
    updateFn: (uuid, payload) => updateTicket({ uuid, payload }),
  });

  const handleEdit = (uuid: string) => {
    const ticket = tickets.find((p) => p.uuid === uuid);
    console.log("Ticket data:", ticket);
    if (!ticket) return;

    crud.openEdit({
      uuid: ticket.uuid,
      subject: ticket.subject,
      description: ticket.description,
      priority: ticket.priority,
    });
  };

  const handleDelete = (uuid: string) =>
    handleMutation(() => deleteTicket(uuid), {
      loading: "Deleting ticket...",
      success: "Ticket deleted successfully",
      error: "Failed to delete ticket",
    });

  const handleCreate = () => {
    setDuplicateTicket(null);
    setForceCreate(false);
    crud.openCreate();
  };

  const handleShow = (uuid: string) => {
    navigate(`/tickets/${uuid}/show`);
  };

  const columns: Column<Ticket>[] = [
    {
      header: "Ticket Info",
      render: (row) => (
        <div className="flex flex-col max-w-50 md:max-w-75">
          <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">
            {row.subject}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 wrap-break-word line-clamp-2 leading-relaxed">
            {row.description.replace(/<[^>]*>/g, "")}
          </span>
        </div>
      ),
    },
    {
      header: "Stakeholders",
      render: (row) => (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full bg-blue-400"
              title="Reporter"
            ></div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {row.reporter?.name || "System"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full bg-purple-400"
              title="Operator"
            ></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {row.operator?.name || "Unassigned"}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Progress & Status",
      render: (row) => {
        const progress =
          row.status === "open" ? 25 : row.status === "in progress" ? 65 : 100;

        const statusColor =
          row.status === "open"
            ? "success"
            : row.status === "closed"
              ? "error"
              : "warning";

        return (
          <div className="flex flex-col gap-2 min-w-30">
            <Badge size="sm" variant="solid" color={statusColor}>
              {row.status.toUpperCase()}
            </Badge>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ease-in-out ${
                  row.status === "open"
                    ? "bg-green-500"
                    : row.status === "closed"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      header: "Priority",
      render: (row) => (
        <Badge
          size="sm"
          color={
            row.priority === "high"
              ? "error"
              : row.priority === "mid" // tadinya 'medium', sesuaikan dengan enum migration 'mid'
                ? "warning"
                : "info"
          }
        >
          {row.priority.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: "Action",
      render: (row) => (
          <TableActions
            id={row.uuid}
            dataName={row.subject}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onShow={handleShow}
            baseNamePermission={RESOURCES.TICKET}
            can={row.can}
          />
      ),
    },
  ];

  if (isError) {
    return (
      <div className="text-red-500 text-sm">
        Failed to load tickets: {(error as Error).message}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg text-white">
              <TicketCheck size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase">
                Total Tickets
              </p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </h3>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500 rounded-lg text-white">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase">
                Open
              </p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {stats.open}
              </h3>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 rounded-lg text-white">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase">
                In Progress
              </p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {stats.inProgress}
              </h3>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-lg text-white">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase">
                Closed
              </p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {stats.closed}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        tableTitle="Tickets Table"
        data={tickets}
        columns={columns}
        searchableKeys={["subject"]}
        loading={isLoading}
        handleCreate={handleCreate}
        label="Tickets"
        baseNamePermission={RESOURCES.TICKET}
        extraFilters={{ status: statusFilter }}
        newFilterComponent={
          <FilterDropdown
            value={statusFilter}
            options={statusOptions}
            onChange={setStatusFilter}
          />
        }
      />

      <TicketModal
        isOpen={crud.isOpen}
        onClose={crud.close}
        ticketData={crud.form}
        setTicketData={crud.setForm}
        onSubmit={crud.submit}
        isLoading={crud.loading}
        duplicateTicket={duplicateTicket}
        forceCreate={forceCreate}
        setForceCreate={setForceCreate}
      />
    </>
  );
}
