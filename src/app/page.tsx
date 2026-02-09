"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Home() {
  return (
    <div className="p-4">
      <Button onClick={() => toast("Button is clicked")}>Click Me</Button>
    </div>
  );
}
