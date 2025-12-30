import AddNewsForm from "@/components/admin/news/AddNewsForm";

export default function AddNewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add News Article</h1>
        <p className="text-muted-foreground">
          Create a new news article for your website
        </p>
      </div>
      <AddNewsForm />
    </div>
  );
} 