'use client';

import {
	addConversation,
	deleteConversation,
	getConversations,
	updateConversation,
} from '@/services/lifeline-angel/conversation';
import SETTINGS from '@/sources/settings';
import {
	Avatar,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	ScrollShadow,
} from '@nextui-org/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { BiSolidRightArrow } from 'react-icons/bi';
import { ImPlus } from 'react-icons/im';
import { IoMdDownload } from 'react-icons/io';

const Sidebar = () => {
	const { data: session } = useSession();
	const queryClient = useQueryClient();

	const {
		data: conversations,
		error: conversationsError,
		status: conversationsStatus,
		fetchStatus: conversationsFetchStatus,
		refetch: refetchGetConversations,
	} = useQuery({
		queryKey: ['getConversations'],
		queryFn: async () => await getConversations(session?.user.email),
	});

	const addConversationMutation = useMutation({
		mutationFn: async () => await addConversation(session?.user.email),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ['getConversations'] }),
	});

	const updateConversationMutation = useMutation({
		mutationFn: async () =>
			await updateConversation(session?.user.email, '', ''),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ['getConversations'] }),
	});

	const deleteConversationMutation = useMutation({
		mutationFn: async () => await deleteConversation(),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ['getConversations'] }),
	});

	if (conversationsStatus == 'success') {
		console.log(conversations);
	}

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
									{/* @ts-ignore */}
									{SETTINGS.map((setting) => (
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
										<span className='font-bold text-xl font-bold'>Install</span>
									</DropdownItem>
									{/* @ts-ignore */}
									<DropdownItem
										key='Logout'
										className='font-bold text-xl'
										startContent={<BiSolidRightArrow />}
										onPress={() => signOut()}
									>
										<span className='font-bold text-xl font-bold'>Logout</span>
									</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						</div>
						<div className='flex flex-grow justify-end gap-2'>
							<Link href='/'>
								<button
									className='block rounded-full p-3 bg-foreground text-background text-2xl'
									onClick={() => {
										addConversationMutation.mutate();
									}}
								>
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
							{conversations?.map((conv) => (
								<div
									key={conv.id}
									className='backdrop-blur-2xl bg-foreground/5 rounded-xl'
								>
									<Link
										href={`/conversation
									/${conv.id}`}
									>
										<div className='rounded-xl cursor-pointer p-4'>
											<p className='font-bold w-full text-xl text-foreground tracking-tight leading-none text-ellipsi text-balance'>
												{conv.id}
											</p>
											<p className='font-light w-full text-sm text-zinc-700 tracking-tight leading-none text-ellipsis text-balance'>
												{conv.updatedAt}
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
