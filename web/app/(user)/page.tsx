'use client';

// import { Button } from '@/components/ui/button';
// import {
// 	Dialog,
// 	DialogContent,
// 	DialogDescription,
// 	DialogHeader,
// 	DialogTitle,
// 	DialogTrigger,
// } from '@/components/ui/dialog';
import { FlipWords } from '@/components/ui/flip-words';
// import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
// import { TEXT_INJURIES } from '@/sources/injuries';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
// import { useRef, useState } from 'react';
// import { FaLocationArrow, FaMicrophone, FaPaperclip } from 'react-icons/fa';
// import { FaCloudArrowUp } from 'react-icons/fa6';
// import { RiVoiceprintFill } from 'react-icons/ri';
// import { useSpeechRecognition } from 'react-speech-recognition';

export default function Page() {
	const { data: session } = useSession();
	// const fileRef = useRef<HTMLInputElement>(null);
	// const [message, setMessage] = useState('');
	// const [uploading, setUploading] = useState(false);
	// const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
	// 	useSpeechRecognition();
	// const [microphone, setMicrophone] = useState(false);
	const words = [
		'ANGEL',
		'VESPER',
		'ASTRA',
		'SAVIOR',
		'HELPER',
		'COMPANION',
		'GUIDE',
		'PROTECTOR',
		'ALLY',
		'SUPPORT',
		'SHIELD',
		'FRIEND',
		'BEACON',
		'HERO',
		'LIGHT',
		'SOLACE',
		'RESCUE',
		'SHELTER',
		'NURTURE',
		'EMBRACE',
		'HOPE',
	];

	// const formik = useFormik({
	// 	initialValues: {
	// 		file: '',
	// 	},
	// 	onSubmit: async () => {
	// 		setUploading(true);

	// 		try {
	// 			const response = await addImageMessage(
	// 				session?.user.email,
	// 				slug[0],
	// 				uuidv4(),
	// 				formik.values.file
	// 			);
	// 			const message = response.prediction;

	// 			handleUpdateConversation(message);
	// 			refetchMessages();
	// 		} catch (error) {
	// 			console.log(error);
	// 		}

	// 		setUploading(false);
	// 	},
	// 	validationSchema: Yup.object().shape({
	// 		file: Yup.mixed()
	// 			.required('Required')
	// 			.test('file-format', 'Only image files are allowed', (value) => {
	// 				if (value) {
	// 					const supportedFormats = ['png', 'jpg', 'jpeg'];
	// 					// @ts-expect-error: must be corrected properly
	// 					return supportedFormats.includes(value.name.split('.').pop());
	// 				}
	// 				return true;
	// 			})
	// 			.test(
	// 				'file-size',
	// 				'File size must not be more than 10MB',
	// 				(value) => {
	// 					if (value) {
	// 						// @ts-expect-error: must be corrected properly
	// 						return value.size < 5145728;
	// 					}
	// 					return true;
	// 				}
	// 			),
	// 	}),
	// });

	if (!session) {
		return redirect('/signin');
	}

	return (
		<main>
			<section className='relative rounded-3xl h-screen'>
				<SidebarTrigger
					variant='outline'
					className='absolute md:invisible top-2 left-2 text-foreground p-5 rounded-2xl'
				/>
				<div className='flex flex-col justify-center items-center h-full space-y-8 rounded-3xl outline outline-1 outline-zinc-200 dark:outline-zinc-800'>
					<div className='w-full'>
						<h1 className='text-4xl sm:text-5xl md:text-6xl font-bold text-center uppercase'>
							Lifeline <FlipWords words={words} /> <br />
						</h1>
					</div>
					{/* <div className='flex justify-center items-center space-x-3 w-6/12'>
						<Dialog>
							<DialogTrigger asChild>
								<Button className='bg-background text-foreground outline outline-1 outline-zinc-200 dark:outline-zinc-800 hover:bg-zinc-100 py-6 px-4 hover:bg-zinc-100 dark:hover:bg-zinc-800'>
									<FaPaperclip />
								</Button>
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
												// onSubmit={formik.handleSubmit}
											>
												<Input
													required
													// ref={fileRef}
													id='image-input'
													name='file'
													type='file'
													accept='image/*'
													// onChange={handleChange}
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
													// disabled={uploading}
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
								<Button className='bg-background text-foreground outline outline-1 outline-zinc-200 dark:outline-zinc-800 hover:bg-zinc-100 py-6 px-4 hover:bg-zinc-100 dark:hover:bg-zinc-800'>
									<FaMicrophone />
								</Button>
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
																// onClick={() => handleOpenMicrophone()}
															></button>
														</div>
													)}
													{microphone && (
														<div>
															<button
																className='rounded-full bg-red-600 text-2xl p-6 outline'
																// onClick={() =>
																// 	handleCloseMicrophone(transcript)
																// }
															></button>
														</div>
													)}
													<div className='flex flex-wrap w-96'>
														<p className='text-lg text-white'>{transcript}</p>
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
						<div className='w-full'>
							<Input
								type='text'
								// value={message}
								placeholder='Abrasions'
								className='py-6 px-4 placeholder:font-bold placeholder:text-foreground/50 font-bold text-foreground text-2xl w-full'
								// onChange={(event) => {
								// 	setMessage(event.target.value);
								// }}
								// onKeyPress={(event) => {
								// 	if (event.key === 'Enter') {
								// 		handleAddMessage(message);
								// 		handleUpdateConversation(message);
								// 	}
								// }}
							/>
						</div>
						<div>
							<button
								// disabled={message.length <= 0}
								className='rounded-full bg-foreground text-background text-xl p-3'
								// onClick={() => {
								// 	handleAddMessage(message);
								// 	handleUpdateConversation(message);
								// }}
							>
								<FaLocationArrow />
							</button>
						</div>
					</div> */}
					{/* <div className='flex flex-wrap gap-2 w-6/12'>
						{TEXT_INJURIES.map((injury) => (
							<button
								key={injury.content}
								className='text-lg py-2 px-5 outline outline-1 outline-zinc-200 dark:outline-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-3xl font-bold tracking-tight text-foreground'
								// onClick={() => {
								// 	handleAddMessage(injury.content);
								// 	handleUpdateConversation(injury.content);
								// }}
							>
								{injury.content}
							</button>
						))}
					</div> */}
				</div>
			</section>
		</main>
	);
}
