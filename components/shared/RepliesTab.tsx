import ThreadCard from "../cards/ThreadCard";
import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { fetchPosts } from "@/lib/actions/thread.actions";

const RepliesTab = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboardedStatus) redirect("/onboarding");
  const { posts } = await fetchPosts(1, 20, false, userInfo._id);

  return (
    <section className="mt-9 flex flex-col gap-10">
      {posts.map((thread: any) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={user?.id as string}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      ))}
    </section>
  );
};

export default RepliesTab;
