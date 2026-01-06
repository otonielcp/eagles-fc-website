import EditSliderForm from "@/components/admin/sliders/EditSliderForm";

interface EditSliderPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSliderPage({ params }: EditSliderPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Hero Slider</h1>
        <p className="text-muted-foreground">
          Update the slider for your homepage hero section
        </p>
      </div>
      <EditSliderForm sliderId={id} />
    </div>
  );
}
