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

const formSchema = z.object({
  prompt: z
    .string()
    .min(5, { message: "Prompt is too short" })
    .max(100, { message: "Prompt is too large" }),
});

export function CreateImage() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          className="rounded-none shadow-none font-light"
        >
          <ImageIcon />
          Create Image
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Image</DialogTitle>
          <DialogDescription>
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
                  <FieldLabel htmlFor="prompt">Enter your prompt</FieldLabel>
                  <Textarea
                    {...field}
                    id="prompt"
                    aria-invalid={fieldState.invalid}
                    className="min-h-24 rounded-none shadow-none"
                    placeholder="Enter your prompt here"
                  />
                  <FieldDescription>
                    Write a short and concise prompt to generate your image
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button
            type="button"
            variant="destructive"
            className="rounded-none shadow-none font-light"
            onClick={() => setIsOpen(false)}
          >
            Cancel It
          </Button>
          <Button
            form="image-generation"
            type="submit"
            variant="outline"
            className="rounded-none shadow-none border bg-sidebar font-light"
          >
            Create Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
