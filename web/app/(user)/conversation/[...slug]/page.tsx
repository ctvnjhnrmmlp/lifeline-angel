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
import { BsGrid1X2Fill } from 'react-icons/bs';
import { FaCamera, FaPaperclip } from 'react-icons/fa';

import {
	useMultipleConversationStore,
	useSingleConversationStore,
} from '@/stores/lifeline-angel/conversation';
import { ScrollShadow } from '@nextui-org/react';
import { Form, Formik } from 'formik';
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
		isOpen: isOpenFile,
		onOpen: onOpenFile,
		onOpenChange: onOpenChangeFile,
	} = useDisclosure();
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
	const fileRef = React.useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = React.useState(false);

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
						<ScrollShadow className='flex flex-col gap-2 overflow-y-scroll no-scrollbar py-4 h-screen'>
							{messagesLocal &&
								messagesLocal.map((message) => (
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
							isOpen={isOpenFile}
							onOpenChange={onOpenChangeFile}
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
											<p className='text-3xl font-bold text-center'>File</p>
										</ModalHeader>
										<ModalBody>
											<div className='flex justify-center'>
												<Formik
													initialValues={{
														file: '',
													}}
													validationSchema={Yup.object({
														file: Yup.mixed()
															.test(
																'is-file-too-big',
																'File exceeds 50MB',
																() => {
																	let valid = true;
																	const files = fileRef?.current?.files;
																	if (files) {
																		const fileArr = Array.from(files);
																		fileArr.forEach((file) => {
																			const size = file.size / 1024 / 1024;
																			if (size > 50) {
																				valid = false;
																			}
																		});
																	}
																	return valid;
																}
															)
															.test(
																'is-file-of-correct-type',
																'File is not of supported type',
																() => {
																	let valid = true;
																	const files = fileRef?.current?.files;
																	if (files) {
																		const fileArr = Array.from(files);
																		fileArr.forEach((file) => {
																			const type = file.type.split('/')[1];
																			const validTypes = ['png', 'jpg', 'jpeg'];
																			if (!validTypes.includes(type)) {
																				valid = false;
																			}
																		});
																	}
																	return valid;
																}
															)
															.required('Required'),
													})}
													onSubmit={async (values, { setSubmitting }) => {
														setUploading(true);

														try {
														} catch (error) {}

														setUploading(false);
													}}
												>
													{({ values, errors, touched, getFieldProps }) => (
														<Form className='space-y-4'>
															<div className='space-y-2'>
																<Input
																	required
																	ref={fileRef}
																	id='image-input'
																	type='file'
																	accept='image/*'
																	{...getFieldProps('file')}
																/>
																<label
																	htmlFor='video-input'
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
																{touched.file && errors.file && (
																	<Chip color='danger' radius='sm'>
																		{errors.file}
																	</Chip>
																)}
															</div>
															<button
																type='submit'
																disabled={uploading}
																className='block bg-foreground text-background text-3xl px-3 py-3 w-full rounded-xl font-bold leading-none tracking-tight'
															>
																<div>
																	<FaLocationArrow className='absolute left-26' />
																	<span className='font-extrabold leading-none tracking-tight uppercase mx-auto pl-1'>
																		{uploading && <span>Posting...</span>}
																		{!uploading && <span>Post</span>}
																	</span>
																</div>
															</button>
														</Form>
													)}
												</Formik>
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
