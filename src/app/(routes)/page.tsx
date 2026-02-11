import { getQueryClient, trpc } from "@/backend/server";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth/auth";
import { CreateImage } from "@/modules/images/components/create-image";
import { ViewImages } from "@/modules/images/components/view-images";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.session) {
    redirect("/login");
  }
  const queryClient = getQueryClient();
  if (session) {
    void queryClient.prefetchQuery(trpc.images.getImages.queryOptions());
  }

  return (
    <div className="px-4 py-2 w-full">
      <div className="w-full space-y-2">
        <p className="text-lg text-neutral-700 font-light">
          Welcome {session.user.name}
        </p>
        <p className="text-muted-foreground font-light text-sm max-w-md">
          Ready to turn your wildest ideas into stunning visuals? What do you
          want to generate today?
        </p>
        <CreateImage />
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ErrorBoundary fallback={<Error />}>
          <Suspense fallback={<Loading />}>
            <ViewImages />
          </Suspense>
        </ErrorBoundary>
      </HydrationBoundary>
    </div>
  );
}

function Error() {
  return (
    <div className="w-full my-4">
      <p className="text-red-500 font-light">Failed to fetch images</p>
    </div>
  );
}

function Loading() {
  return (
    <div className="my-4 w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 place-items-center gap-4">
      {[1, 2, 3, 4, 5].map((item) => (
        <Skeleton className="w-full h-50" key={item} />
      ))}
    </div>
  );
}
