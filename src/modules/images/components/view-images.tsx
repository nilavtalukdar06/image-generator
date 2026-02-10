"use client";

import { useTRPC } from "@/backend/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";

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
                <div className="w-full h-full rounded">
                  <Image
                    src={item.imageUrl!}
                    height={250}
                    width={250}
                    alt="generated-image"
                    loading="lazy"
                    className="h-full w-full object-cover object-center"
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
