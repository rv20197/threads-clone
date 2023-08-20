'use server';
import { revalidatePath } from 'next/cache';
import Thread from '../models/thread.model';
import { User } from '../models/user.model';
import { connectToDB } from '@/lib/mongoose.connection';

type threadDataType = {
	text: string;
	author: string;
	communityId: string | null;
	path: string;
};

export async function createThread(threadData: threadDataType) {
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

export async function fetchPosts(
	pageNumber: number = 1,
	pageSize: number = 20
) {
	try {
		connectToDB();

		const skipAmount = (pageNumber - 1) * pageSize;

		const postQuery = Thread.find({
			parentId: { $in: [null, undefined] }
		})
			.sort({ createdAt: 'desc' })
			.skip(skipAmount)
			.limit(pageSize)
			.populate({ path: 'author', model: User })
			.populate({
				path: 'children',
				populate: {
					path: 'author',
					model: User,
					select: '_id name parentId image'
				}
			});

		const totalPostsCount = await Thread.countDocuments({
			parentId: { $in: [null, undefined] }
		});

		const posts = await postQuery.exec();

		const isNext = totalPostsCount > skipAmount + posts.length;

		return { posts, isNext };
	} catch (error: any) {
		throw new Error(`Failed to fetch posts: ${error.message}`);
	}
}

export async function fetchThreadById(threadId: string) {
	connectToDB();
	try {
		const thread = await Thread.findById(threadId)
			.populate({
				path: 'author',
				model: User,
				select: '_id id name image'
			})
			.populate({
				path: 'children',
				populate: [
					{
						path: 'author',
						model: User,
						select: '_id name parentId image'
					},
					{
						path: 'children',
						model: Thread,
						populate: {
							path: 'author',
							model: User,
							select: '_id name parentId image'
						}
					}
				]
			})
			.exec();
		return thread;
	} catch (error: any) {
		throw new Error(`Failed to fetch the thread: ${error.message}`);
	}
}
