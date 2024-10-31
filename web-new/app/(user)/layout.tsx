'use client';

import {
	AudioWaveform,
	BadgeCheck,
	Bell,
	BookOpen,
	Bot,
	ChevronRight,
	ChevronsUpDown,
	Command,
	CreditCard,
	Folder,
	Forward,
	Frame,
	GalleryVerticalEnd,
	LogOut,
	Map,
	MoreHorizontal,
	PieChart,
	Plus,
	Settings2,
	Sparkles,
	SquareTerminal,
	Trash2,
} from 'lucide-react';
import * as React from 'react';

import ConversationCard from '@/components/Blocks/Card/ConversationCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarProvider,
	SidebarRail,
	SidebarTrigger,
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
import Link from 'next/link';
import { ReactNode, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// This is sample data.
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

export default function Layout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const { data: session } = useSession();
	const [conversationQuery, setConversationQuery] = useState('');
	const [openSearch, setOpenSearch] = useState(false);

	const {
		conversations: conversationsLocal,
		setConversations: setConversationsLocal,
		searchConversations: searchConversationsLocal,
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
		let cid = uuidv4();

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

	const {
		data: conversationsServer,
		error: conversationsError,
		status: conversationsStatus,
		fetchStatus: conversationsFetchStatus,
		refetch: refetchConversations,
	} = useQuery({
		queryKey: ['getConversations'],
		queryFn: async () => await getConversations(session?.user.email),
	});

	React.useEffect(() => {
		setConversationsLocal(conversationsServer!);
		setConversationsTemporary(conversationsServer!);
	}, [conversationsServer]);

	return (
		<SidebarProvider>
			<Sidebar collapsible='icon' className='bg-background min-w-14'>
				<SidebarHeader>
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
				<SidebarContent>
					<SidebarGroup>
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
				<SidebarFooter>
					<SidebarMenu>
						<SidebarMenuItem>
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
											<span className='truncate font-semibold'>
												{session?.user.name}
											</span>
											<span className='truncate text-xs'>
												{session?.user.email}
											</span>
										</div>
										<ChevronsUpDown className='ml-auto size-4' />
									</SidebarMenuButton>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
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
									<DropdownMenuGroup>
										<DropdownMenuItem>
											<Sparkles />
											Upgrade to Pro
										</DropdownMenuItem>
									</DropdownMenuGroup>
									<DropdownMenuSeparator />
									<DropdownMenuGroup>
										<DropdownMenuItem>
											<BadgeCheck />
											Account
										</DropdownMenuItem>
										<DropdownMenuItem>
											<CreditCard />
											Billing
										</DropdownMenuItem>
										<DropdownMenuItem>
											<Bell />
											Notifications
										</DropdownMenuItem>
									</DropdownMenuGroup>
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
			</Sidebar>
			<SidebarInset>
				<header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
					<div className='flex items-center gap-2 px-4'>
						<SidebarTrigger className='-ml-1' />
						<Separator orientation='vertical' className='mr-2 h-4' />
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem className='hidden md:block'>
									<BreadcrumbLink href='#'>
										Building Your Application
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator className='hidden md:block' />
								<BreadcrumbItem>
									<BreadcrumbPage>Data Fetching</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>
				<div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
					{/* <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
						<div className='aspect-video rounded-xl bg-muted/50' />
						<div className='aspect-video rounded-xl bg-muted/50' />
						<div className='aspect-video rounded-xl bg-muted/50' />
					</div>
					<div className='min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min' /> */}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
