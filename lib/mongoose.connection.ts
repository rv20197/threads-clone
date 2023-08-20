import mongoose from 'mongoose';

let isConnected: boolean = false;

export const connectToDB = async () => {
	mongoose.set('strictQuery', true);
	if (!process.env.MONGODB_URL) {
		return console.log('MONGODB_URL Not Found');
	}

	if (isConnected) {
		return console.log('Already connected to MongoDB');
	}

	try {
		await mongoose.connect(process.env.MONGODB_URL);
		isConnected = true;
	} catch (error) {
		console.log(error);
	}
};
