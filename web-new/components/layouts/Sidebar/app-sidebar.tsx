'use client';

import {
	ArchiveX,
	ChevronRight,
	Command,
	File,
	Inbox,
	Plus,
	Send,
	Trash2,
} from 'lucide-react';
import * as React from 'react';
import { Label } from '../../ui/label';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarInput,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '../../ui/sidebar';
import { Switch } from '../../ui/switch';
import NavUser from './nav-user';

const data = {
	user: {
		name: 'shadcn',
		email: 'm@example.com',
		avatar: '/avatars/shadcn.jpg',
	},
	navMain: [
		{
			title: 'Conversations',
			url: '#',
			icon: Inbox,
			isActive: true,
		},
	],
	mails: [
		{
			name: 'Sophia White',
			email: 'sophiawhite@example.com',
			subject: 'Team Dinner',
			date: '1 week ago',
			teaser:
				"To celebrate our recent project success, I'd like to organize a team dinner.\nAre you available next Friday evening? Please let me know your preferences.",
		},
	],
};

import ConversationCard from '@/components/Blocks/Card/ConversationCard';
import { Button } from '@/components/ui/button';

import {
	addConversation,
	getConversations,
} from '@/services/lifeline-angel/conversation';
import {
	useMultipleConversationStore,
	useTemporaryMultipleConversationStore,
} from '@/stores/lifeline-angel/conversation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function AppSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	// Note: I'm using state to show active item.
	// IRL you should use the url/router.
	const [activeItem, setActiveItem] = React.useState(data.navMain[0]);
	const [mails, setMails] = React.useState(data.mails);
	const { setOpen } = useSidebar();
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

	useEffect(() => {
		setConversationsLocal(conversationsServer!);
		setConversationsTemporary(conversationsServer!);
	}, [conversationsServer]);

	return (
		<Sidebar
			collapsible='icon'
			className='overflow-hidden [&>[data-sidebar=sidebar]]:flex-row'
			{...props}
		>
			{/* This is the first sidebar */}
			{/* We disable collapsible and adjust width to icon. */}
			{/* This will make the sidebar appear as icons. */}
			<Sidebar
				collapsible='none'
				className='!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r'
			>
				<SidebarHeader>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton size='lg' asChild className='md:h-8 md:p-0'>
								<a href='#'>
									<div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
										<Command className='size-4' />
									</div>
									<div className='grid flex-1 text-left text-sm leading-tight'>
										<span className='truncate font-semibold'>Acme Inc</span>
										<span className='truncate text-xs'>Enterprise</span>
									</div>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupContent className='px-1.5 md:px-0'>
							<SidebarMenu>
								{data.navMain.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											tooltip={{
												children: item.title,
												hidden: false,
											}}
											onClick={() => {
												setActiveItem(item);
												const mail = data.mails.sort(() => Math.random() - 0.5);
												setMails(
													mail.slice(
														0,
														Math.max(5, Math.floor(Math.random() * 10) + 1)
													)
												);
												setOpen(true);
											}}
											isActive={activeItem.title === item.title}
											className='px-2.5 md:px-2'
										>
											<item.icon />
											<span>{item.title}</span>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
				<SidebarFooter>
					<NavUser
						user={{
							name: session?.user.name,
							email: session?.user.email,
							avatar: session?.user.image,
						}}
					/>
				</SidebarFooter>
			</Sidebar>

			{/* This is the second sidebar */}
			{/* We disable collapsible and let it fill remaining space */}
			<Sidebar collapsible='none' className='hidden flex-1 md:flex'>
				<SidebarHeader className='gap-3.5 border-b p-4'>
					<div className='flex w-full items-center justify-between'>
						<div className='text-base font-medium text-foreground'>
							{activeItem.title}
						</div>
						<Label className='flex items-center gap-2 text-sm'>
							<Button
								size='icon'
								className='rounded-full'
								onClick={() => handleAddConversation()}
							>
								<Plus className='h-4 w-4' />
							</Button>
						</Label>
					</div>
					<SidebarInput placeholder='Type to search...' />
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup className='px-0 no-scrollbar'>
						<SidebarGroupContent className='flex flex-col space-y-2 px-2 no-scrollbar'>
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
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
			</Sidebar>
		</Sidebar>
	);
}
