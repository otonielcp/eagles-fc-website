"use client";

import { useState, useEffect } from "react";
import { getAllVideos, deleteVideo } from "@/actions/video";
import { Video } from "@/types/video";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function VideoManagement() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videoData = await getAllVideos();
        setVideos(videoData);
      } catch (error) {
        toast.error("Failed to load videos");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleDelete = async (id: string) => {
    setDeleteLoading(id);
    try {
      const result = await deleteVideo(id);
      if (result.success) {
        setVideos(videos.filter((item) => item._id !== id));
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while deleting the video");
      console.error(error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Video Management</h1>
          <p className="text-muted-foreground">
            Manage videos for your website
          </p>
        </div>
        <Link href="/admin/videos/add">
          <Button className="bg-[#C5A464] hover:bg-[#B39355]">
            <Plus className="mr-2 h-4 w-4" /> Add Video
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5A464]"></div>
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-10 border rounded-lg">
          <h3 className="text-lg font-medium">No videos found</h3>
          <p className="text-muted-foreground mt-1">
            Get started by adding a new video
          </p>
          <Link href="/admin/videos/add" className="mt-4 inline-block">
            <Button className="bg-[#C5A464] hover:bg-[#B39355] mt-4">
              <Plus className="mr-2 h-4 w-4" /> Add Video
            </Button>
          </Link>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thumbnail</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.map((video) => (
                <TableRow key={video._id}>
                  <TableCell>
                    <img 
                      src={video.thumbnailUrl} 
                      alt={video.title} 
                      className="w-16 h-9 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium max-w-[300px] truncate">
                    {video.title}
                  </TableCell>
                  <TableCell>
                    {video.isActive ? (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(video.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={video.videoUrl} target="_blank">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/videos/edit/${video._id}`}>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently
                              delete the video and remove the data from
                              our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(video._id)}
                              className="bg-red-500 hover:bg-red-600 text-white"
                              disabled={deleteLoading === video._id}
                            >
                              {deleteLoading === video._id ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              ) : null}
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <Toaster position="top-center" richColors />
    </div>
  );
} 