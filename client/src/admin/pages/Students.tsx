import { useState, useEffect, useMemo } from "react";
import { FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import API from "../../utils/api";

interface User {
  _id: string;
  username: string;
  email: string;
  role: "student" | "admin";
  progress?: string;
  badges?: string[];
}

// Reusable SkeletonRow for the single table
const SkeletonRow = ({
  showProgressAndActions,
}: {
  showProgressAndActions: boolean;
}) => (
  <TableRow>
    <TableCell>
      <Skeleton className="h-4 w-24" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-32" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-16" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-20 mx-auto" />
    </TableCell>
    {showProgressAndActions && ( // only show progress and actions for student view
      <>
        <TableCell className="text-center">
          <Skeleton className="h-4 w-12 mx-auto" />
        </TableCell>
        <TableCell>
          <div className="flex justify-end gap-3">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </TableCell>
      </>
    )}
  </TableRow>
);

const StudentManagement = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<"students" | "admins">("students");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState<null | string>(null);
  const [openDelete, setOpenDelete] = useState<null | string>(null);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [progressInput, setProgressInput] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        const res = await API.get("/admin/users");
        setAllUsers(res.data);
        setCurrentPage(1);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- CRUD handlers ---
  const handleAddStudent = async () => {
    try {
      const res = await API.post("/admin/students", {
        username: nameInput,
        email: emailInput,
        progress: progressInput,
        role: "student",
      });
      setAllUsers((prev) => [...prev, res.data]);
      setOpenAdd(false);
      setNameInput("");
      setEmailInput("");
      setProgressInput("");
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditUser = async (id: string, role: "student" | "admin") => {
    try {
      const endpoint =
        role === "student" ? `/admin/students/${id}` : `/admin/users/${id}`;
      const res = await API.put(endpoint, {
        username: nameInput,
        email: emailInput,
        progress: progressInput,
      });
      setAllUsers((prev) => prev.map((u) => (u._id === id ? res.data : u)));
      setOpenEdit(null);
      setNameInput("");
      setEmailInput("");
      setProgressInput("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id: string, role: "student" | "admin") => {
    try {
      const endpoint =
        role === "student" ? `/admin/students/${id}` : `/admin/users/${id}`;
      await API.delete(endpoint);
      setAllUsers((prev) => prev.filter((u) => u._id !== id));
      setOpenDelete(null);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = useMemo(() => {
    return allUsers.filter((u) => {
      if (activeTab === "students") return u.role === "student";
      if (activeTab === "admins") return u.role === "admin";
      return true;
    });
  }, [allUsers, activeTab]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const renderTableHeaders = () => (
    <TableRow className="bg-gray-100 dark:bg-gray-800">
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Role</TableHead>
      {activeTab === "students" && (
        <>
          <TableHead className="text-right">Actions</TableHead>
        </>
      )}
    </TableRow>
  );

  return (
    <div className="p-6 space-y-6">
      <Card className="border border-[#51ab91] shadow-md dark:bg-darkbg bg-lightbg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
            User Management
          </CardTitle>
          <Button
            className="flex items-center gap-2 bg-[#51ab91] hover:bg-[#459b83] text-white"
            onClick={() => setOpenAdd(true)}
          >
            <FaUserPlus /> Add Student
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value as "students" | "admins");
              setCurrentPage(1);
            }}
            className="w-full mb-4"
          >
            <TabsList className="grid w-full grid-cols-2 bg-gray-200 dark:bg-gray-700">
              <TabsTrigger
                value="students"
                className="data-[state=active]:bg-[#51ab91] data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                Students
              </TabsTrigger>
              <TabsTrigger
                value="admins"
                className="data-[state=active]:bg-[#51ab91] data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                Admins
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Table>
            <TableHeader>{renderTableHeaders()}</TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: itemsPerPage }).map((_, index) => (
                    <SkeletonRow
                      key={index}
                      showProgressAndActions={activeTab === "students"}
                    />
                  ))
                : paginatedUsers.map((u) => (
                    <TableRow
                      key={u._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <TableCell>{u.username}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.role}</TableCell>

                      {activeTab === "students" && (
                        <>
                          <TableCell>
                            <div className="flex justify-end gap-3">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-blue-500 hover:text-blue-700"
                                onClick={() => {
                                  setOpenEdit(u._id);
                                  setNameInput(u.username);
                                  setEmailInput(u.email);
                                  setProgressInput(u.progress || "");
                                }}
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => setOpenDelete(u._id)}
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
              {!loading && paginatedUsers.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={activeTab === "students" ? 6 : 4}
                    className="text-center py-4 text-gray-500 dark:text-gray-400"
                  >
                    No {activeTab} found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {!loading && totalPages > 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page);
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage + 1);
                    }}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>

      {/* Add Student Dialog */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="dark:bg-darkbg bg-lightbg border border-[#51ab91]">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              Add Student
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Student Name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />
            <Input
              placeholder="Email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
            {/* <Input
              placeholder="Progress (e.g., 50%)"
              value={progressInput}
              onChange={(e) => setProgressInput(e.target.value)}
            /> */}
          </div>
          <DialogFooter>
            <Button
              onClick={handleAddStudent}
              className="bg-[#51ab91] hover:bg-[#459b83] text-white"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!openEdit} onOpenChange={() => setOpenEdit(null)}>
        <DialogContent className="dark:bg-darkbg bg-lightbg border border-[#51ab91]">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              Edit {activeTab === "students" ? "Student" : "Admin"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />
            <Input
              placeholder="Email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
            {/* {activeTab === "students" && ( // Only show progress for students
              <Input
                placeholder="Progress"
                value={progressInput}
                onChange={(e) => setProgressInput(e.target.value)}
              />
            )} */}
          </div>
          <DialogFooter>
            <Button
              onClick={() =>
                openEdit &&
                handleEditUser(
                  openEdit,
                  activeTab === "students" ? "student" : "admin"
                )
              }
              className="bg-[#51ab91] hover:bg-[#459b83] text-white"
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!openDelete} onOpenChange={() => setOpenDelete(null)}>
        <AlertDialogContent className="dark:bg-darkbg bg-lightbg border border-[#51ab91]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">
              Are you sure?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-gray-600 dark:text-gray-300">
            This will remove the{" "}
            {activeTab === "students" ? "student" : "admin"} from the list.
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                openDelete &&
                handleDeleteUser(
                  openDelete,
                  activeTab === "students" ? "student" : "admin"
                )
              }
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StudentManagement;
