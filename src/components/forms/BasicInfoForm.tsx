"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  BasicFormType,
  BasicFormSchema,
  generateUserDataFromFormForAI,
} from "../utils/form";

interface BasicInfoFormProps {
  questions: BasicFormType;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function BasicInfoForm({ questions }: BasicInfoFormProps) {
  const basicForm = useForm<z.infer<typeof BasicFormSchema>>({
    resolver: zodResolver(BasicFormSchema),
    defaultValues: {
      images: [],
      milestones: "",
      pronouns: "he/him",
      viralThing: "",
      workingOn: "",
      workingOnOwnIdeas:
        "yes -- i'm working full-time on my own ideas right now.",
      projectProgress: "",
    },
  });
  const watchedValues = basicForm.watch();

  async function onSubmit(values: z.infer<typeof BasicFormSchema>) {
    const prompt = generateUserDataFromFormForAI(values);
    console.log(prompt);
    const response = await axios.post("/api/replicate", { prompt });

    if (response.status !== 201) {
      console.log(response);
      return;
    }
    console.log(response.data.join(""));
  }

  if (!questions) return null;

  return (
    <Form {...basicForm}>
      <form
        onSubmit={basicForm.handleSubmit(onSubmit)}
        className="flex-[0.7] space-y-8 p-4"
      >
        {questions.map((formItem) => {
          if (formItem.dependsOn) {
            const dependentValue =
              watchedValues[formItem.dependsOn as keyof typeof watchedValues];
            if (dependentValue !== formItem.expectedDependantValue) {
              return null;
            }
          }
          return (
            <FormField
              key={formItem.name}
              control={basicForm.control}
              name={formItem.name!}
              render={({ field }) => (
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
                    {formItem.type === "select" ? (
                      <Select
                        defaultValue={formItem.options?.[0]}
                        onValueChange={field.onChange}
                        value={field.value as string | undefined}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {formItem.options?.map((option) => (
                            <SelectItem
                              className="capitalize"
                              key={option}
                              value={option}
                            >
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : formItem.type === "file" ? (
                      <Input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        multiple
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files && files.length > 0 && files.length <= 3) {
                            field.onChange([...Array.from(files)]);
                          } else {
                            field.onChange(null);
                          }
                        }}
                      />
                    ) : formItem.type === "radio" ? (
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value as string}
                        className="flex flex-col space-y-1"
                      >
                        {formItem.options?.map((option) => (
                          <FormItem
                            key={option}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem value={option} />
                            </FormControl>
                            <FormLabel className="font-normal capitalize">
                              {option}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    ) : (
                      <Input
                        type={formItem.type}
                        {...field}
                        value={field.value as string}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
