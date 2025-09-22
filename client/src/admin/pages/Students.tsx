import { useState } from "react";
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

const StudentManagement = () => {
  const students = [
    {
      id: 1,
      name: "Russell Guinto",
      progress: "75%",
      badges: ["Top Cheater", "Dugyot"],
    },
    {
      id: 2,
      name: "Bong bong sahur",
      progress: "50%",
      badges: ["Pag Kurap", "Putilin ang", "Burat"],
    },
    {
      id: 3,
      name: "Bakla",
      progress: "90%",
      badges: ["Consistent", "Fast Learner", "Leader"],
    },
  ];

  // state for dialogss
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState<null | number>(null);
  const [openDelete, setOpenDelete] = useState<null | number>(null);

  return (
    <div className="p-6 space-y-6">
      <Card className="border border-[#51ab91] shadow-md dark:bg-darkbg bg-lightbg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Student Management
          </CardTitle>
          <Button
            className="flex items-center gap-2 bg-[#51ab91] hover:bg-[#459b83] text-white"
            onClick={() => setOpenAdd(true)}
          >
            <FaUserPlus /> Add Student
          </Button>
        </CardHeader>

        {/* Table */}
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 dark:bg-gray-800">
                <TableHead className="text-gray-900 dark:text-gray-200">
                  Name
                </TableHead>
                <TableHead className="text-center text-gray-900 dark:text-gray-200">
                  Progress
                </TableHead>
                <TableHead className="text-center text-gray-900 dark:text-gray-200">
                  Badges
                </TableHead>
                <TableHead className="text-right text-gray-900 dark:text-gray-200">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {students.map((s) => (
                <TableRow
                  key={s.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="text-center">{s.progress}</TableCell>
                  <TableCell>
                    <div className="flex justify-center flex-wrap gap-2">
                      {s.badges.map((badge, idx) => (
                        <Badge
                          key={idx}
                          className="bg-[#51ab91] text-white hover:bg-[#459b83]"
                        >
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-3">
                      {/* Edit */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => setOpenEdit(s.id)}
                      >
                        <FaEdit />
                      </Button>
                      {/* Delete */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => setOpenDelete(s.id)}
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

      {/* Add Student Dialog */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="dark:bg-darkbg bg-lightbg border border-[#51ab91]">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              Add Student
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Student Name" />
            <Input placeholder="Progress" />
          </div>
          <DialogFooter>
            <Button
              onClick={() => setOpenAdd(false)}
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
            <Input placeholder="Edit Name" />
            <Input placeholder="Edit Progress" />
          </div>
          <DialogFooter>
            <Button
              onClick={() => setOpenEdit(null)}
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
            This will remove the student from the list. (Not functional yet)
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => setOpenDelete(null)}
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
