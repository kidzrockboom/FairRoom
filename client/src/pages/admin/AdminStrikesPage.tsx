import AdminStrikesDirectoryPanel from "@/features/admin-strikes/components/AdminStrikesDirectoryPanel";
import AdminStrikesMainContent from "@/features/admin-strikes/components/AdminStrikesMainContent";
import AdminStrikesSideRail from "@/features/admin-strikes/components/AdminStrikesSideRail";
import {
  selectedStrikeStudent,
  strikeStudents,
} from "@/features/admin-strikes/adminStrikesContent";

function AdminStrikesPage() {
  return (
    <div className="flex flex-1 flex-col bg-background lg:min-h-full lg:flex-row lg:items-stretch">
      <AdminStrikesDirectoryPanel
        students={strikeStudents}
        selectedStudentId={selectedStrikeStudent.id}
      />

      <div className="flex min-w-0 flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col gap-4">
          <div className="grid gap-4 xl:min-h-full xl:grid-cols-[minmax(0,1fr)_300px] xl:items-stretch">
            <AdminStrikesMainContent student={selectedStrikeStudent} />
            <AdminStrikesSideRail />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminStrikesPage;
