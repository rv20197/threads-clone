'use server';
import { revalidatePath } from 'next/cache';
import Thread from '../../models/thread.model';
import { User } from '../../models/user.model';
import { connectToDB } from '../mongoose.connection';

type Params = {
	text: string;
	author: string;
	communityId: string | null;
	path: string;
};

export async function createThread(threadData: Params) {
	const { text, author, communityId, path } = threadData;

	try {
		connectToDB();
		
		const createdThread = await Thread.create({
			text,
			author,
			community: null
		});

		await User.findByIdAndUpdate(author, {
			$push: {
				threads: createdThread._id
			}
		});

		revalidatePath(path);
	} catch (error: any) {
		throw new Error(`Failed to create thread: ${error.message}`);
	}
}
