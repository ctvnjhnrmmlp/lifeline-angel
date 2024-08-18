'use client';

import {
	deleteConversation,
	getConversation,
	updateConversation,
} from '@/services/lifeline-angel/conversation';
import {
	addTextMessage,
	deleteTextMessage,
	getMessages,
} from '@/services/lifeline-angel/message';
import { useMultipleMessageStore } from '@/stores/lifeline-angel/message';
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from '@nextui-org/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { BsGrid1X2Fill } from 'react-icons/bs';
import { FaCamera } from 'react-icons/fa';

import {
	useMultipleConversationStore,
	useSingleConversationStore,
} from '@/stores/lifeline-angel/conversation';
import { ScrollShadow } from '@nextui-org/react';
import { redirect, useRouter } from 'next/navigation';
import React from 'react';
import { FaLocationArrow, FaMicrophone } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

export default function Page({ params }: { params: { slug: string[] } }) {
	const { data: session } = useSession();

	if (!session) {
		return redirect('/signin');
	}

	const {
		isOpen: isOpenCamera,
		onOpen: onOpenCamera,
		onOpenChange: onOpenChangeCamera,
	} = useDisclosure();
	const {
		isOpen: isOpenOptions,
		onOpen: onOpenOptions,
		onOpenChange: onOpenChangeOptions,
	} = useDisclosure();
	const router = useRouter();
	const [message, setMessage] = React.useState('');

	const {
		conversation: conversationLocal,
		setConversation: setConversationLocal,
	} = useSingleConversationStore();

	const {
		messages: messagesLocal,
		setMessages: setMessagesLocal,
		addMessage: addMessageLocal,
	} = useMultipleMessageStore();

	const { deleteConversation: deleteConversationLocal } =
		useMultipleConversationStore();

	const updateConversationMutation = useMutation({
		mutationFn: async () =>
			await updateConversation(session.user.email, params.slug[0], ''),
	});

	const deleteConversationMutation = useMutation({
		mutationFn: async () =>
			await deleteConversation(session.user.email, params.slug[0]),
	});

	const addMessageMutation = useMutation({
		mutationFn: async ({ mid, message }: { mid: string; message: string }) =>
			await addTextMessage(session.user.email, params.slug[0], mid, message),
		onSuccess: () => refetchMessages(),
	});

	const deleteMessageMutation = useMutation({
		mutationFn: async () => await deleteTextMessage(session.user.email, ''),
	});

	const handleDeleteConversation = () => {
		deleteConversationLocal(params.slug[0]);
		deleteConversationMutation.mutate();
		router.push('/');
	};

	const handleAddMessage = (message: string) => {
		const mid = uuidv4();

		addMessageLocal(params.slug[0], mid, message);
		addMessageMutation.mutate({ mid, message });
		refetchMessages();
		setMessage('');
	};

	const {
		data: conversationServer,
		error: conversationError,
		status: conversationStatus,
		fetchStatus: conversationFetchStatus,
		refetch: refetchConversation,
	} = useQuery({
		queryKey: ['getConversation'],
		queryFn: async () =>
			await getConversation(session?.user.email, params.slug[0]),
	});

	const {
		data: messagesServer,
		error: messagesError,
		status: messagesStatus,
		fetchStatus: messagesFetchStatus,
		refetch: refetchMessages,
	} = useQuery({
		queryKey: ['getMessages'],
		queryFn: async () => await getMessages(session?.user.email, params.slug[0]),
	});

	React.useEffect(() => {
		setConversationLocal(conversationServer);
	}, [conversationServer]);

	React.useEffect(() => {
		setMessagesLocal(messagesServer);
	}, [messagesServer]);

	React.useEffect(() => {
		if (messagesStatus === 'success' && messagesServer) {
			setMessagesLocal(messagesServer);
		}
	}, [refetchMessages]);

	return (
		<main className='flex flex-col justify-center pl-[26rem] py-4 pr-4 h-screen w-screen'>
			<section className='overflow-y-scroll no-scrollbar backdrop-blur-2xl bg-foreground/5 rounded-2xl h-screen'>
				<div className='flex flex-col p-6 outline h-full'>
					{/* Mini Navbar */}
					<div className='w-full flex flex-col flex-wrap justify-between space-between gap-12'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='font-bold text-4xl'>{params.slug[0]}</p>
							</div>
							<div className='flex space-x-2'>
								<button
									className='block rounded-full p-3 bg-foreground text-background text-2xl'
									onClick={onOpenCamera}
								>
									<FaCamera />
								</button>
								<button
									className='block rounded-full p-3 bg-foreground text-background text-2xl'
									onClick={onOpenOptions}
								>
									<BsGrid1X2Fill />
								</button>
							</div>
						</div>
					</div>
					{/* Messages */}
					<div className='overflow-y-scroll no-scrollbar h-screen my-4'>
						<ScrollShadow className='flex flex-col gap-2 overflow-y-scroll no-scrollbar py-4 h-screen'>
							{messagesLocal.map((message) => (
								<div
									key={message.id}
									className='backdrop-blur-2xl bg-foreground/5 rounded-xl'
								>
									<div className='cursor-pointer p-6'>
										<p className='w-full text-lg text-foreground tracking-tight leading-none text-ellipsis text-balance'>
											{message.content}
										</p>
									</div>
								</div>
							))}
						</ScrollShadow>
					</div>
					{/* Message */}
					<div className='w-full flex justify-between space-x-3'>
						<div className='w-full'>
							<input
								type='text'
								value={message}
								placeholder='Aa'
								className='p-3 w-full rounded-xl placeholder:font-bold placeholder:text-foreground font-bold text-foreground text-2xl'
								onChange={(event) => {
									setMessage(event.target.value);
								}}
							/>
						</div>
						<div className='flex items-center justify-center space-x-2'>
							<button className='block rounded-full bg-foreground text-background text-2xl p-4'>
								<FaMicrophone />
							</button>
							<button
								className='block rounded-full bg-foreground text-background text-2xl p-4'
								onClick={() => handleAddMessage(message)}
							>
								<FaLocationArrow />
							</button>
						</div>
					</div>
					<div>
						<Modal
							size='lg'
							backdrop='blur'
							isOpen={isOpenCamera}
							onOpenChange={onOpenChangeCamera}
							classNames={{
								base: 'bg-background',
								header: 'flex justify-center items-center',
								body: 'flex gap-4',
							}}
						>
							<ModalContent>
								{(onClose) => (
									<>
										<ModalHeader>
											<p className='text-2xl font-bold text-center'>Camera</p>
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
							hideCloseButton
							size='lg'
							backdrop='blur'
							isOpen={isOpenOptions}
							onOpenChange={onOpenChangeOptions}
							classNames={{
								base: 'bg-background',
								header: 'flex justify-center items-center',
								body: 'space-y-0.5',
							}}
						>
							<ModalContent>
								{(onClose) => (
									<>
										<ModalHeader>
											<p className='text-3xl font-bold text-center'>
												{params.slug[0]}
											</p>
										</ModalHeader>
										<ModalBody>
											<button className='backdrop-blur-2xl bg-foreground/10 rounded-xl cursor-pointer p-4'>
												<p className='font-bold w-full text-2xl text-foreground tracking-tight leading-none text-ellipsis text-balance'>
													Search
												</p>
											</button>
											<button className='backdrop-blur-2xl bg-foreground/10 rounded-xl cursor-pointer p-4'>
												<p className='font-bold w-full text-2xl text-foreground tracking-tight leading-none text-ellipsis text-balance'>
													Media
												</p>
											</button>
											<button className='backdrop-blur-2xl bg-foreground/10 rounded-xl cursor-pointer p-4'>
												<p className='font-bold w-full text-2xl text-foreground tracking-tight leading-none text-ellipsis text-balance'>
													Privacy
												</p>
											</button>
											<button className='backdrop-blur-2xl bg-foreground/10 rounded-xl cursor-pointer p-4'>
												<p className='font-bold w-full text-2xl text-foreground tracking-tight leading-none text-ellipsis text-balance'>
													Support
												</p>
											</button>
											<button className='bg-foreground rounded-xl cursor-pointer p-4'>
												<p className='font-bold w-full text-2xl text-background tracking-tight leading-none text-ellipsis text-balance'>
													Update
												</p>
											</button>
											<button
												className='bg-red-700 rounded-xl cursor-pointer p-4'
												onClick={() => handleDeleteConversation()}
											>
												<p className='font-bold w-full text-2xl text-foreground tracking-tight leading-none text-ellipsis text-balance'>
													Delete
												</p>
											</button>
										</ModalBody>
										<ModalFooter></ModalFooter>
									</>
								)}
							</ModalContent>
						</Modal>
					</div>
				</div>
			</section>
		</main>
	);
}
