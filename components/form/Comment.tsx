"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { CommentValidation } from "@/lib/validations/thread";
import { CommentDefaultValues } from "../../lib/default-values";
import { addCommentToThread } from "@/lib/actions/thread.actions";

type Props = {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
};

function Comment({ threadId, currentUserImg, currentUserId }: Props) {
  const pathname = usePathname();

  const commentDefaultValues: z.infer<typeof CommentValidation> = {
    thread: "",
    accountId: currentUserId,
  };
  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: commentDefaultValues || CommentDefaultValues,
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    const commentData = {
      threadId: threadId,
      commentText: values.thread as string,
      userId: JSON.parse(currentUserId),
      path: pathname,
    };
    await addCommentToThread({...commentData});

    form.reset();
  };

  return (
    <Form {...form}>
      <form className="comment-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-3">
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt="current_user"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  {...field}
                  placeholder="Comment..."
                  className="no-focus text-light-1 outline-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="comment-form_btn">
          Reply
        </Button>
      </form>
    </Form>
  );
}

export default Comment;
