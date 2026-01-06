import AddSliderForm from "@/components/admin/sliders/AddSliderForm";

export default function AddSliderPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Hero Slider</h1>
        <p className="text-muted-foreground">
          Create a new slide for your homepage hero section
        </p>
      </div>
      <AddSliderForm />
    </div>
  );
}
