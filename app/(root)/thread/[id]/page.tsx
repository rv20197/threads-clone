import ThreadCard from '@/components/cards/ThreadCard';
import Comment from '@/components/form/Comment';
import { fetchThreadById } from '@/lib/actions/thread.actions';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

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
	if (!userInfo?.onboardedStatus) redirect('/onboarding');

	const thread = await fetchThreadById(params.id);

	return (
		<section className='relative'>
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

			<div className='mt-7'>
				<Comment
					threadId={thread.id}
					currentUserImg={user.imageUrl}
					currentUserId={JSON.stringify(userInfo._id)}
				/>
			</div>
		</section>
	);
};

export default Page;
