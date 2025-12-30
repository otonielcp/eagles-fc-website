import AddLogoForm from "@/components/admin/sponsors/AddLogoForm";

export default function AddLogoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Portfolio Logo</h1>
        <p className="text-muted-foreground">
          Add a new sponsor or partner logo to your website
        </p>
      </div>
      <AddLogoForm />
    </div>
  );
} 