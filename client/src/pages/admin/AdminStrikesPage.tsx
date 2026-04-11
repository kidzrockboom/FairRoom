import StrikesDirectoryPanel from "@/features/admin/strikes/components/StrikesDirectoryPanel";
import StrikesMainContent from "@/features/admin/strikes/components/StrikesMainContent";
import StrikesSideRail from "@/features/admin/strikes/components/StrikesSideRail";
import { strikesPageHeader } from "@/features/admin/strikes/content";
import { useAdminStrikes } from "@/features/admin/strikes/hooks/useAdminStrikes";

function AdminStrikesPage() {
  const {
    activeStrikes,
    decrease,
    directoryLoading,
    error,
    increase,
    isSaving,
    proposedStrikes,
    reason,
    reset,
    save,
    search,
    selectedUserId,
    setReason,
    setSearch,
    selectUser,
    student,
    students,
    studentLoading,
  } = useAdminStrikes();

  return (
    <div className="flex flex-1 flex-col bg-background lg:min-h-full lg:flex-row lg:items-stretch">
      <StrikesDirectoryPanel
        students={students}
        selectedStudentId={selectedUserId}
        search={search}
        isLoading={directoryLoading}
        onSearchChange={setSearch}
        onSelectStudent={selectUser}
      />

      <div className="flex min-w-0 flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col gap-4">
          <header className="space-y-1">
            <h1 className="font-heading text-[30px] font-bold tracking-tight text-content">
              {strikesPageHeader.title}
            </h1>
            <p className="text-sm text-muted-foreground">{strikesPageHeader.subtitle}</p>
          </header>

          {error ? <p className="rounded-card border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p> : null}

          <div className="grid gap-4 xl:min-h-full xl:grid-cols-[minmax(0,1fr)_300px] xl:items-stretch">
            <StrikesMainContent
              student={student}
              activeStrikes={activeStrikes}
              proposedStrikes={proposedStrikes}
              reason={reason}
              isSaving={isSaving}
              onIncrease={increase}
              onDecrease={decrease}
              onReset={reset}
              onReasonChange={setReason}
              onSave={save}
            />
            <StrikesSideRail history={student?.history ?? []} isLoading={studentLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminStrikesPage;
