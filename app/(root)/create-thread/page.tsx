import PostThread from '@/components/form/PostThread';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

async function Page() {
	const user = await currentUser();

	if (!user) return null;

	const userInfo = await fetchUser(user.id);

	if (!userInfo?.onboardedStatus) redirect('/onboarding');

	const userId = userInfo._id.toString();

	return (
		<>
			<h1 className='head-text'>Create Thread</h1>
			<PostThread userId={userId} />
		</>
	);
}

export default Page;