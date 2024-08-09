"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MainFormSchema, MainFormType } from "../utils/form";
import { trpc } from "@/app/_trpc/client";
import { redirect, RedirectType } from "next/navigation";

interface UserDataFormProps {
  questions: MainFormType;
}

export function UserDataForm({ questions }: UserDataFormProps) {
  const mainform = useForm<z.infer<typeof MainFormSchema>>({
    resolver: zodResolver(MainFormSchema),
    defaultValues: {
      curiousAbout: "",
      excitedAbout: "",
      profilepic: "",
    },
  });

  function onSubmit(values: z.infer<typeof MainFormSchema>) {
    createMainInfo({ ...values, profilePic: "" });
  }

  const { mutate: createMainInfo } = trpc.createMainUserInfo.useMutation({
    onSuccess: () => {
      redirect("/", RedirectType.replace);
    },
  });

  if (!questions) return null;

  return (
    <Form {...mainform}>
      <form onSubmit={mainform.handleSubmit(onSubmit)} className="space-y-8">
        {questions.map((formItem) => {
          return (
            <FormField
              key={formItem.name}
              name={formItem.name}
              control={mainform.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>
                      {formItem.question}{" "}
                      {formItem?.required && (
                        <span className="text-red-500">*</span>
                      )}
                    </FormLabel>
                    {formItem.info ? (
                      <FormDescription>{formItem.info}</FormDescription>
                    ) : null}
                    <FormControl>
                      <Input
                        {...field}
                        type={formItem.type}
                        accept={formItem.accept && formItem.accept.join(",")}
                        // required={formItem.required}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          );
        })}

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
