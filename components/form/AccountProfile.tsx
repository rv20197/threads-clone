'use client';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { updateUser } from '@/lib/actions/user.actions';
import { UserDefaultValues } from '@/lib/default-values';
import { useUploadThing } from '@/lib/uploadthing';
import { isBase64Image } from '@/lib/utils';
import { UserValidation } from '@/lib/validations/user';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Textarea } from '../ui/textarea';

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
	const [files, setFiles] = useState<File[]>([]);
	const { startUpload } = useUploadThing('media');
	const pathname = usePathname();
	const router = useRouter();

	const userDefaultValues: z.infer<typeof UserValidation> = {
		profile_photo: user?.image as string,
		name: user?.name,
		username: user?.username as string,
		bio: user?.bio
	};
	const form = useForm({
		resolver: zodResolver(UserValidation),
		defaultValues: userDefaultValues || UserDefaultValues
	});

	function handleImage(
		e: ChangeEvent<HTMLInputElement>,
		fieldChange: (value: string) => void
	) {
		e.preventDefault();
		const fileReader = new FileReader();
		if (e.target.files && e.target.files.length) {
			const file = e.target.files[0];
			setFiles(Array.from(e.target.files));

			if (!file.type.includes('image')) return;

			fileReader.onload = async event => {
				const imageDataUrl = event.target?.result?.toString() || '';

				fieldChange(imageDataUrl);
			};

			fileReader.readAsDataURL(file);
		}
	}

	async function onSubmit(values: z.infer<typeof UserValidation>) {
		const blob = values.profile_photo;
		const hasImageChanged = isBase64Image(blob);

		if (hasImageChanged) {
			const imgRes = await startUpload(files);
			if (imgRes && imgRes[0].url) {
				values.profile_photo = imgRes[0].url;
			}
		}

		// TODO: Update user profile
		const userData = {
			userId: user.id,
			username: values.username,
			name: values.name,
			bio: values.bio,
			image: values.profile_photo,
			path: pathname
		};
		await updateUser(userData);

		pathname === '/profile/edit' ? router.back() : router.push('/');
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='flex flex-col justify-start gap-10'>
				<FormField
					control={form.control}
					name='profile_photo'
					render={({ field }) => (
						<FormItem className='flex items-center gap-4'>
							<FormLabel className='account-form_image-label'>
								{field.value ? (
									<Image
										src={field.value}
										alt='profile photo'
										width={96}
										height={96}
										priority
										className='rounded-full object-contain'
									/>
								) : (
									<Image
										src='/assets/profile.svg'
										alt='profile photo'
										width={24}
										height={24}
										className='object-contain'
									/>
								)}
							</FormLabel>
							<FormControl className='flex-1 text-base-semibol text-gray-200'>
								<Input
									type='file'
									accept='image/*'
									placeholder='Upload a photo'
									className='account-form_image-input'
									onChange={e => handleImage(e, field.onChange)}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem className='flex gap-3 w-full flex-col'>
							<FormLabel className='text-base-semibold text-light-2'>
								Name
							</FormLabel>
							<FormControl>
								<Input
									type='text'
									className='account-form_input no-focus'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='username'
					render={({ field }) => (
						<FormItem className='flex gap-3 w-full flex-col'>
							<FormLabel className='text-base-semibold text-light-2'>
								Username
							</FormLabel>
							<FormControl>
								<Input
									type='text'
									className='account-form_input no-focus'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='bio'
					render={({ field }) => (
						<FormItem className='flex flex-col gap-3 w-full'>
							<FormLabel className='text-base-semibold text-light-2'>
								Bio
							</FormLabel>
							<FormControl>
								<Textarea
									rows={10}
									className='account-form_input no-focus'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit' className='bg-primary-500'>
					{btnTitle}
				</Button>
			</form>
		</Form>
	);
};

export default AccountProfile;
