"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageIcon } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useTRPC } from "@/backend/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z.object({
  prompt: z
    .string()
    .min(5, { message: "Prompt is too short" })
    .max(100, { message: "Prompt is too large" }),
});

export function CreateImage() {
  const trpc = useTRPC();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const mutation = useMutation(
    trpc.images.createImage.mutationOptions({
      onSuccess: () => {
        toast.success("Image generation has been started");
        form.reset();
        setIsOpen(false);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to send image generation request");
      },
    }),
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate({ prompt: values.prompt });
  };

  return (
    <Dialog open={isOpen || mutation.isPending} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          className="rounded-none shadow-none font-light"
        >
          <ImageIcon />
          Create Image
        </Button>
      </DialogTrigger>
      <DialogContent className="w-106.25 p-4 rounded-none">
        <DialogHeader>
          <DialogTitle className=" text-neutral-600 font-light">
            Create Image
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground font-light">
            Convert your ideas into stunning visuals
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} id="image-generation">
          <FieldGroup>
            <Controller
              name="prompt"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="prompt" className="font-light">
                    Enter your prompt
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="prompt"
                    aria-invalid={fieldState.invalid}
                    className="min-h-24 rounded-none shadow-none font-light placeholder:font-light"
                    placeholder="Enter your prompt here"
                  />
                  <FieldDescription className="font-light">
                    Write a short and concise prompt to generate your image
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="font-light"
                    />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button
            disabled={mutation.isPending}
            type="button"
            variant="destructive"
            className="rounded-none shadow-none font-light"
            onClick={() => setIsOpen(false)}
          >
            Cancel It
          </Button>
          <Button
            disabled={mutation.isPending}
            form="image-generation"
            type="submit"
            variant="outline"
            className="rounded-none shadow-none border bg-sidebar font-light"
          >
            {mutation.isPending && <Spinner />}
            {mutation.isPending ? "Creating..." : "Create Image"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
