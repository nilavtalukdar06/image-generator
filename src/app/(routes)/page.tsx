import { getQueryClient, trpc } from "@/backend/server";
import { auth } from "@/lib/auth/auth";
import { CreateImage } from "@/modules/images/components/create-image";
import { ViewImages } from "@/modules/images/components/view-images";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.session) {
    redirect("/login");
  }
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.images.getImages.queryOptions());
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
      <ViewImages />
    </div>
  );
}
