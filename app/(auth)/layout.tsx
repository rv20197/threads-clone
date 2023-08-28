import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

type Props = {
	children: ReactNode;
};

export const metadata: Metadata = {
	title: 'Auth',
	description: 'A Next.js 13 Meta Threads Application'
};

export default function RootLayout({ children }: Props) {
	return (
		<ClerkProvider
			appearance={{
				baseTheme: dark
			}}>
			<html lang='en' className={`${inter.className} bg-dark-1`}>
				<body>{children}</body>
			</html>
		</ClerkProvider>
	);
}
