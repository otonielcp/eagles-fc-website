import FixtureForm from "@/components/admin/fixtures/FixtureForm";

export default async function EditFixturePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Edit Fixture</h1>
      <FixtureForm fixtureId={id} />
    </div>
  );
} 