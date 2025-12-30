"use client";

import { getFixtureById } from "@/actions/fixture";
import TimelineManager from "@/components/admin/fixtures/TimelineManager";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function FixtureTimelinePage() {
  const params = useParams<{ id: string }>();
  const [fixtureData, setFixtureData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFixture = async () => {
      const fixtureData = await getFixtureById(params.id);
      setFixtureData(fixtureData);
      setLoading(false);
    };

    fetchFixture();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Match Timeline</h1>
        <Link href={`/admin/fixtures/${params.id}/edit`}>
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Fixture
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Match Details</h2>
              <p><span className="font-medium">Date:</span> {fixtureData.date}</p>
              <p><span className="font-medium">Time:</span> {fixtureData.time}</p>
              <p><span className="font-medium">Competition:</span> {fixtureData.competition}</p>
              <p><span className="font-medium">Venue:</span> {fixtureData.stadium}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Teams</h2>
              <p><span className="font-medium">Home:</span> {fixtureData.homeTeam}</p>
              <p><span className="font-medium">Away:</span> {fixtureData.awayTeam}</p>
              <p><span className="font-medium">Score:</span> {fixtureData.homeScore} - {fixtureData.awayScore}</p>
              <p><span className="font-medium">Status:</span> {fixtureData.status}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <TimelineManager
        fixtureId={params.id}
        homeTeam={fixtureData.homeTeam}
        awayTeam={fixtureData.awayTeam}
        initialTimeline={fixtureData.timeline || []}
      />
    </div>
  );
} 