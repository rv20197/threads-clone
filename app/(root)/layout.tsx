import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import '../globals.css';
import { ClerkProvider } from '@clerk/nextjs/app-beta';
import { TopBar, LeftSideBar, RightSideBar, BottomBar } from '../../components';

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
		<ClerkProvider>
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
