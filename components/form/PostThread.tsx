"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Textarea } from "../ui/textarea";

import { createThread } from "@/lib/actions/thread.actions";
import { ThreadDefaultValues } from "@/lib/default-values";
import { ThreadValidation } from "@/lib/validations/thread";
import { usePathname, useRouter } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";

type Props = {
  userId: string;
};

const PostThread = ({ userId }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const { organization } = useOrganization();

  const threadDefaultValues: z.infer<typeof ThreadValidation> = {
    thread: "",
    accountId: userId,
  };

  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: threadDefaultValues || ThreadDefaultValues,
  });

  async function onSubmit(values: z.infer<typeof ThreadValidation>) {
    try {
      const createThreadData = {
        text: values.thread,
        author: userId,
        communityId: organization ? organization.id : null,
        path: pathname,
      };
      await createThread(createThreadData);
      router.push("/");
    } catch (error: any) {
      console.error(`Failed to create thread: ${error}`);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-10 mt-10"
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex gap-3 w-full flex-col">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl className="no-focus border-dark-4 bg-dark-3 text-light-1">
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="bg-primary-500">
          Post Thread
        </Button>
      </form>
    </Form>
  );
};

export default PostThread;
