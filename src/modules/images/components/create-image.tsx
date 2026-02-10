"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ImageIcon } from "lucide-react";

export function CreateImage() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          className="rounded-none shadow-none font-light"
        >
          <ImageIcon />
          Create Image
        </Button>
      </DialogTrigger>
    </Dialog>
  );
}
