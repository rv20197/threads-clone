import BottomBar from '@/components/shared/BottomBar';
import LeftSideBar from '@/components/shared/LeftSideBar';
import RightSideBar from '@/components/shared/RightSideBar';
import TopBar from '@/components/shared/TopBar';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

type Props = {
	children: ReactNode;
};

export const metadata: Metadata = {
	title: 'Threads',
	description: 'A Next.js 13 Meta Threads Application'
};

export default function RootLayout({ children }: Props) {
	return (
		<ClerkProvider
			appearance={{
				baseTheme: dark
			}}>
			<html lang='en' className={inter.className}>
				<body>
					<TopBar />
					<main className='flex flex-row'>
						<LeftSideBar />
						<section className='main-container'>
							<div className='w-full max-w-4xl'>{children}</div>
						</section>
						<RightSideBar />
					</main>
					<BottomBar />
				</body>
			</html>
		</ClerkProvider>
	);
}
