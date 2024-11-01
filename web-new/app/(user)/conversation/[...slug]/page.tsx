'use client';

import ModelTextMessageCard from '@/components/Blocks/Card/ModelTextMessageCard';
import UserImageMessageCard from '@/components/Blocks/Card/UserImageMessageCard';
import UserTextMessageCard from '@/components/Blocks/Card/UserTextMessageCard';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
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
import { IMAGE_INJURIES, TEXT_INJURIES } from '@/sources/injuries';
import { useMultipleMessageStore } from '@/stores/lifeline-angel/message';
import { checkTextValidURL } from '@/utilities/functions';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { BsGrid1X2Fill } from 'react-icons/bs';
import { FaCamera, FaPaperclip } from 'react-icons/fa';
import SpeechRecognition, {
	useSpeechRecognition,
} from 'react-speech-recognition';

// import ModelTextMessageCard from '@/components/blocks/Card/ModelTextMessageCard';
// import UserImageMessageCard from '@/components/blocks/Card/UserImageMessageCard';
// import UserTextMessageCard from '@/components/blocks/Card/UserTextMessageCard';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
	useMultipleConversationStore,
	useSingleConversationStore,
	useTemporaryMultipleConversationStore,
} from '@/stores/lifeline-angel/conversation';
import {
	convertImageDataUrlToFile,
	convertToDateFormat,
} from '@/utilities/functions';
import { useFormik } from 'formik';
import { Send } from 'lucide-react';
import { redirect, useParams, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FaLocationArrow, FaMicrophone } from 'react-icons/fa';
import { FaCloudArrowUp } from 'react-icons/fa6';
import { GiRaggedWound } from 'react-icons/gi';
import { MdPersonalInjury } from 'react-icons/md';
import { RiVoiceprintFill } from 'react-icons/ri';
import Webcam from 'react-webcam';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';

