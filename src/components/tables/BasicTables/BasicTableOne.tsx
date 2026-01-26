import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import { useState, useMemo } from "react";

interface Order {
  id: number;
  user: {
    image: string;
    name: string;
    role: string;
  };
  projectName: string;
  team: {
    images: string[];
  };
  status: string;
  budget: string;
}

// Define the table data using the interface
const tableData: Order[] = [
  {
    id: 1,
    user: {
      image: "/images/user/user-17.jpg",
      name: "Lindsey Curtis",
      role: "Web Designer",
    },
    projectName: "Agency Website",
    team: {
      images: [
        "/images/user/user-22.jpg",
        "/images/user/user-23.jpg",
        "/images/user/user-24.jpg",
      ],
    },
    budget: "3.9K",
    status: "Active",
  },
  {
    id: 2,
    user: {
      image: "placeholder_img.jpg",
      name: "Kaiya George",
      role: "Project Manager",
    },
    projectName: "Technology",
    team: {
      images: ["/images/user/user-25.jpg", "/images/user/user-26.jpg"],
    },
    budget: "24.9K",
    status: "Pending",
  },
  {
    id: 3,
    user: {
      image: "/images/user/user-17.jpg",
      name: "Zain Geidt",
      role: "Content Writing",
    },
    projectName: "Blog Writing",
    team: {
      images: ["/images/user/user-27.jpg"],
    },
    budget: "12.7K",
    status: "Active",
  },
  {
    id: 4,
    user: {
      image: "/images/user/user-20.jpg",
      name: "Abram Schleifer",
      role: "Digital Marketer",
    },
    projectName: "Social Media",
    team: {
      images: [
        "/images/user/user-28.jpg",
        "/images/user/user-29.jpg",
        "/images/user/user-30.jpg",
      ],
    },
    budget: "2.8K",
    status: "Cancel",
  },
  {
    id: 5,
    user: {
      image: "/images/user/user-21.jpg",
      name: "Carla George",
      role: "Front-end Developer",
    },
    projectName: "Website",
    team: {
      images: [
        "/images/user/user-31.jpg",
        "/images/user/user-32.jpg",
        "/images/user/user-33.jpg",
      ],
    },
    budget: "4.5K",
    status: "Active",
  },
];

export default function BasicTableOne() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const filteredData = useMemo(() => {
    return tableData.filter((item) => {
      const matchSearch =
        item.user.name.toLowerCase().includes(search.toLowerCase()) ||
        item.projectName.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / limit);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return filteredData.slice(start, end);
  }, [filteredData, page, limit]);

  const handleLimitChange = (value: number) => {
    setLimit(value);
    setPage(1);
  };

  const handleShow = (id: number) => {
    console.log("Show:", id);
  };

  const handleEdit = (id: number) => {
    console.log("Edit:", id);
  };

  const handleDelete = (id: number) => {
    if (confirm("Yakin mau hapus data ini?")) {
      console.log("Delete:", id);
    }
  };
  const handleAdd = () => {
    console.log("Add new data");
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      <div className="max-w-full overflow-x-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/5">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
            Users List
          </h3>
          <div className="flex flex-col gap-4 px-5 py-4 border-b border-gray-100 dark:border-white/5 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col w-full gap-3 sm:flex-row sm:items-center md:w-auto">
              <input
                type="text"
                placeholder="Search name or project..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 text-sm border dark:text-gray-300 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white/5 dark:border-white/10"
              />

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg 
             focus:outline-none focus:ring-2 focus:ring-blue-500
             bg-white text-gray-700
             dark:bg-gray-800 dark:text-gray-200 dark:border-white/10"
              >
                <option
                  value="all"
                  className="bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                >
                  All Status
                </option>
                <option
                  value="Active"
                  className="bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                >
                  Active
                </option>
                <option
                  value="Pending"
                  className="bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                >
                  Pending
                </option>
                <option
                  value="Cancel"
                  className="bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                >
                  Cancel
                </option>
              </select>

              <select
                value={limit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg
             focus:outline-none focus:ring-2 focus:ring-blue-500
             bg-white text-gray-700
             dark:bg-gray-800 dark:text-gray-200 dark:border-white/10"
              >
                {[10, 20, 30, 40, 50].map((n) => (
                  <option
                    key={n}
                    value={n}
                    className="bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  >
                    Show {n}
                  </option>
                ))}
              </select>
            </div>

            {/* RIGHT SIDE (Add Button) */}
            <div className="flex justify-end w-full md:w-auto">
              <button
                onClick={handleAdd}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/5">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                User
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Project Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Team
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Budget
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Action
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
            {paginatedData.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                      <img
                        width={40}
                        height={40}
                        src={order.user.image}
                        alt={order.user.name}
                      />
                    </div>
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {order.user.name}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {order.user.role}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.projectName}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="flex -space-x-2">
                    {order.team.images.map((teamImage, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
                      >
                        <img
                          width={24}
                          height={24}
                          src={teamImage}
                          alt={`Team member ${index + 1}`}
                          className="w-full size-6"
                        />
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      order.status === "Active"
                        ? "success"
                        : order.status === "Pending"
                          ? "warning"
                          : "error"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {order.budget}
                </TableCell>

                <TableCell className="px-4 py-3 text-start">
                  <div className="flex items-center gap-2">
                    {/* Show */}
                    <button
                      onClick={() => handleShow(order.id)}
                      className="p-2 rounded-lg text-gray-500 hover:bg-blue-50 dark:hover:bg-white/10"
                      aria-label="Show"
                    >
                      <Eye size={16} />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => handleEdit(order.id)}
                      className="p-2 rounded-lg text-gray-500 hover:bg-yellow-50 dark:hover:bg-white/10"
                      aria-label="Edit"
                    >
                      <Pencil size={16} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="p-2 rounded-lg text-gray-500 hover:bg-red-50 dark:hover:bg-white/10"
                      aria-label="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between px-5 py-4 border-t">
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 text-gray-800 text-theme-sm dark:text-white/90 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 text-gray-800 text-theme-sm dark:text-white/90 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
