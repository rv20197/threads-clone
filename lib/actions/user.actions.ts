"use server";

import { revalidatePath } from "next/cache";
import { User } from "../models/user.model";
import { connectToDB } from "../mongoose.connection";
import Thread from "../models/thread.model";

type Params = {
	userId: string | undefined;
	username: string;
	name: string;
	bio: string;
	image: string;
	path: string;
};

export async function updateUser(userData: Params): Promise<void> {
	const { userId, username, name, bio, image, path } = userData;
	connectToDB();

	try {
		await User.findOneAndUpdate(
			{
				id: userId,
			},
			{
				username: username.toLowerCase(),
				name,
				bio,
				image,
				path,
				onboardedStatus: true,
			},
			{
				upsert: true,
			}
		);

		if (path === "/profile/edit") {
			revalidatePath(path);
		}
	} catch (error: any) {
		throw new Error(`Failed to create/update user: ${error.message}`);
	}
}

export async function fetchUser(userId: string) {
	connectToDB();
	try {
		const user = await User.findOne({ id: userId });
		//.populate({
		// 	path: 'communities',
		// 	model: Community
		// });
		return user;
	} catch (error: any) {
		throw new Error(`Failed to fetch user: ${error.message}`);
	}
}

export async function fetchUserPosts(userId: string) {
	connectToDB();
	try {
		// Find all threads authored by user
		const threads = await User.findOne({ _id: userId }).populate({
			path: "threads",
			model: Thread,
			populate: {
				path: "children",
				model: Thread,
				populate: {
					path: "author",
					model: User,
					select: "name image id",
				},
			},
		});
		return threads;
	} catch (error: any) {
		throw new Error(`Failed to fetch user posts: ${error.message}`);
	}
}
