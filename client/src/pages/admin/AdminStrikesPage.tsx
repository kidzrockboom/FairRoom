import StrikesDirectoryPanel from "@/features/admin/strikes/components/StrikesDirectoryPanel";
import StrikesMainContent from "@/features/admin/strikes/components/StrikesMainContent";
import StrikesSideRail from "@/features/admin/strikes/components/StrikesSideRail";
import {
  selectedStrikeStudent,
  strikeStudents,
} from "@/features/admin/strikes/content";

function AdminStrikesPage() {
  return (
    <div className="flex flex-1 flex-col bg-background lg:min-h-full lg:flex-row lg:items-stretch">
      <StrikesDirectoryPanel
        students={strikeStudents}
        selectedStudentId={selectedStrikeStudent.id}
      />

      <div className="flex min-w-0 flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col gap-4">
          <div className="grid gap-4 xl:min-h-full xl:grid-cols-[minmax(0,1fr)_300px] xl:items-stretch">
            <StrikesMainContent student={selectedStrikeStudent} />
            <StrikesSideRail />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminStrikesPage;
