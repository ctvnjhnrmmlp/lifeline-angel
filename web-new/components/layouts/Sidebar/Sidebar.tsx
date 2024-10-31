'use client';

import {
	BadgeCheck,
	Bell,
	Check,
	ChevronsUpDown,
	CreditCard,
	GalleryVerticalEnd,
	LogOut,
	Search,
	Sparkles,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInput,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarRail,
	SidebarTrigger,
	Sidebar as SidebarUI,
} from '@/components/ui/sidebar';
import { useState } from 'react';

const data = {
	versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
	navMain: [
		{
			title: 'Architecture',
			url: '#',
			items: [
				{
					title: 'Accessibility',
					url: '#',
				},
				{
					title: 'Fast Refresh',
					url: '#',
				},
				{
					title: 'Next.js Compiler',
					url: '#',
				},
				{
					title: 'Supported Browsers',
					url: '#',
				},
				{
					title: 'Turbopack',
					url: '#',
				},
			],
		},
	],
};

export default function Sidebar() {
	const [selectedVersion, setSelectedVersion] = useState(data.versions[0]);

	return (
		<SidebarProvider>
			<SidebarUI>
				<SidebarHeader>
					<SidebarMenu>
						<SidebarMenuItem>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<SidebarMenuButton
										size='lg'
										className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
									>
										<div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
											<GalleryVerticalEnd className='size-4' />
										</div>
										<div className='flex flex-col gap-0.5 leading-none'>
											<span className='font-semibold'>Documentation</span>
											<span className=''>v{selectedVersion}</span>
										</div>
										<ChevronsUpDown className='ml-auto' />
									</SidebarMenuButton>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									className='w-[--radix-dropdown-menu-trigger-width]'
									align='start'
								>
									{data.versions.map((version) => (
										<DropdownMenuItem
											key={version}
											onSelect={() => setSelectedVersion(version)}
										>
											v{version}{' '}
											{version === selectedVersion && (
												<Check className='ml-auto' />
											)}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</SidebarMenuItem>
					</SidebarMenu>
					<form>
						<SidebarGroup className='py-0'>
							<SidebarGroupContent className='relative'>
								<Label htmlFor='search' className='sr-only'>
									Search
								</Label>
								<SidebarInput
									id='search'
									placeholder='Search the docs...'
									className='pl-8'
								/>
								<Search className='pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50' />
							</SidebarGroupContent>
						</SidebarGroup>
					</form>
				</SidebarHeader>
				<SidebarContent>
					{/* We create a SidebarGroup for each parent. */}
					{data.navMain.map((item) => (
						<SidebarGroup key={item.title}>
							<SidebarGroupLabel>{item.title}</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									{item.items.map((item) => (
										<SidebarMenuItem key={item.title}>
											<SidebarMenuButton asChild isActive={item.isActive}>
												<a href={item.url}>{item.title}</a>
											</SidebarMenuButton>
										</SidebarMenuItem>
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					))}
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
											// src={data.user.avatar}
											// alt={data.user.name}
											/>
											<AvatarFallback className='rounded-lg'>CN</AvatarFallback>
										</Avatar>
										<div className='grid flex-1 text-left text-sm leading-tight'>
											<span className='truncate font-semibold'>
												{/* {data.user.name} */}
											</span>
											<span className='truncate text-xs'>
												{/* {data.user.email} */}
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
												// src={data.user.avatar}
												// alt={data.user.name}
												/>
												<AvatarFallback className='rounded-lg'>
													CN
												</AvatarFallback>
											</Avatar>
											<div className='grid flex-1 text-left text-sm leading-tight'>
												<span className='truncate font-semibold'>
													{/* {data.user.name} */}
												</span>
												<span className='truncate text-xs'>
													{/* {data.user.email} */}
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
									<DropdownMenuItem>
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
				<header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
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
				</header>
				<div className='flex flex-1 flex-col gap-4 p-4'>
					<div className='grid auto-rows-min gap-4 md:grid-cols-3'>
						<div className='aspect-video rounded-xl bg-muted/50' />
						<div className='aspect-video rounded-xl bg-muted/50' />
						<div className='aspect-video rounded-xl bg-muted/50' />
					</div>
					<div className='min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min' />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
