'use client';

import ConversationButton from '@/components/blocks/Button/ConversationButton';
import {
	addConversation,
	getConversations,
} from '@/services/lifeline-angel/conversation';
import { useMultipleConversationStore } from '@/stores/lifeline-angel/conversation';
import {
	Avatar,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ScrollShadow,
	useDisclosure,
} from '@nextui-org/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { BiSolidRightArrow } from 'react-icons/bi';
import { FaLifeRing, FaQuestion } from 'react-icons/fa';
import { FaGear, FaShield } from 'react-icons/fa6';
import { FiPaperclip } from 'react-icons/fi';
import { ImPlus } from 'react-icons/im';
import { IoIosPaper, IoIosWarning, IoMdDownload } from 'react-icons/io';
import { v4 as uuidv4 } from 'uuid';

const Sidebar = () => {
	const { data: session } = useSession();

	const [conversationQuery, setConversationQuery] = React.useState('');

	const {
		isOpen: isOpenPreferences,
		onOpen: onOpenPreferences,
		onOpenChange: onOpenChangePreferences,
	} = useDisclosure();

	const {
		isOpen: isOpenPrivacy,
		onOpen: onOpenPrivacy,
		onOpenChange: onOpenChangePrivacy,
	} = useDisclosure();

	const {
		isOpen: isOpenTerms,
		onOpen: onOpenTerms,
		onOpenChange: onOpenChangeTerms,
	} = useDisclosure();

	const {
		isOpen: isOpenConditions,
		onOpen: onOpenConditions,
		onOpenChange: onOpenChangeConditions,
	} = useDisclosure();

	const {
		isOpen: isOpenSafety,
		onOpen: onOpenSafety,
		onOpenChange: onOpenChangeSafety,
	} = useDisclosure();

	const {
		isOpen: isOpenHelp,
		onOpen: onOpenHelp,
		onOpenChange: onOpenChangeHelp,
	} = useDisclosure();

	const {
		isOpen: isOpenReport,
		onOpen: onOpenReport,
		onOpenChange: onOpenChangeReport,
	} = useDisclosure();

	const {
		conversations: conversationsLocal,
		setConversations: setConversationsLocal,
		searchConversations: searchConversationsLocal,
		addConversation: addConversationLocal,
	} = useMultipleConversationStore();

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
		addConversationMutation.mutate(cid);
	};

	const handleSearchConversation = (query: string) => {
		searchConversationsLocal(query);
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
		setConversationsLocal(conversationsServer);
	}, [conversationsServer]);

	return (
		<aside className='fixed flex flex-col justify-center p-4 z-10 h-screen'>
			<div className='hidden lg:block overflow-y-scroll no-scrollbar backdrop-blur-2xl bg-foreground/5 rounded-3xl h-screen w-96'>
				<div className='flex flex-col flex-wrap justify-between space-between px-4 py-6 gap-4'>
					{/* Header Container */}
					<div className='flex justify-between items-center'>
						<div className=''>
							<Dropdown
								backdrop='blur'
								classNames={{
									content: 'bg-background',
								}}
							>
								<DropdownTrigger>
									<Avatar size='lg' radius='md' src={session?.user.image} />
								</DropdownTrigger>
								<DropdownMenu aria-label='Application Actions'>
									<DropdownItem
										key='Install'
										className='font-bold text-xl'
										startContent={<FaGear />}
										onPress={onOpenChangePreferences}
									>
										<span className='font-bold text-xl font-bold'>
											Preferences
										</span>
									</DropdownItem>
									<DropdownItem
										key='Install'
										className='font-bold text-xl'
										startContent={<FaShield />}
										onPress={onOpenChangePrivacy}
									>
										<span className='font-bold text-xl font-bold'>Privacy</span>
									</DropdownItem>
									<DropdownItem
										key='Install'
										className='font-bold text-xl'
										startContent={<IoIosPaper />}
										onPress={onOpenChangeTerms}
									>
										<span className='font-bold text-xl font-bold'>Terms</span>
									</DropdownItem>
									<DropdownItem
										key='Install'
										className='font-bold text-xl'
										startContent={<FiPaperclip />}
										onPress={onOpenChangeConditions}
									>
										<span className='font-bold text-xl font-bold'>
											Conditions
										</span>
									</DropdownItem>
									<DropdownItem
										key='Install'
										className='font-bold text-xl'
										startContent={<FaLifeRing />}
										onPress={onOpenChangeSafety}
									>
										<span className='font-bold text-xl font-bold'>Safety</span>
									</DropdownItem>
									<DropdownItem
										key='Install'
										className='font-bold text-xl'
										startContent={<FaQuestion />}
										onPress={onOpenChangeHelp}
									>
										<span className='font-bold text-xl font-bold'>Help</span>
									</DropdownItem>
									<DropdownItem
										key='Install'
										className='font-bold text-xl'
										startContent={<IoIosWarning />}
										onPress={onOpenChangeReport}
									>
										<span className='font-bold text-xl font-bold'>Report</span>
									</DropdownItem>
									<DropdownItem
										key='Install'
										className='font-bold text-xl'
										startContent={<IoMdDownload />}
									>
										<span className='font-bold text-xl font-bold'>Install</span>
									</DropdownItem>
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
									onClick={() => handleAddConversation()}
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
							value={conversationQuery}
							placeholder='Search conversation'
							className='p-4 w-full rounded-xl placeholder:font-bold placeholder:text-foreground font-bold text-foreground text-xl'
							onChange={(event) =>
								handleSetConversationQuery(event.target.value)
							}
							onKeyUp={(event) => {
								if (event.key === 'Enter') {
									handleSearchConversation(conversationQuery);
								}
							}}
						/>
					</div>
					{/* Messages Container */}
					<div className='overflow-y-scroll no-scrollbar h-screen'>
						<ScrollShadow className='flex flex-col space-y-3 overflow-y-scroll no-scrollbar py-4 h-screen'>
							{conversationsLocal?.map((conv) => (
								<ConversationButton key={conv.id} conv={conv} />
							))}

							{conversationsLocal?.length > 0 && (
								<div>
									<p className='text-xl font-extralight text-zinc-800 text-center'>
										{conversationsLocal.length} conversations in total
									</p>
								</div>
							)}

							{conversationsLocal?.length <= 0 && (
								<div>
									<p className='text-xl font-extralight text-zinc-800 text-center'>
										No conversations
									</p>
								</div>
							)}
						</ScrollShadow>
					</div>
					{/* Modals */}
					<div>
						<Modal
							size='lg'
							backdrop='blur'
							isOpen={isOpenPreferences}
							classNames={{
								base: 'bg-background',
								header: 'flex justify-center items-center',
								body: 'flex gap-4',
							}}
							onOpenChange={() => onOpenChangePreferences()}
						>
							<ModalContent>
								{(onClose) => (
									<>
										<ModalHeader>
											<p className='text-2xl font-bold text-center'>
												Preferences
											</p>
										</ModalHeader>
										<ModalBody>
											<div className='flex justify-center'></div>
										</ModalBody>
										<ModalFooter></ModalFooter>
									</>
								)}
							</ModalContent>
						</Modal>
						<Modal
							size='lg'
							backdrop='blur'
							isOpen={isOpenPrivacy}
							classNames={{
								base: 'bg-background',
								header: 'flex justify-center items-center',
								body: 'flex gap-4',
							}}
							onOpenChange={() => onOpenChangePrivacy()}
						>
							<ModalContent>
								{(onClose) => (
									<>
										<ModalHeader>
											<p className='text-2xl font-bold text-center'>Privacy</p>
										</ModalHeader>
										<ModalBody>
											<div className='flex justify-center'></div>
										</ModalBody>
										<ModalFooter></ModalFooter>
									</>
								)}
							</ModalContent>
						</Modal>
						<Modal
							size='lg'
							backdrop='blur'
							isOpen={isOpenTerms}
							classNames={{
								base: 'bg-background',
								header: 'flex justify-center items-center',
								body: 'flex gap-4',
							}}
							onOpenChange={() => onOpenChangeTerms()}
						>
							<ModalContent>
								{(onClose) => (
									<>
										<ModalHeader>
											<p className='text-2xl font-bold text-center'>Terms</p>
										</ModalHeader>
										<ModalBody>
											<div className='flex justify-center'></div>
										</ModalBody>
										<ModalFooter></ModalFooter>
									</>
								)}
							</ModalContent>
						</Modal>
						<Modal
							size='lg'
							backdrop='blur'
							isOpen={isOpenConditions}
							classNames={{
								base: 'bg-background',
								header: 'flex justify-center items-center',
								body: 'flex gap-4',
							}}
							onOpenChange={() => onOpenChangeConditions()}
						>
							<ModalContent>
								{(onClose) => (
									<>
										<ModalHeader>
											<p className='text-2xl font-bold text-center'>
												Conditions
											</p>
										</ModalHeader>
										<ModalBody>
											<div className='flex justify-center'></div>
										</ModalBody>
										<ModalFooter></ModalFooter>
									</>
								)}
							</ModalContent>
						</Modal>
						<Modal
							size='lg'
							backdrop='blur'
							isOpen={isOpenSafety}
							classNames={{
								base: 'bg-background',
								header: 'flex justify-center items-center',
								body: 'flex gap-4',
							}}
							onOpenChange={() => onOpenChangeSafety()}
						>
							<ModalContent>
								{(onClose) => (
									<>
										<ModalHeader>
											<p className='text-2xl font-bold text-center'>Safety</p>
										</ModalHeader>
										<ModalBody>
											<div className='flex justify-center'></div>
										</ModalBody>
										<ModalFooter></ModalFooter>
									</>
								)}
							</ModalContent>
						</Modal>
						<Modal
							size='lg'
							backdrop='blur'
							isOpen={isOpenHelp}
							classNames={{
								base: 'bg-background',
								header: 'flex justify-center items-center',
								body: 'flex gap-4',
							}}
							onOpenChange={() => onOpenChangeHelp()}
						>
							<ModalContent>
								{(onClose) => (
									<>
										<ModalHeader>
											<p className='text-2xl font-bold text-center'>Help</p>
										</ModalHeader>
										<ModalBody>
											<div className='flex justify-center'></div>
										</ModalBody>
										<ModalFooter></ModalFooter>
									</>
								)}
							</ModalContent>
						</Modal>
						<Modal
							size='lg'
							backdrop='blur'
							isOpen={isOpenReport}
							classNames={{
								base: 'bg-background',
								header: 'flex justify-center items-center',
								body: 'flex gap-4',
							}}
							onOpenChange={() => onOpenChangeReport()}
						>
							<ModalContent>
								{(onClose) => (
									<>
										<ModalHeader>
											<p className='text-2xl font-bold text-center'>Report</p>
										</ModalHeader>
										<ModalBody>
											<div className='flex justify-center'></div>
										</ModalBody>
										<ModalFooter></ModalFooter>
									</>
								)}
							</ModalContent>
						</Modal>
					</div>
				</div>
			</div>
		</aside>
	);
};

export default Sidebar;
