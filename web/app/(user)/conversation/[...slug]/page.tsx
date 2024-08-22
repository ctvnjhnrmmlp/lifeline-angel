'use client';

import {
	deleteConversation,
	getConversation,
	updateConversation,
} from '@/services/lifeline-angel/conversation';
import {
	addImageMessage,
	addTextMessage,
	getMessages,
} from '@/services/lifeline-angel/message';
import { useMultipleMessageStore } from '@/stores/lifeline-angel/message';
import { checkTextValidURL } from '@/utilities/functions';
import {
	Chip,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from '@nextui-org/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { BsGrid1X2Fill } from 'react-icons/bs';
import { FaCamera, FaPaperclip } from 'react-icons/fa';

import {
	useMultipleConversationStore,
	useSingleConversationStore,
} from '@/stores/lifeline-angel/conversation';
import { ScrollShadow } from '@nextui-org/react';
import { useFormik } from 'formik';
import { redirect, useRouter } from 'next/navigation';
import React from 'react';
import { FaLocationArrow, FaMicrophone } from 'react-icons/fa';
import { FaCloudArrowUp } from 'react-icons/fa6';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';

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
	const {
		isOpen: isOpenSearch,
		onOpen: onOpenSearch,
		onOpenChange: onOpenChangeSearch,
	} = useDisclosure();
	const {
		isOpen: isOpenMedia,
		onOpen: onOpenMedia,
		onOpenChange: onOpenChangeMedia,
	} = useDisclosure();
	const {
		isOpen: isOpenPrivacy,
		onOpen: onOpenPrivacy,
		onOpenChange: onOpenChangePrivacy,
	} = useDisclosure();
	const {
		isOpen: isOpenSupport,
		onOpen: onOpenSupport,
		onOpenChange: onOpenChangeSupport,
	} = useDisclosure();
	const {
		isOpen: isOpenFile,
		onOpen: onOpenFile,
		onOpenChange: onOpenChangeFile,
	} = useDisclosure();
	const {
		isOpen: isOpenUpdate,
		onOpen: onOpenUpdate,
		onOpenChange: onOpenChangeUpdate,
	} = useDisclosure();

	const router = useRouter();
	const [message, setMessage] = React.useState('');
	const fileRef = React.useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = React.useState(false);
	const [imageData, setImageData] = React.useState('');

	const {
		conversation: conversationLocal,
		setConversation: setConversationLocal,
	} = useSingleConversationStore();

	const {
		messages: messagesLocal,
		setMessages: setMessagesLocal,
		addMessage: addMessageLocal,
	} = useMultipleMessageStore();

	const {
		updateConversation: updateConversationLocal,
		deleteConversation: deleteConversationLocal,
	} = useMultipleConversationStore();

	const updateConversationMutation = useMutation({
		mutationFn: async (message: string) =>
			await updateConversation(session.user.email, params.slug[0], message),
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

	const handleUpdateConversation = (message: string) => {
		updateConversationLocal(params.slug[0], message);
		updateConversationMutation.mutate(message);
	};

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
		refetchConversationServer();
		setMessage('');
	};

	const formik = useFormik({
		initialValues: {
			file: '',
		},
		onSubmit: async () => {
			setUploading(true);

			try {
				const response = await addImageMessage(
					session.user.email,
					params.slug[0],
					uuidv4(),
					formik.values.file
				);
				const message = response.prediction;

				handleUpdateConversation(message);
				onOpenChangeFile();
				refetchMessages();
			} catch (error) {}

			setUploading(false);
		},
		validationSchema: Yup.object().shape({
			file: Yup.mixed()
				.required('Required')
				.test('file-format', 'Only image files are allowed', (value) => {
					if (value) {
						const supportedFormats = ['png', 'jpg', 'jpeg'];
						return supportedFormats.includes(value.name.split('.').pop());
					}
					return true;
				})
				.test('file-size', 'File size must not be more than 10MB', (value) => {
					if (value) {
						return value.size < 5145728;
					}
					return true;
				}),
		}),
	});

	const handleChange = (event) => {
		formik.setFieldValue('file', event.target.files[0]);
	};

	const {
		data: conversationServer,
		error: conversationError,
		status: conversationStatus,
		fetchStatus: conversationFetchStatus,
		refetch: refetchConversationServer,
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
					{/* Conversation Navbar */}
					<div className='w-full flex flex-col flex-wrap justify-between space-between gap-12'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='font-bold text-4xl'>
									{conversationLocal?.title
										? conversationLocal.title
										: conversationLocal?.id}
								</p>
							</div>
							<div className='flex space-x-2'>
								<button
									className='block rounded-full p-3 bg-foreground text-background text-2xl'
									onClick={() => onOpenCamera()}
								>
									<FaCamera />
								</button>
								<button
									className='block rounded-full p-3 bg-foreground text-background text-2xl'
									onClick={() => onOpenOptions()}
								>
									<BsGrid1X2Fill />
								</button>
							</div>
						</div>
					</div>
					{/* Messages */}
					<div className='overflow-y-scroll no-scrollbar h-screen my-4'>
						<ScrollShadow className='flex flex-col space-y-3 overflow-y-scroll no-scrollbar py-4 h-screen'>
							{messagesLocal &&
								messagesLocal.map((message) => {
									if (checkTextValidURL(message.content)) {
										return (
											<div
												key={message.id}
												className='backdrop-blur-2xl bg-foreground/5 rounded-xl'
											>
												<div className='cursor-pointer p-6'>
													<Image
														src={`${message.content}`}
														height={300}
														width={300}
														alt='Wound image'
														className='mx-auto'
													/>
												</div>
											</div>
										);
									} else {
										return (
											<div
												key={message.id}
												className='backdrop-blur-2xl bg-foreground/5 rounded-2xl'
												style={{
													background: message.from === 'model' ? '#FFFFFF' : '',
												}}
											>
												<div className='cursor-pointer p-6'>
													<p
														className='w-full text-lg text-foreground tracking-tight leading-none text-ellipsis text-balance'
														style={{
															color: message.from === 'model' ? '#000000' : '',
														}}
													>
														{message.content}
													</p>
												</div>
											</div>
										);
									}
								})}
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
								onKeyPress={(event) => {
									if (event.key === 'Enter') {
										handleAddMessage(message);
										handleUpdateConversation(message);
									}
								}}
							/>
						</div>
						<div className='flex items-center justify-center space-x-2'>
							<button
								className='block rounded-full bg-foreground text-background text-2xl p-4'
								onClick={() => onOpenFile()}
							>
								<FaPaperclip />
							</button>
							<button className='block rounded-full bg-foreground text-background text-2xl p-4'>
								<FaMicrophone />
							</button>
							<button
								className='block rounded-full bg-foreground text-background text-2xl p-4'
								onClick={() => {
									handleAddMessage(message);
									handleUpdateConversation(message);
								}}
							>
								<FaLocationArrow />
							</button>
						</div>
					</div>
					{/* Conversation Modals */}
					<div>
						<Modal
							size='lg'
							backdrop='blur'
							closeButton={<></>}
							isOpen={isOpenFile}
							classNames={{
								base: 'bg-background',
								header: 'flex justify-center items-center',
								body: 'flex gap-4',
							}}
							onOpenChange={() => onOpenChangeFile()}
						>
							<ModalContent>
								{(onClose) => (
									<>
										<ModalHeader>
											<p className='text-3xl font-bold text-center'>File</p>
										</ModalHeader>
										<ModalBody>
											<div className='flex justify-center'>
												<form
													encType='multipart/form-data'
													className='space-y-4'
													onSubmit={formik.handleSubmit}
												>
													<Input
														required
														ref={fileRef}
														id='image-input'
														name='file'
														type='file'
														accept='image/*'
														onChange={handleChange}
													/>
													<label
														htmlFor='image-input'
														className='flex flex-col items-center justify-center w-full h-72 rounded-2xl cursor-pointer bg-background outline outline-[#3F3F46] outline-[0.1px]'
													>
														<div className='flex flex-col items-center justify-center pt-5 pb-6'>
															<FaCloudArrowUp className='text-9xl text-foreground' />
															<p className='text-xl font-bold text-foreground'>
																Click above to upload
															</p>
															<p className='text-sm text-foreground'>
																PNG, JPG, JPEG
															</p>
														</div>
													</label>
													<div>
														{formik.touched.file && formik.errors.file && (
															<Chip color='danger' radius='sm'>
																{formik.errors.file}
															</Chip>
														)}
													</div>
													<button
														type='submit'
														disabled={uploading}
														className='block bg-foreground text-background text-3xl px-3 py-3 w-full rounded-xl font-extrabold leading-none tracking-tight uppercase'
													>
														{uploading && <span>Posting...</span>}
														{!uploading && <span>Post</span>}
													</button>
												</form>
											</div>
										</ModalBody>
										<ModalFooter></ModalFooter>
									</>
								)}
							</ModalContent>
						</Modal>
						<Modal
							size='lg'
							backdrop='blur'
							isOpen={isOpenCamera}
							classNames={{
								base: 'bg-background',
								header: 'flex justify-center items-center',
								body: 'flex gap-4',
							}}
							onOpenChange={() => onOpenChangeCamera()}
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
							classNames={{
								base: 'bg-background',
								header: 'flex justify-center items-center',
								body: 'space-y-0.5',
							}}
							onOpenChange={() => onOpenChangeOptions()}
						>
							<ModalContent>
								{(onClose) => (
									<>
										<ModalHeader>
											<p className='text-3xl font-bold text-center'>
												{conversationLocal?.title
													? conversationLocal.title
													: params.slug[0]}
											</p>
										</ModalHeader>
										<ModalBody>
											<button
												className='backdrop-blur-2xl bg-foreground/10 rounded-xl cursor-pointer p-4'
												onClick={() => onOpenChangeSearch()}
											>
												<p className='font-bold w-full text-2xl text-foreground tracking-tight leading-none text-ellipsis text-balance'>
													Search
												</p>
											</button>
											<button
												className='backdrop-blur-2xl bg-foreground/10 rounded-xl cursor-pointer p-4'
												onClick={() => onOpenChangeMedia()}
											>
												<p className='font-bold w-full text-2xl text-foreground tracking-tight leading-none text-ellipsis text-balance'>
													Media
												</p>
											</button>
											<button
												className='backdrop-blur-2xl bg-foreground/10 rounded-xl cursor-pointer p-4'
												onClick={() => onOpenChangePrivacy()}
											>
												<p className='font-bold w-full text-2xl text-foreground tracking-tight leading-none text-ellipsis text-balance'>
													Privacy
												</p>
											</button>
											<button
												className='backdrop-blur-2xl bg-foreground/10 rounded-xl cursor-pointer p-4'
												onClick={() => onOpenChangeSupport()}
											>
												<p className='font-bold w-full text-2xl text-foreground tracking-tight leading-none text-ellipsis text-balance'>
													Support
												</p>
											</button>
											<button
												className='bg-foreground rounded-xl cursor-pointer p-4'
												onClick={() => onOpenChangeUpdate()}
											>
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
					{/* Message Modals */}
					<div>
						<Modal
							size='lg'
							backdrop='blur'
							isOpen={isOpenSearch}
							classNames={{
								base: 'bg-background',
								header: 'flex justify-center items-center',
								body: 'flex gap-4',
							}}
							onOpenChange={() => onOpenChangeSearch()}
						>
							<ModalContent>
								{(onClose) => (
									<>
										<ModalHeader>
											<p className='text-2xl font-bold text-center'>Search</p>
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
							isOpen={isOpenUpdate}
							classNames={{
								base: 'bg-background',
								header: 'flex justify-center items-center',
								body: 'flex gap-4',
							}}
							onOpenChange={() => onOpenChangeUpdate()}
						>
							<ModalContent>
								{(onClose) => (
									<>
										<ModalHeader>
											<p className='text-2xl font-bold text-center'>Update</p>
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
							isOpen={isOpenMedia}
							classNames={{
								base: 'bg-background',
								header: 'flex justify-center items-center',
								body: 'flex gap-4',
							}}
							onOpenChange={() => onOpenChangeMedia()}
						>
							<ModalContent>
								{(onClose) => (
									<>
										<ModalHeader>
											<p className='text-2xl font-bold text-center'>Media</p>
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
							isOpen={isOpenSupport}
							classNames={{
								base: 'bg-background',
								header: 'flex justify-center items-center',
								body: 'flex gap-4',
							}}
							onOpenChange={() => onOpenChangeSupport()}
						>
							<ModalContent>
								{(onClose) => (
									<>
										<ModalHeader>
											<p className='text-2xl font-bold text-center'>Support</p>
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
			</section>
		</main>
	);
}
