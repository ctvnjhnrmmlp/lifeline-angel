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
import { IMAGE_INJURIES, TEXT_INJURIES } from '@/sources/injuries';
import { useMultipleMessageStore } from '@/stores/lifeline-angel/message';
import {
	checkEntitySecondsAgo,
	checkTextValidURL,
} from '@/utilities/functions';
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
import { PhotoProvider, PhotoView } from 'react-photo-view';
import SpeechRecognition, {
	useSpeechRecognition,
} from 'react-speech-recognition';

import {
	useMultipleConversationStore,
	useSingleConversationStore,
	useTemporaryMultipleConversationStore,
} from '@/stores/lifeline-angel/conversation';
import {
	convertImageDataUrlToFile,
	convertTo24HourTimeFormat,
	convertToDateFormat,
} from '@/utilities/functions';
import { Card, CardBody, CardFooter, ScrollShadow } from '@nextui-org/react';
import { useFormik } from 'formik';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FaLocationArrow, FaMicrophone } from 'react-icons/fa';
import { FaCloudArrowUp } from 'react-icons/fa6';
import { GiRaggedWound } from 'react-icons/gi';
import { MdPersonalInjury } from 'react-icons/md';
import { RiVoiceprintFill } from 'react-icons/ri';
import { useTextToVoice } from 'react-speakup';
import { TypeAnimation } from 'react-type-animation';
import Webcam from 'react-webcam';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';

