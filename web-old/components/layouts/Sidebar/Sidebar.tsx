'use client';

import {
	useMutation,
	useQuery,
} from '.pnpm/@tanstack+react-query@5.59.16_react@19.0.0-rc-02c0e824-20241028/node_modules/@tanstack/react-query/build/modern';
import {
	useEffect,
	useState,
} from '.pnpm/@types+react@18.3.12/node_modules/@types/react';
import {
	signOut,
	useSession,
} from '.pnpm/next-auth@4.24.10_next@15.0.2_react-dom@19.0.0-rc-02c0e824-20241028_react@19.0.0-rc-02c0e824-_6v3ny5a5udmzoog3xss5rkgreu/node_modules/next-auth/react';
import Link from '.pnpm/next@15.0.2_react-dom@19.0.0-rc-02c0e824-20241028_react@19.0.0-rc-02c0e824-20241028__react@19.0.0-rc-02c0e824-20241028/node_modules/next/link';
import {
	BiSolidLeftArrow,
	BiSolidRightArrow,
} from '.pnpm/react-icons@5.3.0_react@19.0.0-rc-02c0e824-20241028/node_modules/react-icons/bi';
import {
	FaLifeRing,
	FaQuestion,
} from '.pnpm/react-icons@5.3.0_react@19.0.0-rc-02c0e824-20241028/node_modules/react-icons/fa';
import {
	FaGear,
	FaShield,
} from '.pnpm/react-icons@5.3.0_react@19.0.0-rc-02c0e824-20241028/node_modules/react-icons/fa6';
import { FiPaperclip } from '.pnpm/react-icons@5.3.0_react@19.0.0-rc-02c0e824-20241028/node_modules/react-icons/fi';
import { ImPlus } from '.pnpm/react-icons@5.3.0_react@19.0.0-rc-02c0e824-20241028/node_modules/react-icons/im';
import {
	IoIosPaper,
	IoIosWarning,
	IoMdDownload,
} from '.pnpm/react-icons@5.3.0_react@19.0.0-rc-02c0e824-20241028/node_modules/react-icons/io';
import { v4 as uuidv4 } from '.pnpm/uuid@11.0.2/node_modules/uuid/dist/esm-browser';
import ConversationButton from '@/components/blocks/Button/ConversationButton';
import {
	addConversation,
	getConversations,
} from '@/services/lifeline-angel/conversation';
import {
	useMultipleConversationStore,
	useTemporaryMultipleConversationStore,
} from '@/stores/lifeline-angel/conversation';
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

const Sidebar = () => {
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
		<aside className='fixed flex flex-col justify-center p-4 z-10 h-screen'>
			<div className='hidden lg:block overflow-y-scroll no-scrollbar bg-background border-white/20 border-1 rounded-3xl h-screen w-96'>
				<div className='flex flex-col flex-wrap justify-between space-between px-4 py-6 gap-4'>
					{/* Header Container */}
					<div className='flex justify-between items-center'>
						<div>
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
									className='rounded-full p-3 bg-foreground text-background text-2xl'
									onClick={() => handleAddConversation()}
								>
									<ImPlus />
								</button>
							</Link>
						</div>
					</div>
					{/* Search Container */}
					<div className='flex space-x-3'>
						{openSearch && (
							<button
								className='bg-background text-foreground text-2xl text-center leading-none'
								onClick={() => handleOpenSearch(false)}
							>
								<BiSolidLeftArrow />
							</button>
						)}
						<input
							type='text'
							value={conversationQuery}
							placeholder='Search conversation'
							className='px-3 py-3 w-full rounded-xl placeholder:font-bold placeholder:text-foreground font-bold text-foreground text-xl backdrop-blur-sm bg-background/5 border-white/20 border-1 rounded-xl'
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
					{/* Messages Container */}
					<div className='overflow-y-scroll no-scrollbar h-screen'>
						{openSearch && (
							<ScrollShadow className='flex flex-col space-y-3 overflow-y-scroll no-scrollbar py-4 h-screen'>
								{conversationsTemporary?.map((conv) => (
									<ConversationButton key={conv.id} conv={conv} />
								))}
							</ScrollShadow>
						)}

						{!openSearch && (
							<ScrollShadow className='flex flex-col space-y-3 overflow-y-scroll no-scrollbar py-4 h-screen'>
								{conversationsLocal?.map((conv) => (
									<ConversationButton key={conv.id} conv={conv} />
								))}
							</ScrollShadow>
						)}
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