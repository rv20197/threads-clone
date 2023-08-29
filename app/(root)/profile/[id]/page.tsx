import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

type Props={
    params:{
        id:string
    }
}

async function Page({params}:Props) {
    const user = await currentUser();

	if (!user) return null;

	const userInfo = await fetchUser(params.id);

	if (!userInfo?.onboardedStatus) redirect('/onboarding');

	const userId = userInfo._id.toString();
  return <section>Profile</section>;
}

export default Page;
