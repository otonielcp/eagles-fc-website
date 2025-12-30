"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getPortfolioLogoById } from "@/actions/sponsorsLogo";
import { PortfolioLogo } from "@/types/sponsorsLogo";
import EditLogoForm from "@/components/admin/sponsors/EditLogoForm";
import { toast, Toaster } from "sonner";

export default function EditLogoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [logo, setLogo] = useState<PortfolioLogo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const logoData = await getPortfolioLogoById(id);
        if (logoData) {
          setLogo(logoData);
        } else {
          toast.error("Logo not found");
          router.push("/admin/sponsors");
        }
      } catch (error) {
        toast.error("Failed to load logo");
        console.error(error);
        router.push("/admin/sponsors");
      } finally {
        setLoading(false);
      }
    };

    fetchLogo();
  }, [id, router]);

  const handleCancel = () => {
    router.push("/admin/sponsors");
  };

  const handleLogoUpdated = (updatedLogo: PortfolioLogo) => {
    setLogo(updatedLogo);
    router.push("/admin/sponsors");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5A464]"></div>
      </div>
    );
  }

  if (!logo) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">Logo not found</h3>
        <button
          onClick={() => router.push("/admin/sponsors")}
          className="mt-4 px-4 py-2 bg-[#C5A464] text-white rounded-md hover:bg-[#B39355]"
        >
          Back to Portfolio Management
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Portfolio Logo</h1>
        <p className="text-muted-foreground">
          Update the details of your portfolio logo
        </p>
      </div>
      <EditLogoForm
        logo={logo}
        onCancel={handleCancel}
        onLogoUpdated={handleLogoUpdated}
      />
      <Toaster position="top-center" richColors />
    </div>
  );
} 