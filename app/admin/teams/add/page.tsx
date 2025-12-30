import AddTeamForm from "@/components/admin/teams/AddTeamForm";

export default function AddTeamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Team</h1>
        <p className="text-muted-foreground">
          Create a new team for your club
        </p>
      </div>
      <AddTeamForm />
    </div>
  );
} 