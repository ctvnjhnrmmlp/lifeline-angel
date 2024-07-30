'use client';

import {
	Avatar,
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	ScrollShadow,
} from '@nextui-org/react';
import Link from 'next/link';
import { ImPlus } from 'react-icons/im';
import { TfiLayoutGrid3Alt } from 'react-icons/tfi';
import { v4 as uuidv4 } from 'uuid';

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

	return (
		<aside className='fixed flex flex-col justify-center p-4 z-10 h-screen'>
			<div className='hidden lg:block overflow-y-scroll no-scrollbar backdrop-blur-2xl bg-foreground/5 rounded-2xl h-screen w-96'>
				<div className='flex flex-col flex-wrap justify-between space-between px-4 py-6 gap-4'>
					{/* Header Container */}
					<div className='flex justify-between items-center'>
						<div>
							<Dropdown
								className='bg-background'
								classNames={
									{
										// base: 'bg-background',
									}
								}
							>
								<DropdownTrigger>
									<Avatar
										size='lg'
										radius='md'
										src='https://i.pravatar.cc/150?u=a04258a2462d826712d'
									/>
									{/* <button className='block rounded-full p-3 bg-foreground text-background text-2xl'>
										<TfiLayoutGrid3Alt />
									</button> */}
								</DropdownTrigger>
								<DropdownMenu aria-label='Static Actions'>
									<DropdownItem key='new'>New file</DropdownItem>
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