export default function Page() {
	const router = useRouter();
	const { data: session } = useSession();
	const fileRef = useRef<HTMLInputElement>(null);
	const [message, setMessage] = useState('');
	const [uploading, setUploading] = useState(false);
	const [microphone, setMicrophone] = useState(false);
	const cameraRef = useRef<Webcam>(null);
	const [image, setImage] = useState('');
	const { slug } = useParams() as {
		slug: string[];
	};

	const {
		transcript,
		listening,
		resetTranscript,
		browserSupportsSpeechRecognition,
	} = useSpeechRecognition();

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

	const {
		updateConversation: updateConversationTemporary,
		deleteConversation: deleteConversationTemporary,
	} = useTemporaryMultipleConversationStore();

	const updateConversationMutation = useMutation({
		mutationFn: async (message: string) =>
			await updateConversation(session?.user.email, slug[0], message),
	});

	const deleteConversationMutation = useMutation({
		mutationFn: async () =>
			await deleteConversation(session?.user.email, slug[0]),
	});

	const addMessageMutation = useMutation({
		mutationFn: async ({ mid, message }: { mid: string; message: string }) =>
			await addTextMessage(session?.user.email, slug[0], mid, message),
		onSuccess: () => refetchMessages(),
	});

	const formik = useFormik({
		initialValues: {
			file: '',
		},
		onSubmit: async () => {
			setUploading(true);

			try {
				const response = await addImageMessage(
					session?.user.email,
					slug[0],
					uuidv4(),
					formik.values.file
				);
				const message = response.prediction;

				handleUpdateConversation(message);
				// onOpenChangeFile();
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
						// @ts-ignore
						return supportedFormats.includes(value.name.split('.').pop());
					}
					return true;
				})
				.test('file-size', 'File size must not be more than 10MB', (value) => {
					if (value) {
						// @ts-ignore
						return value.size < 5145728;
					}
					return true;
				}),
		}),
	});

	const {
		data: conversationServer,
		error: conversationError,
		status: conversationStatus,
		fetchStatus: conversationFetchStatus,
		refetch: refetchConversationServer,
	} = useQuery({
		queryKey: ['getConversation'],
		queryFn: async () => await getConversation(session?.user.email, slug[0]),
	});

	const {
		data: messagesServer,
		error: messagesError,
		status: messagesStatus,
		fetchStatus: messagesFetchStatus,
		refetch: refetchMessages,
	} = useQuery({
		queryKey: ['getMessages'],
		queryFn: async () => await getMessages(session?.user.email, slug[0]),
	});

	useEffect(() => {
		setConversationLocal(conversationServer!);
	}, [setConversationLocal, conversationServer]);

	useEffect(() => {
		setMessagesLocal(messagesServer!);
	}, [setMessagesLocal, messagesServer]);

	useEffect(() => {
		if (messagesStatus === 'success' && messagesServer) {
			setMessagesLocal(messagesServer);
		}
	}, [refetchMessages, messagesStatus, messagesServer, setMessagesLocal]);

	const handleUpdateConversation = (message: string) => {
		updateConversationLocal(slug[0], message);
		updateConversationTemporary(slug[0], message);
		updateConversationMutation.mutate(message);
	};

	const handleDeleteConversation = () => {
		deleteConversationLocal(slug[0]);
		deleteConversationTemporary(slug[0]);
		deleteConversationMutation.mutate();
		router.push('/');
	};

	const handleAddMessage = (message: string) => {
		const mid = uuidv4();

		addMessageLocal(slug[0], mid, message);
		addMessageMutation.mutate({ mid, message });
		refetchMessages();
		setMessage('');
	};

	const handleChange = (event: React.ChangeEvent) => {
		const target = event.target as HTMLInputElement;
		const file = target.files![0];

		formik.setFieldValue('file', file);
	};

	const handleOpenMicrophone = () => {
		setMicrophone(true);
		SpeechRecognition.startListening();
	};

	const handleCloseMicrophone = (transcript: string) => {
		setMessage(transcript);
		resetTranscript();
		setMicrophone(false);
		SpeechRecognition.stopListening();
	};

	const handleCameraCapture = useCallback(() => {
		setImage(() => cameraRef.current?.getScreenshot()!);
		// onOpenCapturedImage();
	}, [cameraRef]);

	const handleAddImageMessage = async (image: string) => {
		const response = await addImageMessage(
			session?.user.email,
			slug[0],
			uuidv4(),
			convertImageDataUrlToFile(image, uuidv4())
		);
		const message = response.prediction;

		handleUpdateConversation(message);
		// onCloseCapturedImage();
		// onCloseCamera();
	};

	if (!session) {
		return redirect('/signin');
	}

	return (
		<main className='h-full'>
			<section className='h-full'>
				<div className='h-full outline outline-1 outline-zinc-200 dark:outline-zinc-800 rounded-3xl p-6'>
					{/* Conversation Navbar */}
					<div className='w-full flex flex-col flex-wrap justify-between space-between gap-12 pb-4'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='font-bold text-4xl text-foreground'>
									{conversationLocal?.title
										? conversationLocal.title
										: 'New conversation'}
								</p>
							</div>
							<div className='flex items-center space-x-3'>
								{messagesServer && messagesServer.length > 0 && (
									<>
										<Dialog>
											<DialogTrigger asChild>
												<button
													className='p-3 text-foreground text-2xl'
													// onClick={() => onOpenTextInjury()}
												>
													<MdPersonalInjury />
												</button>
											</DialogTrigger>
											<DialogContent className='sm:max-w-[50rem] sm:max-h-[50rem] bg-foreground border-0'>
												<DialogHeader>
													<DialogTitle className='text-2xl font-bold text-center text-background'>
														Text Injuries
													</DialogTitle>
													<DialogDescription className='py-4'>
														<div className='flex flex-wrap gap-2'>
															{TEXT_INJURIES.map((injury) => (
																<button
																	key={injury.content}
																	className='text-lg py-2 px-5 outline outline-1 outline-zinc-200 hover:outline-zinc-400 rounded-3xl font-bold tracking-tight text-background'
																	onClick={() => {
																		handleAddMessage(injury.content);
																		handleUpdateConversation(injury.content);
																	}}
																>
																	{injury.content}
																</button>
															))}
														</div>
													</DialogDescription>
												</DialogHeader>
											</DialogContent>
										</Dialog>
										<Dialog>
											<DialogTrigger asChild>
												<button
													className='p-3 text-foreground text-2xl'
													// onClick={() => onOpenImageInjury()}
												>
													<GiRaggedWound />
												</button>
											</DialogTrigger>
											<DialogContent className='sm:max-w-[50rem] sm:max-h-[50rem] bg-foreground border-0'>
												<DialogHeader>
													<DialogTitle className='text-2xl font-bold text-center text-background'>
														Image Injuries
													</DialogTitle>
													<DialogDescription className='py-4'>
														<div className='flex flex-wrap gap-2'>
															{TEXT_INJURIES.map((injury) => (
																<button
																	key={injury.content}
																	className='text-lg py-2 px-5 outline outline-1 outline-zinc-200 hover:outline-zinc-400 rounded-3xl font-bold tracking-tight text-background'
																	onClick={() => {
																		handleAddMessage(injury.content);
																		handleUpdateConversation(injury.content);
																	}}
																>
																	{injury.content}
																</button>
															))}
														</div>
													</DialogDescription>
												</DialogHeader>
											</DialogContent>
										</Dialog>
									</>
								)}
								<Dialog>
									<DialogTrigger asChild>
										<button
											className='p-3 text-foreground text-2xl'
											// onClick={() => onOpenOptions()}
										>
											<BsGrid1X2Fill />
										</button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Are you absolutely sure?</DialogTitle>
											<DialogDescription>
												This action cannot be undone. This will permanently
												delete your account and remove your data from our
												servers.
											</DialogDescription>
										</DialogHeader>
									</DialogContent>
								</Dialog>
								<SidebarTrigger className='text-foreground py-6 px-4 w-full outline outline-1 outline-zinc-200 dark:outline-zinc-800 rounded-xl' />
							</div>
						</div>
					</div>
					{/* Messages */}
					<div className='space-y-4 py-8 rounded-xl'>
						{messagesServer && messagesServer.length > 0 && (
							<div className='bg-background outline outline-1 outline-zinc-200 dark:outline-zinc-800 rounded-3xl mx-auto'>
								<div className='cursor-pointer px-6 py-4'>
									<p className='text-lg text-foreground tracking-tight leading-none text-ellipsis text-balance text-center'>
										{convertToDateFormat(
											messagesServer[0].createdAt.toString()
										)}
									</p>
								</div>
							</div>
						)}

						{messagesLocal && !messagesLocal.length && (
							<div className='space-y-10'>
								<div className='space-y-4'>
									<div>
										<p className='text-2xl font-bold text-foreground'>
											Text Injuries
										</p>
									</div>
									<div className='flex flex-wrap gap-2'>
										{TEXT_INJURIES.map((injury) => (
											<button
												key={injury.content}
												className='text-lg py-2 px-5 outline outline-1 outline-zinc-200 hover:outline-zinc-400 rounded-3xl font-bold tracking-tight text-foreground'
												onClick={() => {
													handleAddMessage(injury.content);
													handleUpdateConversation(injury.content);
												}}
											>
												{injury.content}
											</button>
										))}
									</div>
								</div>

								<div className='space-y-4'>
									<div>
										<p className='text-2xl font-bold text-foreground'>
											Image Injuries
										</p>
									</div>
									<div className='flex flex-wrap gap-3'>
										{IMAGE_INJURIES.map((injury) => (
											<Card
												key={injury.content}
												// classNames={{
												// 	base: 'bg-background border-foreground/20 border-1',
												// }}
												// onPress={() => {
												// 	handleAddMessage(injury.content);
												// 	handleUpdateConversation(injury.content);
												// }}
											>
												<CardContent className='overflow-visible p-0'>
													<Image
														width={130}
														height={130}
														alt={injury.content}
														className='w-full object-cover'
														src={`/images/${injury.source}`}
													/>
												</CardContent>
												<CardFooter>
													<p className='text-lg font-bold tracking-tight mx-auto text-center'>
														{injury.content}
													</p>
												</CardFooter>
											</Card>
										))}
									</div>
								</div>
							</div>
						)}

						{messagesLocal?.map((message) => {
							// @ts-ignore
							if (checkTextValidURL(message.content)) {
								return (
									<UserImageMessageCard key={message.id} message={message} />
								);
							} else {
								if (message.from === 'user') {
									return (
										<UserTextMessageCard key={message.id} message={message} />
									);
								}

								return (
									<>
										<ModelTextMessageCard key={message.id} message={message} />
									</>
								);
							}
						})}
					</div>
					{/* Message */}
					<div className='flex justify-between items-center space-x-6 pt-6'>
						<div className='flex items-center justify-center space-x-4'>
							<button
								className='text-foreground text-2xl'
								// onClick={onOpenFile}
							>
								<FaPaperclip />
							</button>
							<button
								className='text-foreground text-2xl'
								// onClick={onOpenMicrophone}
							>
								<FaMicrophone />
							</button>
							<button
								className='text-foreground text-2xl'
								// onClick={() => onOpenCamera()}
							>
								<FaCamera />
							</button>
						</div>
						<div className='w-full'>
							<Input
								type='text'
								value={message}
								placeholder='Aa'
								// className='py-3 px-4 w-full rounded-xl bg-background border-foreground/20 border-1 placeholder:font-bold placeholder:text-foreground font-bold text-foreground text-2xl'
								className='py-6 px-4 placeholder:font-bold placeholder:text-foreground font-bold text-foreground text-2xl'
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
						<div>
							<button
								disabled={message.length <= 0}
								className='rounded-full bg-foreground text-background text-xl p-3'
								onClick={() => {
									handleAddMessage(message);
									handleUpdateConversation(message);
								}}
							>
								<FaLocationArrow />
							</button>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
