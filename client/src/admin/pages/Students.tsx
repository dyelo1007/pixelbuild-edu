import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
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
import API from "../../utils/api";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string; // "student" or "admin"
  progress?: string;
  badges?: string[];
}

const StudentManagement = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState<null | string>(null);
  const [openDelete, setOpenDelete] = useState<null | string>(null);

  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [progressInput, setProgressInput] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setStudents(allUsers.filter((u) => u.role === "student"));
      setAdmins(allUsers.filter((u) => u.role === "admin"));
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add student
  const handleAddStudent = async () => {
    try {
      const res = await API.post("/admin/students", {
        username: nameInput,
        email: emailInput,
        progress: progressInput,
      });
      setStudents((prev) => [...prev, res.data]);
      setOpenAdd(false);
      setNameInput("");
      setEmailInput("");
      setProgressInput("");
    } catch (err) {
      console.error(err);
    }
  };

  // Edit student
  const handleEditStudent = async (id: string) => {
    try {
      const res = await API.put(`/admin/students/${id}`, {
        username: nameInput,
        email: emailInput,
        progress: progressInput,
      });
      setStudents((prev) => prev.map((u) => (u._id === id ? res.data : u)));
      setOpenEdit(null);
      setNameInput("");
      setEmailInput("");
      setProgressInput("");
    } catch (err) {
      console.error(err);
    }
  };

  // Delete student
  const handleDeleteStudent = async (id: string) => {
    try {
      await API.delete(`/admin/students/${id}`);
      setStudents((prev) => prev.filter((u) => u._id !== id));
      setOpenDelete(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Students Table */}
      <Card className="border border-[#51ab91] shadow-md dark:bg-darkbg bg-lightbg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Students
          </CardTitle>
          <Button
            className="flex items-center gap-2 bg-[#51ab91] hover:bg-[#459b83] text-white"
            onClick={() => setOpenAdd(true)}
          >
            <FaUserPlus /> Add Student
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 dark:bg-gray-800">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-center">Progress</TableHead>
                <TableHead className="text-center">Badges</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((s) => (
                <TableRow
                  key={s._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <TableCell>{s.username}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{s.role}</TableCell>
                  <TableCell className="text-center">
                    {s.progress || "0%"}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center flex-wrap gap-2">
                      {s.badges && s.badges.length > 0 ? (
                        s.badges.map((b, idx) => (
                          <Badge
                            key={idx}
                            className="bg-[#51ab91] text-white hover:bg-[#459b83]"
                          >
                            {b}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-400">No badges yet</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => {
                          setOpenEdit(s._id);
                          setNameInput(s.username);
                          setEmailInput(s.email);
                          setProgressInput(s.progress || "");
                        }}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => setOpenDelete(s._id)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Admins Table */}
      {admins.length > 0 && (
        <Card className="border border-[#51ab91] shadow-md dark:bg-darkbg bg-lightbg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Admins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100 dark:bg-gray-800">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Badges</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((a) => (
                  <TableRow
                    key={a._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <TableCell>{a.username}</TableCell>
                    <TableCell>{a.email}</TableCell>
                    <TableCell>{a.role}</TableCell>
                    <TableCell>
                      {a.badges && a.badges.length > 0
                        ? a.badges.join(", ")
                        : "No badges yet"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

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
            <Input
              placeholder="Progress"
              value={progressInput}
              onChange={(e) => setProgressInput(e.target.value)}
            />
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

      {/* Edit Student Dialog */}
      <Dialog open={!!openEdit} onOpenChange={() => setOpenEdit(null)}>
        <DialogContent className="dark:bg-darkbg bg-lightbg border border-[#51ab91]">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              Edit Student
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Edit Name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />
            <Input
              placeholder="Edit Email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
            <Input
              placeholder="Edit Progress"
              value={progressInput}
              onChange={(e) => setProgressInput(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              onClick={() => openEdit && handleEditStudent(openEdit)}
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
            This will remove the student from the list.
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => openDelete && handleDeleteStudent(openDelete)}
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
