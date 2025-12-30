import AddVideoForm from "@/components/admin/videos/AddVideoForm";

export default function AddVideoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Video</h1>
        <p className="text-muted-foreground">
          Add a new video to your website
        </p>
      </div>
      <AddVideoForm />
    </div>
  );
} 