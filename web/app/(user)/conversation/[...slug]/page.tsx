'use client';

import ModelTextMessageCard from '@/components/blocks/Card/ModelTextMessageCard';
import UserImageMessageCard from '@/components/blocks/Card/UserImageMessageCard';
import UserTextMessageCard from '@/components/blocks/Card/UserTextMessageCard';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
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
import { FaPaperclip } from 'react-icons/fa';
import SpeechRecognition, {
	useSpeechRecognition,
} from 'react-speech-recognition';

import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
	useMultipleConversationStore,
	useSingleConversationStore,
	useTemporaryMultipleConversationStore,
} from '@/stores/lifeline-angel/conversation';
import { useFormik } from 'formik';
import { redirect, useParams, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { FaLocationArrow, FaMicrophone } from 'react-icons/fa';
import { FaCloudArrowUp } from 'react-icons/fa6';
import { GiRaggedWound } from 'react-icons/gi';
import { MdPersonalInjury } from 'react-icons/md';
import { RiVoiceprintFill } from 'react-icons/ri';
// import Webcam from 'react-webcam';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';

export default function Page() {
	const router = useRouter();
	const { data: session } = useSession();
	const fileRef = useRef<HTMLInputElement>(null);
	const [message, setMessage] = useState('');
	const [uploading, setUploading] = useState(false);
	const [microphone, setMicrophone] = useState(false);
	const [typing, setTyping] = useState(false);
	// const cameraRef = useRef<Webcam>(null);
	// const [image, setImage] = useState('');
	const { slug } = useParams() as {
		slug: string[];
	};

	const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
		useSpeechRecognition();

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
				refetchMessages();
			} catch (error) {
				console.log(error);
			}

			setUploading(false);
		},
		validationSchema: Yup.object().shape({
			file: Yup.mixed()
				.required('Required')
				.test('file-format', 'Only image files are allowed', (value) => {
					if (value) {
						const supportedFormats = ['png', 'jpg', 'jpeg'];
						// @ts-expect-error: must be corrected properly
						return supportedFormats.includes(value.name.split('.').pop());
					}
					return true;
				})
				.test('file-size', 'File size must not be more than 10MB', (value) => {
					if (value) {
						// @ts-expect-error: must be corrected properly
						return value.size < 5145728;
					}
					return true;
				}),
		}),
	});

	const { data: conversationServer } = useQuery({
		queryKey: ['getConversation'],
		queryFn: async () => await getConversation(session?.user.email, slug[0]),
	});

	const {
		data: messagesServer,
		status: messagesStatus,
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

	const handleTyping = (typing: boolean) => {
		setTyping(typing);
	};

	// const handleCameraCapture = useCallback(() => {
	// 	// setImage(() => cameraRef.current?.getScreenshot()!);
	// }, [cameraRef]);

	// const handleAddImageMessage = async (image: string) => {
	// 	const response = await addImageMessage(
	// 		session?.user.email,
	// 		slug[0],
	// 		uuidv4(),
	// 		convertImageDataUrlToFile(image, uuidv4())
	// 	);
	// 	const message = response.prediction;

	// 	handleUpdateConversation(message);
	// 	// onCloseCapturedImage();
	// 	// onCloseCamera();
	// };

	if (!session) {
		return redirect('/signin');
	}

	return (
		<main className='h-full no-scrollbar'>
			<section className='h-full no-scrollbar'>
				<div className='h-full outline outline-1 outline-zinc-200 dark:outline-zinc-800 rounded-3xl p-4 md:p-6 no-scrollbar'>
					{/* Conversation Navbar */}
					<div
						key='conversation-navbar'
						className='w-full flex flex-col flex-wrap justify-between space-between gap-12 pb-4'
					>
						<div className='flex flex-col lg:flex-row items-center justify-between space-y-2 lg:space-y-0'>
							<div>
								<p className='font-bold text-xl md:text-2xl text-foreground'>
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
												<button className='text-foreground p-4 w-full outline outline-1 outline-zinc-200 dark:outline-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl'>
													<MdPersonalInjury />
												</button>
											</DialogTrigger>
											<DialogContent className='sm:max-w-[50rem] sm:max-h-[50rem] bg-foreground border-0'>
												<DialogHeader>
													<DialogTitle className='text-2xl font-bold text-center text-background'>
														Text Injuries
													</DialogTitle>
													<DialogDescription className='py-4'>
														<DialogClose asChild>
															<ScrollArea className='h-[35rem] sm:h-full no-scrollbar'>
																<div className='flex flex-wrap gap-2 p-0.5'>
																	{TEXT_INJURIES.map((injury) => (
																		<button
																			key={injury.content}
																			className='text-lg py-2 px-5 outline outline-1 outline-zinc-800 dark:outline-zinc-200 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-3xl font-bold tracking-tight text-background'
																			onClick={() => {
																				handleAddMessage(injury.content);
																				handleUpdateConversation(
																					injury.content
																				);
																			}}
																		>
																			{injury.content}
																		</button>
																	))}
																</div>
															</ScrollArea>
														</DialogClose>
													</DialogDescription>
												</DialogHeader>
											</DialogContent>
										</Dialog>
										<Dialog>
											<DialogTrigger asChild>
												<button className='text-foreground p-4 w-full outline outline-1 outline-zinc-200 dark:outline-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl'>
													<GiRaggedWound />
												</button>
											</DialogTrigger>
											<DialogContent className='sm:max-w-[50rem] sm:max-h-[50rem] bg-foreground border-0'>
												<DialogHeader>
													<DialogTitle className='text-2xl font-bold text-center text-background'>
														Image Injuries
													</DialogTitle>
													<DialogDescription className='py-4'>
														<DialogClose asChild>
															<ScrollArea className='h-[35rem] sm:h-full no-scrollbar'>
																<div className='flex flex-wrap justify-center gap-2 p-0.5'>
																	{IMAGE_INJURIES.map((injury) => (
																		<Tooltip key={injury.content}>
																			<TooltipTrigger asChild>
																				<Image
																					width={130}
																					height={130}
																					src={`/images/${injury.source}`}
																					className='w-32 md:w-40 lg:w-56 object-cover rounded-3xl'
																					alt={injury.content}
																					onClick={() => {
																						handleAddMessage(injury.content);
																						handleUpdateConversation(
																							injury.content
																						);
																					}}
																				/>
																			</TooltipTrigger>
																			<TooltipContent className='border-1 border-zinc-200 dark:border-zinc-800'>
																				<p>{injury.content}</p>
																			</TooltipContent>
																		</Tooltip>
																	))}
																</div>
															</ScrollArea>
														</DialogClose>
													</DialogDescription>
												</DialogHeader>
											</DialogContent>
										</Dialog>
									</>
								)}
								<Dialog>
									<DialogTrigger asChild>
										<button className='text-foreground p-4 w-full outline outline-1 outline-zinc-200 dark:outline-zinc-800 rounded-xl'>
											<BsGrid1X2Fill />
										</button>
									</DialogTrigger>
									<DialogContent className='sm:max-w-[30rem] sm:max-h-[30rem] bg-foreground border-0'>
										<DialogHeader>
											<DialogTitle className='text-2xl font-bold text-center text-background'>
												Settings
											</DialogTitle>
											<DialogDescription className='py-4 space-y-2'>
												<Button
													variant='destructive'
													className='w-full text-xl py-6'
													onClick={() => handleDeleteConversation()}
												>
													Delete
												</Button>
											</DialogDescription>
										</DialogHeader>
									</DialogContent>
								</Dialog>
								<SidebarTrigger className='text-foreground py-6 px-4 w-full outline outline-1 outline-zinc-200 dark:outline-zinc-800 rounded-xl' />
							</div>
						</div>
					</div>
					{/* Messages */}
					<div
						key='messages-block'
						className='space-y-4 py-8 rounded-xl no-scrollbar'
					>
						{/* {messagesServer && messagesServer.length > 0 && (
							<div className='bg-background outline outline-1 outline-zinc-200 dark:outline-zinc-800 rounded-3xl mx-auto'>
								<div className='cursor-pointer px-6 py-4'>
									<p className='text-lg text-foreground tracking-tight leading-none text-ellipsis text-balance text-center'>
										{convertToDateFormat(
											messagesServer[0].createdAt.toString()
										)}
									</p>
								</div>
							</div>
						)} */}
						{messagesLocal && !messagesLocal.length && (
							<div
								key='starter-messages-block'
								className='space-y-10 no-scrollbar'
							>
								<div className='space-y-4'>
									<div>
										<p className='text-lg sm:text-xl md:text-2xl font-bold text-foreground'>
											Text Injuries
										</p>
									</div>
									<div className='flex flex-wrap gap-2'>
										{TEXT_INJURIES.map((injury) => (
											<button
												key={injury.content}
												className='text-sm md:text-md lg:text-lg py-2 px-5 outline outline-1 outline-zinc-200 dark:outline-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-3xl font-bold tracking-tight text-foreground'
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
										<p className='text-lg sm:text-xl md:text-2xl font-bold text-foreground'>
											Image Injuries
										</p>
									</div>
									<div className='flex flex-wrap gap-2'>
										{IMAGE_INJURIES.map((injury) => (
											<Image
												key={injury.content}
												width={130}
												height={130}
												src={`/images/${injury.source}`}
												className='w-40 md:w-56 object-cover rounded-3xl'
												alt={injury.content}
												onClick={() => {
													handleAddMessage(injury.content);
													handleUpdateConversation(injury.content);
												}}
											/>
										))}
									</div>
								</div>
							</div>
						)}
						<ScrollArea className='h-[35rem] sm:h-full no-scrollbar'>
							<div
								key='user-and-model-messages-block'
								className='space-y-6 p-0.5'
							>
								{messagesLocal?.map((message) => {
									// @ts-expect-error: must be corrected properly
									if (checkTextValidURL(message.content)) {
										return (
											<UserImageMessageCard
												key={message.id}
												message={message}
											/>
										);
									} else {
										if (message.from === 'user') {
											return (
												<UserTextMessageCard
													key={message.id}
													message={message}
												/>
											);
										}
										return (
											<>
												<ModelTextMessageCard
													key={message.id}
													message={message}
												/>
											</>
										);
									}
								})}
							</div>
						</ScrollArea>
					</div>
					{/* Message */}
					<div
						key='messaging-block'
						className='flex justify-between items-center space-x-2 pt-6'
					>
						{!typing && (
							<div className='flex items-center justify-center space-x-2'>
								<Dialog>
									<DialogTrigger asChild>
										<button className='text-foreground p-4 w-full outline outline-1 outline-zinc-200 dark:outline-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl'>
											<FaPaperclip />
										</button>
									</DialogTrigger>
									<DialogContent className='sm:max-w-[30rem] sm:max-h-[50rem] bg-foreground border-0'>
										<DialogHeader>
											<DialogTitle className='text-2xl font-bold text-center text-background'>
												File
											</DialogTitle>
											<DialogDescription className='py-4' asChild>
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
															className='flex flex-col items-center justify-center w-full h-72 rounded-2xl cursor-pointer bg-background border-foreground/20 border-1'
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
																<p className='text-foreground'>
																	{formik.errors.file}
																</p>
															)}
														</div>
														<Button
															type='submit'
															disabled={uploading}
															className='w-full text-xl py-6 bg-background text-foreground font-bold text-2xl'
														>
															{uploading && <span>Posting...</span>}
															{!uploading && <span>Post</span>}
														</Button>
													</form>
												</div>
											</DialogDescription>
										</DialogHeader>
									</DialogContent>
								</Dialog>
								<Dialog>
									<DialogTrigger asChild>
										<button className='text-foreground p-4 w-full outline outline-1 outline-zinc-200 dark:outline-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl'>
											<FaMicrophone />
										</button>
									</DialogTrigger>
									<DialogContent className='sm:max-w-[30rem] sm:max-h-[50rem] bg-foreground border-0'>
										<DialogHeader>
											<DialogTitle className='text-2xl font-bold text-center text-background'>
												Microphone
											</DialogTitle>
											<DialogDescription className='py-4'>
												<div className='flex flex-col space-y-8 items-center justify-center'>
													{browserSupportsSpeechRecognition && (
														<>
															<div>
																<p className='text-[11rem] text-background'>
																	<RiVoiceprintFill />
																</p>
															</div>
															{!microphone && (
																<div>
																	<button
																		className='rounded-full bg-background text-2xl p-6 outline'
																		onClick={() => handleOpenMicrophone()}
																	></button>
																</div>
															)}
															{microphone && (
																<div>
																	<button
																		className='rounded-full bg-red-600 text-2xl p-6 outline'
																		onClick={() =>
																			handleCloseMicrophone(transcript)
																		}
																	></button>
																</div>
															)}
															<div className='flex flex-wrap w-96'>
																<p className='text-lg text-white'>
																	{transcript}
																</p>
															</div>
														</>
													)}
													{!browserSupportsSpeechRecognition && (
														<span>
															Browser does not support speech recognition.
														</span>
													)}
												</div>
											</DialogDescription>
										</DialogHeader>
									</DialogContent>
								</Dialog>
								{/* <Dialog>
								<DialogTrigger asChild>
									<button className='text-foreground text-2xl'>
										<FaCamera />
									</button>
								</DialogTrigger>
								<DialogContent className='sm:max-w-[30rem] sm:max-h-[50rem] bg-foreground border-0'>
									<DialogHeader>
										<DialogTitle className='text-2xl font-bold text-center text-background'>
											Camera
										</DialogTitle>
										<DialogDescription className='py-4' asChild>
											<div className='flex flex-col space-y-8 items-center justify-center'>
												<div>
													<Webcam
														mirrored
														ref={cameraRef}
														height={1000}
														width={1000}
														screenshotFormat='image/jpeg'
														screenshotQuality={1}
														className='rounded-2xl'
													/>
												</div>
												<div>
													<button
														className='rounded-full bg-foreground text-2xl p-6 outline'
														onClick={() => handleCameraCapture()}
													></button>
												</div>
											</div>
										</DialogDescription>
									</DialogHeader>
								</DialogContent>
							</Dialog> */}
							</div>
						)}
						<div className='w-full'>
							<Input
								type='text'
								value={message}
								placeholder='Aa'
								className='py-6 md:py-6 px-4 placeholder:font-bold placeholder:text-foreground/50 font-bold text-foreground text-lg sm:text-xl md:text-2xl'
								onChange={(event) => {
									if (event.target.value.length > 0) {
										handleTyping(true);
									} else {
										handleTyping(false);
									}

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
