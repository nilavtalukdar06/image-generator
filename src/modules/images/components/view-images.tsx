"use client";

import { useTRPC } from "@/backend/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Download, EllipsisVertical, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

interface ImageProps {
  imageUrl: string | null;
  filename: string;
  imageId: string;
}

export function ViewImages() {
  const trpc = useTRPC();
  const query = useSuspenseQuery(
    trpc.images.getImages.queryOptions(undefined, {
      refetchInterval: 5000,
    }),
  );

  return (
    <React.Fragment>
      {query.data?.length === 0 ? (
        <div className="w-full my-4">
          <p className="text-muted-foreground font-light">
            You have not created any image
          </p>
        </div>
      ) : (
        <div className="w-full my-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 place-items-center gap-4">
          {query.data?.map((item) => (
            <div className="w-full h-50 sm:h-62.5" key={item.id}>
              {item.status === "generated" && (
                <div className="w-full h-full rounded relative group">
                  <Image
                    src={item.imageUrl!}
                    height={250}
                    width={250}
                    alt="generated-image"
                    loading="lazy"
                    className="h-full w-full object-cover object-center"
                  />
                  <ImageActions
                    imageId={item.id}
                    imageUrl={item.imageUrl}
                    filename={`${item.id}-generated.png`}
                  />
                </div>
              )}
              {item.status === "in_progress" && (
                <Skeleton className="h-full w-full rounded-none" />
              )}
            </div>
          ))}
        </div>
      )}
    </React.Fragment>
  );
}

function ImageActions({ imageUrl, imageId, filename }: ImageProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    trpc.images.deleteImage.mutationOptions({
      onSuccess: () => {
        toast.success("Image deleted");
        queryClient.invalidateQueries({
          queryKey: trpc.images.getImages.queryKey(),
        });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete image");
      },
    }),
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const downloadImage = async () => {
    try {
      setIsLoading(true);
      if (!imageUrl) {
        toast.error("Image URL is not present");
        return;
      }
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error("Failed to fetch image");
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    mutation.mutate({ imageId });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className="shadow-none opacity-0 group-hover:opacity-100 transition-all rounded-none absolute z-20 right-2 top-2 border bg-sidebar"
          size="icon-xs"
        >
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-none">
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="rounded-none"
            disabled={isLoading}
            onClick={downloadImage}
          >
            <Download />
            <span className="text-muted-foreground font-light">
              Download Image
            </span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="hover:bg-red-50! text-red-500 rounded-none"
            disabled={mutation.isPending}
            onClick={handleDelete}
          >
            <Trash2 className="text-red-500 font-light" />
            <span className="font-light hover:text-red-500">Delete Image</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
