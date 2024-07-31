'use client';

import {
	Avatar,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	ScrollShadow,
} from '@nextui-org/react';
import Link from 'next/link';
import { BiSolidRightArrow } from 'react-icons/bi';
import { FaGear } from 'react-icons/fa6';
import { ImPlus } from 'react-icons/im';
import { v4 as uuidv4 } from 'uuid';
import { FaShield } from 'react-icons/fa6';
import { IoIosPaper, IoIosWarning } from 'react-icons/io';
import { FaLifeRing } from 'react-icons/fa';
import { FaQuestion } from 'react-icons/fa';
import { IoMdDownload } from 'react-icons/io';
import { FiPaperclip } from 'react-icons/fi';
import { signOut } from 'next-auth/react';

const Sidebar = () => {
	const test = [
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
	];

	const settings = [
		{
			name: 'Preferences',
			icon: FaGear,
		},
		{
			name: 'Privacy',
			icon: FaShield,
		},
		{
			name: 'Terms',
			icon: IoIosPaper,
		},
		{
			name: 'Conditions',
			icon: FiPaperclip,
		},
		{
			name: 'Safety',
			icon: FaLifeRing,
		},
		{
			name: 'Help',
			icon: FaQuestion,
		},
		{
			name: 'Report',
			icon: IoIosWarning,
		},
	];

	return (
		<aside className='fixed flex flex-col justify-center p-4 z-10 h-screen'>
			<div className='hidden lg:block overflow-y-scroll no-scrollbar backdrop-blur-2xl bg-foreground/5 rounded-2xl h-screen w-96'>
				<div className='flex flex-col flex-wrap justify-between space-between px-4 py-6 gap-4'>
					{/* Header Container */}
					<div className='flex justify-between items-center'>
						<div>
							<Dropdown className='backdrop-blur-2xl bg-foreground/1'>
								<DropdownTrigger>
									<Avatar
										size='lg'
										radius='md'
										src='https://i.pravatar.cc/150?u=a04258a2462d826712d'
									/>
								</DropdownTrigger>
								<DropdownMenu aria-label='Static Actions'>
									{settings.map((setting) => (
										<DropdownItem
											key={setting.name}
											className='font-bold text-xl'
											startContent={<setting.icon />}
										>
											<span className='font-bold text-xl font-bold'>
												{setting.name}
											</span>
										</DropdownItem>
									))}
									<DropdownItem
										key='Install'
										className='font-bold text-xl'
										startContent={<IoMdDownload />}
									>
										<span className='font-bold text-xl font-bold'>
											Install
										</span>
									</DropdownItem>
									<DropdownItem
										key='Logout'
										className='font-bold text-xl'
										startContent={<BiSolidRightArrow />}
										onPress={() => signOut()}
									>
										<span className='font-bold text-xl font-bold'>
											Logout
										</span>
									</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						</div>
						<div className='flex flex-grow justify-end gap-2'>
							<Link href='/'>
								<button className='block rounded-full p-3 bg-foreground text-background text-2xl'>
									<ImPlus />
								</button>
							</Link>
						</div>
					</div>
					{/* Search Container */}
					<div>
						<input
							type='text'
							placeholder='Search conversation'
							className='p-4 w-full rounded-xl placeholder:font-bold placeholder:text-foreground font-bold text-foreground text-xl'
						/>
					</div>
					{/* Messages Container */}
					<div className='overflow-y-scroll no-scrollbar h-screen'>
						<ScrollShadow className='flex flex-col gap-2 overflow-y-scroll no-scrollbar py-4 h-screen'>
							{test.map((t) => (
								<div
									key={t}
									className='backdrop-blur-2xl bg-foreground/5 rounded-xl'
								>
									<Link
										href={`/conversation
									/${t}`}
									>
										<div className='rounded-xl cursor-pointer p-4'>
											<p className='font-bold w-full text-xl text-foreground tracking-tight leading-none text-ellipsi text-balance'>
												{t}
											</p>
											<p className='font-light w-full text-sm text-zinc-700 tracking-tight leading-none text-ellipsis text-balance'>
												{t}
											</p>
										</div>
									</Link>
								</div>
							))}
						</ScrollShadow>
					</div>
				</div>
			</div>
		</aside>
	);
};

export default Sidebar;