export default function Page({ params }: { params: { slug: string[] } }) {
	const router = useRouter();
	const { data: session } = useSession();
	const fileRef = useRef<HTMLInputElement>(null);
	const [message, setMessage] = useState('');
	const [uploading, setUploading] = useState(false);
	const [microphone, setMicrophone] = useState(false);
	const cameraRef = useRef<Webcam>(null);
	const [image, setImage] = useState('');

	const {
		transcript,
		listening,
		resetTranscript,
		browserSupportsSpeechRecognition,
	} = useSpeechRecognition();

	const { speak, pause, resume, ref, setVoice, voices } =
		useTextToVoice<HTMLDivElement>();

	const {
		isOpen: isOpenTextInjury,
		onOpen: onOpenTextInjury,
		onOpenChange: onOpenChangeTextInjury,
	} = useDisclosure();

	const {
		isOpen: isOpenImageInjury,
		onOpen: onOpenImageInjury,
		onOpenChange: onOpenChangeImageInjury,
	} = useDisclosure();

	const {
		isOpen: isOpenCamera,
		onOpen: onOpenCamera,
		onClose: onCloseCamera,
		onOpenChange: onOpenChangeCamera,
	} = useDisclosure();

	const {
		isOpen: isOpenCapturedImage,
		onOpen: onOpenCapturedImage,
		onClose: onCloseCapturedImage,
		onOpenChange: onOpenChangeCapturedImage,
	} = useDisclosure();

	const {
		isOpen: isOpenMicrophone,
		onOpen: onOpenMicrophone,
		onOpenChange: onOpenChangeMicrophone,
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
			await updateConversation(session?.user.email, params.slug[0], message),
	});

	const deleteConversationMutation = useMutation({
		mutationFn: async () =>
			await deleteConversation(session?.user.email, params.slug[0]),
	});

	const addMessageMutation = useMutation({
		mutationFn: async ({ mid, message }: { mid: string; message: string }) =>
			await addTextMessage(session?.user.email, params.slug[0], mid, message),
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
		updateConversationLocal(params.slug[0], message);
		updateConversationTemporary(params.slug[0], message);
		updateConversationMutation.mutate(message);
	};

	const handleDeleteConversation = () => {
		deleteConversationLocal(params.slug[0]);
		deleteConversationTemporary(params.slug[0]);
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
		onOpenCapturedImage();
	}, [cameraRef]);

	const handleAddImageMessage = async (image: string) => {
		const response = await addImageMessage(
			session?.user.email,
			params.slug[0],
			uuidv4(),
			convertImageDataUrlToFile(image, uuidv4())
		);
		const message = response.prediction;

		handleUpdateConversation(message);
		onCloseCapturedImage();
		onCloseCamera();
	};

	if (!session) {
		return redirect('/signin');
	}

	return (
		<main className='flex flex-col justify-center pl-[26rem] py-4 pr-4 h-screen w-screen'>
			<section className='overflow-y-scroll no-scrollbar backdrop-blur-2xl bg-foreground/5 rounded-2xl h-screen'>
				<div className='flex flex-col p-6 h-full'>
					{/* Conversation Navbar */}
					<div className='w-full flex flex-col flex-wrap justify-between space-between gap-12'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='font-bold text-4xl'>
									{conversationLocal?.title
										? conversationLocal.title
										: 'New conversation'}
								</p>
							</div>
							<div className='flex space-x-2'>
								{messagesServer && messagesServer.length > 0 && (
									<>
										<button
											className='p-3 text-foreground text-2xl'
											onClick={() => onOpenTextInjury()}
										>
											<MdPersonalInjury />
										</button>
										<button
											className='p-3 text-foreground text-2xl'
											onClick={() => onOpenImageInjury()}
										>
											<GiRaggedWound />
										</button>
									</>
								)}
								<button
									className='p-3 text-foreground text-2xl'
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
							{messagesServer && messagesServer.length > 0 && (
								<div className='backdrop-blur-2xl bg-foreground/5 rounded-full min-w-4/12 mx-auto'>
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
											<p className='text-2xl font-bold'>Text Injuries</p>
										</div>
										<div className='flex flex-wrap gap-2'>
											{TEXT_INJURIES.map((injury) => (
												<button
													key={injury.content}
													className='text-lg rounded-2xl py-2 px-5 backdrop-blur-2xl bg-foreground/5 font-bold tracking-tight'
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
											<p className='text-2xl font-bold'>Image Injuries</p>
										</div>
										<div className='flex flex-wrap gap-3'>
											{IMAGE_INJURIES.map((injury) => (
												<Card
													isPressable
													shadow='sm'
													key={injury.content}
													classNames={{
														base: 'backdrop-blur-2xl bg-foreground/5',
													}}
													onPress={() => {
														handleAddMessage(injury.content);
														handleUpdateConversation(injury.content);
													}}
												>
													<CardBody className='overflow-visible p-0'>
														<Image
															width={130}
															height={130}
															alt={injury.content}
															className='w-full object-cover'
															src={`/images/${injury.source}`}
														/>
													</CardBody>
													<CardFooter>
														<p className='text-md'>{injury.content}</p>
													</CardFooter>
												</Card>
											))}
										</div>
									</div>
								</div>
							)}

							{messagesLocal?.map((message) => {
								if (checkTextValidURL(message.content)) {
									return (
										<div
											key={message.id}
											className='backdrop-blur-2xl bg-foreground/5 rounded-2xl min-w-1/12 ml-auto mr-0'
										>
											<div className='cursor-pointer p-6'>
												<PhotoProvider>
													<PhotoView src={message.content}>
														<Image
															src={`${message.content}`}
															height={300}
															width={300}
															alt='Wound image'
															className='mx-auto'
														/>
													</PhotoView>
												</PhotoProvider>
											</div>
										</div>
									);
								} else {
									if (message.from === 'user') {
										return (
											<>
												<div
													key={message.id}
													className='backdrop-blur-2xl bg-foreground/5 rounded-2xl min-w-4/12 ml-auto mr-0'
												>
													<div className='cursor-pointer p-4'>
														<p className='text-lg text-foreground tracking-tight leading-none text-ellipsis text-balance text-center'>
															{message.content}
														</p>
													</div>
												</div>
												<p className='text-xs text-foreground tracking-tight leading-none text-ellipsis text-balance text-right'>
													{convertTo24HourTimeFormat(
														message.createdAt.toString()
													)}
												</p>
											</>
										);
									}

									return (
										<>
											{checkEntitySecondsAgo(message.createdAt.toString()) && (
												<>
													<div
														key={message.id}
														className='bg-foreground rounded-2xl ml-0 mr-auto w-5/12'
													>
														<div className='cursor-pointer p-4'>
															<p className='text-lg text-background tracking-tight leading-none text-ellipsis text-justify'>
																<TypeAnimation
																	sequence={[message.content]}
																	cursor={false}
																	speed={75}
																/>
															</p>
														</div>
													</div>
													<p className='text-xs text-foreground tracking-tight leading-none text-ellipsis text-balance text-left'>
														{convertTo24HourTimeFormat(
															message.createdAt.toString()
														)}
													</p>
												</>
											)}
											{!checkEntitySecondsAgo(message.createdAt.toString()) && (
												<>
													<div
														key={message.id}
														className='bg-foreground rounded-2xl ml-0 mr-auto w-5/12'
													>
														<div className='cursor-pointer p-4'>
															<p className='text-lg text-background tracking-tight leading-none text-ellipsis text-justify'>
																{message.content}
															</p>
														</div>
													</div>
													<p className='text-xs text-foreground tracking-tight leading-none text-ellipsis text-balance text-left'>
														{convertTo24HourTimeFormat(
															message.createdAt.toString()
														)}
													</p>
												</>
											)}
										</>
									);
								}
							})}
						</ScrollShadow>
					</div>
					{/* Message */}
					<div className='flex justify-between items-center space-x-6'>
						<div className='flex items-center justify-center space-x-4'>
							<button className='text-foreground text-2xl' onClick={onOpenFile}>
								<FaPaperclip />
							</button>
							<button
								className='text-foreground text-2xl'
								onClick={onOpenMicrophone}
							>
								<FaMicrophone />
							</button>
							<button
								className='text-foreground text-2xl'
								onClick={() => onOpenCamera()}
							>
								<FaCamera />
							</button>
						</div>
						<div className='w-full'>
							<input
								type='text'
								value={message}
								placeholder='Aa'
								className='py-3 px-4 w-full rounded-xl placeholder:font-bold placeholder:text-foreground font-bold text-foreground text-2xl'
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
								className='rounded-full bg-foreground text-background text-2xl p-3'
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
							size='xl'
							backdrop='blur'
							isOpen={isOpenTextInjury}
							classNames={{
								base: 'bg-background',
								header: 'flex justify-center items-center',
								body: 'flex gap-4',
							}}
							onOpenChange={() => onOpenChangeTextInjury()}
						>
							<ModalContent>
								{(onClose) => (
									<>
										<ModalHeader>
											<p className='text-2xl font-bold text-center'>
												Text Injuries
											</p>
										</ModalHeader>
										<ModalBody>
											<div className='flex flex-wrap gap-2'>
												{TEXT_INJURIES.map((injury) => (
													<button
														key={injury.content}
														className='text-lg rounded-2xl py-2 px-5 backdrop-blur-2xl bg-foreground/10 font-bold tracking-tight'
														onClick={() => {
															handleAddMessage(injury.content);
															handleUpdateConversation(injury.content);
															onOpenChangeTextInjury();
														}}
													>
														{injury.content}
													</button>
												))}
											</div>
										</ModalBody>
										<ModalFooter></ModalFooter>
									</>
								)}
							</ModalContent>
						</Modal>
						<Modal
							size='full'
							backdrop='blur'
							isOpen={isOpenImageInjury}
							classNames={{
								base: 'bg-background',
								header: 'flex justify-center items-center',
								body: 'flex gap-4',
							}}
							onOpenChange={() => onOpenChangeImageInjury()}
						>
							<ModalContent>
								{(onClose) => (
									<>
										<ModalHeader>
											<p className='text-2xl font-bold text-center'>
												Image Injuries
											</p>
										</ModalHeader>
										<ModalBody>
											<div className='flex flex-wrap gap-3'>
												{IMAGE_INJURIES.map((injury) => (
													<Card
														isPressable
														shadow='sm'
														key={injury.content}
														classNames={{
															base: 'backdrop-blur-2xl bg-foreground/10',
														}}
														onPress={() => {
															handleAddMessage(injury.content);
															handleUpdateConversation(injury.content);
															onOpenChangeImageInjury();
														}}
													>
														<CardBody className='overflow-visible p-0'>
															<Image
																width={130}
																height={130}
																alt={injury.content}
																className='w-full object-cover'
																src={`/images/${injury.source}`}
															/>
														</CardBody>
														<CardFooter>
															<p className='text-md'>{injury.content}</p>
														</CardFooter>
													</Card>
												))}
											</div>
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
													: 'New conversation'}
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
							isOpen={isOpenMicrophone}
							classNames={{
								base: 'bg-background',
								header: 'flex justify-center items-center',
								body: 'flex gap-4',
							}}
							onOpenChange={() => onOpenChangeMicrophone()}
						>
							<ModalContent>
								{(onClose) => (
									<>
										<ModalHeader>
											<p className='text-2xl font-bold text-center'>
												Microphone
											</p>
										</ModalHeader>
										<ModalBody>
											<div className='flex flex-col space-y-8 items-center justify-center'>
												{browserSupportsSpeechRecognition && (
													<>
														<div>
															<p className='text-[11rem]'>
																<RiVoiceprintFill />
															</p>
														</div>
														{!microphone && (
															<div>
																<button
																	className='rounded-full bg-foreground text-2xl p-6 outline'
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
															<p className='text-lg'>{transcript}</p>
														</div>
													</>
												)}
												{!browserSupportsSpeechRecognition && (
													<span>
														Browser doesn't support speech recognition.
													</span>
												)}
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
										</ModalBody>
										<ModalFooter></ModalFooter>
									</>
								)}
							</ModalContent>
						</Modal>
						<Modal
							size='lg'
							backdrop='blur'
							isOpen={isOpenCapturedImage}
							classNames={{
								base: 'bg-background',
								header: 'flex justify-center items-center',
								body: 'flex gap-4',
							}}
							onOpenChange={() => onOpenChangeCapturedImage()}
						>
							<ModalContent>
								{(onClose) => (
									<>
										<ModalHeader>
											<p className='text-2xl font-bold text-center'>
												Captured Image
											</p>
										</ModalHeader>
										<ModalBody>
											<div className='flex flex-col space-y-8 items-center justify-center'>
												<div>
													<Image
														src={image}
														width={1000}
														height={1000}
														alt='User captured image'
													/>
												</div>
												<div>
													<button
														className='rounded-full bg-foreground text-background text-2xl p-3'
														onClick={() => handleAddImageMessage(image)}
													>
														<FaLocationArrow />
													</button>
												</div>
											</div>
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
