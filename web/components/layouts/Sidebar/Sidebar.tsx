'use client';

import {
	AudioWaveform,
	ChevronsUpDown,
	Command,
	GalleryVerticalEnd,
	LogOut,
	Moon,
	Plus,
	SquareTerminal,
	Sun,
} from 'lucide-react';
import * as React from 'react';

import ConversationCard from '@/components/blocks/Card/ConversationCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

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
import { ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const data = {
	user: {
		name: 'shadcn',
		email: 'm@example.com',
		avatar: '/avatars/shadcn.jpg',
	},
	teams: [
		{
			name: 'Acme Inc',
			logo: GalleryVerticalEnd,
			plan: 'Enterprise',
		},
		{
			name: 'Acme Corp.',
			logo: AudioWaveform,
			plan: 'Startup',
		},
		{
			name: 'Evil Corp.',
			logo: Command,
			plan: 'Free',
		},
	],
	navMain: [
		{
			title: 'Playground',
			url: '#',
			icon: SquareTerminal,
			isActive: true,
		},
	],
};

export default function Sidebar({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const { data: session } = useSession();
	// const [conversationQuery, setConversationQuery] = useState('');
	// const [openSearch, setOpenSearch] = useState(false);
	const openSearch = true;
	const { setTheme } = useTheme();

	const {
		conversations: conversationsLocal,
		setConversations: setConversationsLocal,
		// searchConversations: searchConversationsLocal,
		addConversation: addConversationLocal,
	} = useMultipleConversationStore();

	const {
		conversations: conversationsTemporary,
		setConversations: setConversationsTemporary,
		// searchConversations: searchConversationsTemporary,
		addConversation: addConversationTemporary,
	} = useTemporaryMultipleConversationStore();

	// const handleSetConversationQuery = (query: string) => {
	// 	setConversationQuery(query);
	// };

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

	// const handleSearchConversation = (query: string) => {
	// 	searchConversationsTemporary(query);
	// };

	// const handleOpenSearch = (search: boolean) => {
	// 	setOpenSearch(search);
	// };

	const {
		data: conversationsServer,
		// error: conversationsError,
		// status: conversationsStatus,
		// fetchStatus: conversationsFetchStatus,
		// refetch: refetchConversations,
	} = useQuery({
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
							<Link href='/'>
								<Avatar className='h-10 w-10 rounded-lg'>
									<AvatarImage
										src='/images/lifeline-angel.png'
										alt={data.user.name}
									/>
									<AvatarFallback className='rounded-lg'>CN</AvatarFallback>
								</Avatar>
							</Link>
							<Button
								className='w-full'
								onClick={() => handleAddConversation()}
							>
								<Plus />
							</Button>
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
											<AvatarFallback className='rounded-lg'>CN</AvatarFallback>
										</Avatar>
										<div className='grid flex-1 text-left text-sm leading-tight'>
											<span className='truncate font-semibold text-foreground'>
												{session?.user.name}
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
													CN
												</AvatarFallback>
											</Avatar>
											<div className='grid flex-1 text-left text-sm leading-tight'>
												<span className='truncate font-semibold'>
													{session?.user.name}
												</span>
												<span className='truncate text-xs'>
													{session?.user.email}
												</span>
											</div>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={() => signOut()}>
										<LogOut />
										Log out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
				<SidebarRail />
			</SidebarUI>
			<SidebarInset>
				<header className='flex shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-4'></header>
				<div className='flex flex-col gap-4 p-3 no-scrollbar'>{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
