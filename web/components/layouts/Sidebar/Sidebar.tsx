'use client';

import { ChevronsUpDown, LogOut, Moon, Plus, Sun } from 'lucide-react';
import * as React from 'react';

import ConversationCard from '@/components/blocks/Card/ConversationCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Home } from 'lucide-react';
import { BiSolidLeftArrow } from 'react-icons/bi';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarRail,
	SidebarTrigger,
	Sidebar as SidebarUI,
} from '@/components/ui/sidebar';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import {
	addConversation,
	getConversations,
} from '@/services/lifeline-angel/conversation';
import {
	useMultipleConversationStore,
	useTemporaryMultipleConversationStore,
} from '@/stores/lifeline-angel/conversation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function Sidebar({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const { data: session } = useSession();
	const [conversationQuery, setConversationQuery] = useState('');
	const [openSearch, setOpenSearch] = useState(false);
	const { setTheme } = useTheme();

	const {
		conversations: conversationsLocal,
		setConversations: setConversationsLocal,
		addConversation: addConversationLocal,
	} = useMultipleConversationStore();

	const {
		conversations: conversationsTemporary,
		setConversations: setConversationsTemporary,
		searchConversations: searchConversationsTemporary,
		addConversation: addConversationTemporary,
	} = useTemporaryMultipleConversationStore();

	const handleSetConversationQuery = (query: string) => {
		setConversationQuery(query);
	};

	const addConversationMutation = useMutation({
		mutationFn: async (cid: string) =>
			await addConversation(session?.user.email, cid),
	});

	const handleAddConversation = () => {
		const cid = uuidv4();

		addConversationLocal(cid);
		addConversationTemporary(cid);
		addConversationMutation.mutate(cid);
	};

	const handleSearchConversation = (query: string) => {
		searchConversationsTemporary(query);
	};

	const handleOpenSearch = (search: boolean) => {
		setOpenSearch(search);
	};

	const { data: conversationsServer } = useQuery({
		queryKey: ['getConversations'],
		queryFn: async () => await getConversations(session?.user.email),
	});

	useEffect(() => {
		setConversationsLocal(conversationsServer!);
		setConversationsTemporary(conversationsServer!);
	}, [conversationsServer]);

	return (
		<SidebarProvider>
			<SidebarUI collapsible='icon' className='min-w-14 dark:border-zinc-800'>
				<SidebarHeader className='bg-background'>
					<SidebarMenu>
						<SidebarMenuItem className='space-y-2'>
							<div className='flex justify-between'>
								<Link href='/'>
									<Avatar className='h-10 w-10 rounded-lg'>
										<AvatarImage
											src='/images/lifeline-angel.png'
											alt={session?.user.name}
										/>
										<AvatarFallback className='rounded-lg'>
											{session ? session?.user.name : 'G'}
										</AvatarFallback>
									</Avatar>
								</Link>
							</div>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										className='w-full'
										onClick={() => handleAddConversation()}
									>
										<Plus />
									</Button>
								</TooltipTrigger>
								<TooltipContent className='border-1 border-zinc-200 dark:border-zinc-800'>
									<p>New conversation</p>
								</TooltipContent>
							</Tooltip>
							<div className='flex space-x-3'>
								{openSearch && (
									<button
										className='bg-background text-foreground text-2xl text-center leading-none'
										onClick={() => handleOpenSearch(false)}
									>
										<BiSolidLeftArrow />
									</button>
								)}
								<Input
									type='text'
									placeholder='Search conversation'
									onChange={(event) =>
										handleSetConversationQuery(event.target.value)
									}
									onClick={() => handleOpenSearch(true)}
									onKeyUp={(event) => {
										if (event.key === 'Enter' && conversationQuery.length > 0) {
											return handleSearchConversation(conversationQuery);
										}

										return setConversationsTemporary(conversationsLocal);
									}}
								/>
							</div>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>
				<SidebarContent className='bg-background no-scrollbar'>
					<SidebarGroup className='no-scrollbar'>
						<SidebarMenu className='space-y-1 no-scrollbar'>
							{openSearch && (
								<>
									{conversationsTemporary?.map((conv) => (
										<ConversationCard key={conv.id} conv={conv} />
									))}
								</>
							)}
							{!openSearch && (
								<>
									{conversationsLocal?.map((conv) => (
										<ConversationCard key={conv.id} conv={conv} />
									))}
								</>
							)}
						</SidebarMenu>
					</SidebarGroup>
				</SidebarContent>
				<SidebarFooter className='bg-background'>
					<SidebarMenu>
						<SidebarMenuItem>
							<Link href='/'>
								<Button variant='outline' size='icon' className='w-full'>
									<Home />
								</Button>
							</Link>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant='outline' size='icon' className='w-full'>
										<Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
										<Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
										<span className='sr-only'>Toggle theme</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align='end'
									className='dark:border-zinc-800'
								>
									<DropdownMenuItem onClick={() => setTheme('light')}>
										Light
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => setTheme('dark')}>
										Dark
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => setTheme('system')}>
										System
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarTrigger
								variant='outline'
								className='text-foreground py-4 w-full  rounded-xl'
							/>
						</SidebarMenuItem>
						<SidebarMenuItem className='mx-auto'>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<SidebarMenuButton
										size='lg'
										className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
									>
										<Avatar className='h-8 w-8 rounded-lg'>
											<AvatarImage
												src={session?.user.image}
												alt={session?.user.name}
											/>
											<AvatarFallback className='rounded-lg'>
												{session ? session?.user.name : 'G'}
											</AvatarFallback>
										</Avatar>
										<div className='grid flex-1 text-left text-sm leading-tight'>
											<span className='truncate font-semibold text-foreground'>
												{session ? session?.user.name : 'Guest'}
											</span>
											<span className='truncate text-xs text-foreground'>
												{session?.user.email}
											</span>
										</div>
										<ChevronsUpDown className='ml-auto size-4 text-foreground' />
									</SidebarMenuButton>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg dark:border-zinc-800'
									side='bottom'
									align='end'
									sideOffset={4}
								>
									<DropdownMenuLabel className='p-0 font-normal'>
										<div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
											<Avatar className='h-8 w-8 rounded-lg'>
												<AvatarImage
													src={session?.user.image}
													alt={session?.user.name}
												/>
												<AvatarFallback className='rounded-lg'>
													{session ? session?.user.name : 'G'}
												</AvatarFallback>
											</Avatar>
											<div className='grid flex-1 text-left text-sm leading-tight'>
												<span className='truncate font-semibold'>
													{session ? session?.user.name : 'Guest'}
												</span>
												<span className='truncate text-xs'>
													{session ? session?.user.email : 'No email'}
												</span>
											</div>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									{session && (
										<DropdownMenuItem onClick={() => signOut()}>
											<LogOut />
											Log out
										</DropdownMenuItem>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
				<SidebarRail />
			</SidebarUI>
			<SidebarInset>
				<header className='flex shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-4'></header>
				<div className='flex flex-col gap-4 p-3 no-scrollbar h-[100rem] sm:h-auto'>
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
