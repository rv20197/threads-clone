'use server';
import { connectToDB } from '@/lib/mongoose.connection';
import { revalidatePath } from 'next/cache';
import Thread from '../models/thread.model';
import { User } from '../models/user.model';

type threadDataType = {
	text: string;
	author: string;
	communityId: string | null;
	path: string;
};

type commentDataType = {
	threadId: string;
	commentText: string;
	userId: string;
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

export async function addCommentToThread(commentData: commentDataType) {
	const { threadId, commentText, userId, path } = commentData;
	connectToDB();

	try {
		const originalThread = await Thread.findById(threadId);
		if (!originalThread) {
			throw new Error('Thread not found!');
		}

		const commentThread = new Thread({
			text: commentText,
			author: userId,
			parentId: threadId
		});

		const savedCommentThread = await commentThread.save();

		originalThread.children.push(savedCommentThread._id);

		await originalThread.save();

		revalidatePath(path);
	} catch (error: any) {
		throw new Error(`Failed to add comment: ${error.message}`);
	}
}
