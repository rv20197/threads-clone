'use client';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import * as z from "zod"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserValidation } from '../../lib/validations/user';
import { UserDefaultValues } from '../../lib/default_values/user';

type UserDataType = {
	id: string | undefined;
	objectId: string;
	username: string | null | undefined;
	name: string;
	bio: string;
	image: string | undefined;
};

type Props = {
	user: UserDataType;
	btnTitle: string;
};

const AccountProfile = ({ user, btnTitle }: Props) => {
	const form = useForm({
		resolver: zodResolver(UserValidation),
		defaultValues: UserDefaultValues
	});

	function onSubmit(values: z.infer<typeof UserValidation>) {
		console.log(values);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
				<FormField
					control={form.control}
					name='username'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input placeholder='shadcn' {...field} />
							</FormControl>
							<FormDescription>
								This is your public display name.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit'>{btnTitle}</Button>
			</form>
		</Form>
	);
};

export default AccountProfile;
