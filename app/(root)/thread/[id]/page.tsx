import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/form/Comment";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

type Props = {
	params: {
		id: string;
	};
};

const Page = async ({ params }: Props) => {
	if (!params.id) return null;

	const user = await currentUser();
	if (!user) return null;

	const userInfo = await fetchUser(user.id);
	if (!userInfo?.onboardedStatus) redirect("/onboarding");

	const thread = await fetchThreadById(params.id);

	return (
		<section className="relative">
			<div>
				<ThreadCard
					id={thread._id}
					currentUserId={user?.id as string}
					parentId={thread.parentId}
					content={thread.text}
					author={thread.author}
					community={thread.community}
					createdAt={thread.createdAt}
					comments={thread.children}
				/>
			</div>

			<div className="mt-7">
				<Comment
					threadId={thread.id}
					currentUserImg={userInfo.image}
					currentUserId={JSON.stringify(userInfo._id)}
				/>
			</div>

			<div className="mt-10">
				{thread.children.map((child: any) => (
					<ThreadCard
						id={child._id}
						currentUserId={user?.id as string}
						parentId={child.parentId}
						content={child.text}
						author={child.author}
						community={child.community}
						createdAt={child.createdAt}
						comments={child.children}
						key={child._id}
						isComment={true}
					/>
				))}
			</div>
		</section>
	);
};

export default Page;
