'use client';

import { updateConversation } from '@/services/lifeline-angel/conversation';
import { addTextMessage, getMessages } from '@/services/lifeline-angel/message';
import {
	useMultipleConversationStore,
	useTemporaryMultipleConversationStore,
} from '@/stores/lifeline-angel/conversation';
import { useMultipleMessageStore } from '@/stores/lifeline-angel/message';
import { convertDateTo24HourTimeFormat, copy } from '@/utilities/functions';
import { Message } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IoIosCopy } from 'react-icons/io';
import { useTextToVoice } from 'react-speakup';
import { v4 as uuidv4 } from 'uuid';

const ModelTextMessageCard = ({ message }: { message: Message }) => {
	const { data: session } = useSession();
	const { slug } = useParams() as {
		slug: string[];
	};
	const [content, setContent] = useState<Message | string>();
	const [tag, setTag] = useState('');
	const [type, setType] = useState('');
	const [meaning, setMeaning] = useState('');
	const [procedures, setProcedures] = useState<string[] | []>();
	const [recommendations, setRecommendations] = useState<string[] | []>();
	const [relations, setRelations] = useState<string[] | []>();
	const [references, setReferences] = useState<string[] | []>();
	// const [voiceMessageMode, setVoiceMessageMode] = useState('');
	// const [formattedEnglishMessages, setFormattedEnglishMessages] = useState([]);
	// const [formattedFilipinoMessages, setFormattedFilipinoMessages] = useState(
	// 	[]
	// );

	const { refetch: refetchMessages } = useQuery({
		queryKey: ['getMessages'],
		queryFn: async () => await getMessages(session?.user.email, slug[0]),
	});

	const { addMessage: addMessageLocal } = useMultipleMessageStore();

	const { updateConversation: updateConversationLocal } =
		useMultipleConversationStore();

	const { updateConversation: updateConversationTemporary } =
		useTemporaryMultipleConversationStore();

	const updateConversationMutation = useMutation({
		mutationFn: async (message: string) =>
			await updateConversation(session?.user.email, slug[0], message),
	});

	const addMessageMutation = useMutation({
		mutationFn: async ({ mid, message }: { mid: string; message: string }) =>
			await addTextMessage(session?.user.email, slug[0], mid, message),
		onSuccess: () => refetchMessages(),
	});

	const handleUpdateConversation = (message: string) => {
		updateConversationLocal(slug[0], message);
		updateConversationTemporary(slug[0], message);
		updateConversationMutation.mutate(message);
	};

	const handleAddMessage = (message: string) => {
		const mid = uuidv4();

		addMessageLocal(slug[0], mid, message);
		addMessageMutation.mutate({ mid, message });
		refetchMessages();
	};

	const {
		// speak: speakMessage,
		// pause: pauseMessage,
		// resume: resumeMessage,
		ref: messageRef,
		// setVoice,
		// voices,
	} = useTextToVoice<HTMLDivElement>({
		pitch: 1,
		rate: 1,
		volume: 1,
	});

	// const handleSpeakMessage = () => {
	// 	setVoiceMessageMode('speaking');
	// 	speakMessage();
	// };

	// const handlePauseMessage = () => {
	// 	setVoiceMessageMode('paused');
	// 	pauseMessage();
	// };

	// const handleResumeMessage = () => {
	// 	setVoiceMessageMode('speaking');
	// 	resumeMessage();
	// };

	useEffect(() => {
		// @ts-expect-error: must be corrected properly
		setContent(message.content);
		// @ts-expect-error: must be corrected properly
		setTag(message.content.tag);
		// @ts-expect-error: must be corrected properly
		setType(message.content.type);

		if (typeof message.content === 'object') {
			if (
				// @ts-expect-error: must be corrected properly
				message.content.type === 'injury' ||
				// @ts-expect-error: must be corrected properly
				message.content.type === 'Injury' ||
				// @ts-expect-error: must be corrected properly
				message.content.type === 'treatment'
			) {
				// @ts-expect-error: must be corrected properly
				const proceduresArr = message.content.procedures[0]
					.split('. ')!
					// @ts-expect-error: must be corrected properly
					.map((point) => point.trim())
					// @ts-expect-error: must be corrected properly
					.filter((point) => point.length > 0)
					// @ts-expect-error: must be corrected properly
					.map((point, index) => `${index + 1}. ${point}`);

				// @ts-expect-error: must be corrected properly
				const recommendationsArr = message.content.recommendations[0]
					.split('. ')!
					// @ts-expect-error: must be corrected properly
					.map((point) => point.trim())
					// @ts-expect-error: must be corrected properly
					.filter((point) => point.length > 0)
					// @ts-expect-error: must be corrected properly
					.map((point, index) => `${index + 1}. ${point}`);

				// @ts-expect-error: must be corrected properly
				setMeaning(message.content.meaning);
				setProcedures(proceduresArr);
				setRecommendations(recommendationsArr);
				// @ts-expect-error: must be corrected properly
				setRelations(message.content.relations);
				// @ts-expect-error: must be corrected properly
				setReferences(message.content.references);
			}

			if (
				// @ts-expect-error: must be corrected properly
				message.content.type === 'message' ||
				// @ts-expect-error: must be corrected properly
				message.content.type === 'out'
			) {
				setProcedures([]);
				setRecommendations([]);
				setRelations([]);
				setReferences([]);
			}

			// @ts-expect-error: must be corrected properly
			if (message.content.type === 'message') {
				setMeaning(
					// @ts-expect-error: must be corrected properly
					message.content.meaning[
						// @ts-expect-error: must be corrected properly
						Math.floor(Math.random() * message.content.meaning.length)
					]
				);
			}

			// @ts-expect-error: must be corrected properly
			if (message.content.type === 'out') {
				// @ts-expect-error: must be corrected properly
				setMeaning(message.content.meaning);
			}
		}
	}, []);

	return (
		<div className='flex flex-col space-y-2'>
			{content && typeof content === 'object' && (
				<div className='bg-background outline outline-1 outline-zinc-200 dark:outline-zinc-800 rounded-3xl ml-0 mr-auto'>
					<div
						ref={messageRef}
						className='flex flex-col space-y-6 cursor-pointer px-5 py-6'
					>
						{meaning && (
							<div className='space-y-2'>
								{type !== 'message' && type !== 'out' && (
									<p className='text-lg sm:text-xl md:text-2xl font-bold text-foreground tracking-tight text-ellipsis'>
										{tag}:
									</p>
								)}
								<p className='text-sm sm:text-md md:text-lg text-foreground tracking-tight text-ellipsis'>
									{meaning}
								</p>
							</div>
						)}
						{/* @ts-expect-error: must be corrected properly */}
						{procedures?.length > 0 && (
							<div className='space-y-2'>
								<p className='text-md sm:text-lg md:text-xl font-bold text-foreground tracking-tight text-ellipsis'>
									Procedures
								</p>
								<div className='flex flex-col space-y-1'>
									{procedures?.map((procedure) => (
										<p
											key={procedure}
											className='text-sm sm:text-md md:text-lg text-foreground tracking-tight text-ellipsis'
										>
											{procedure}
										</p>
									))}
								</div>
							</div>
						)}
						{/* @ts-expect-error: must be corrected properly */}
						{recommendations?.length > 0 && (
							<div className='space-y-2'>
								<p className='text-md sm:text-lg md:text-xl font-bold text-foreground tracking-tight text-ellipsis'>
									Recommendations
								</p>
								<div className='flex flex-col space-y-1'>
									{recommendations?.map((recommendation) => (
										<p
											key={recommendation}
											className='text-sm sm:text-md md:text-lg text-foreground tracking-tight text-ellipsis'
										>
											{recommendation}
										</p>
									))}
								</div>
							</div>
						)}
						{/* @ts-expect-error: must be corrected properly */}
						{references?.length > 0 && (
							<div className='space-y-2'>
								<p className='text-md sm:text-lg md:text-xl font-bold text-foreground tracking-tight text-ellipsis'>
									References
								</p>
								<div className='flex flex-col space-y-1'>
									{references?.map((reference) => (
										<Link
											key={reference}
											href={reference}
											target='_blank'
											className='text-sm sm:text-md md:text-lg text-foreground tracking-tight text-ellipsis underline'
										>
											{reference}
										</Link>
									))}
								</div>
							</div>
						)}
						{/* @ts-expect-error: must be corrected properly */}
						{relations?.length > 0 && (
							<div className='space-y-2'>
								<p className='text-md sm:text-lg md:text-xl font-bold text-foreground tracking-tight text-ellipsis'>
									{
										// @ts-expect-error: must be corrected properly
										message.content.type === 'injury' ||
										// @ts-expect-error: must be corrected properly
										message.content.type === 'Injury'
											? 'Alternatives'
											: 'Injuries'
									}
								</p>
								<div className='flex flex-wrap gap-2'>
									{relations?.map((relation) => (
										<button
											key={relation}
											className='text-sm md:text-md lg:text-lg py-2 px-5 outline outline-1 outline-zinc-200 dark:outline-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-3xl font-bold tracking-tight text-foreground'
											onClick={() => {
												handleAddMessage(relation);
												handleUpdateConversation(relation);
											}}
										>
											{relation}
										</button>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			)}
			{content && typeof content === 'string' && (
				<div className='flex flex-col space-y-2'>
					<div className='bg-background outline outline-1 outline-zinc-200 dark:outline-zinc-800 rounded-3xl min-w-4/12 mr-auto'>
						<div className='cursor-pointer p-4'>
							<p className='text-sm md:text-md lg:text-lg text-foreground tracking-tight leading-none text-ellipsis text-balance text-center'>
								{content}
							</p>
						</div>
					</div>
				</div>
			)}
			<div className='flex items-center space-x-3'>
				<div>
					<p className='text-xs text-foreground tracking-tight text-ellipsis text-balance text-left'>
						{convertDateTo24HourTimeFormat(message.createdAt.toString())}
					</p>
				</div>
				<div className='flex items-center space-x-2'>
					<div>
						<button
							className='text-foreground text-lg'
							onClick={() =>
								copy(
									`Meaning\n${
										// @ts-expect-error: must be corrected properly
										content.meaning
									}\nProcedures\n${
										// @ts-expect-error: must be corrected properly
										content.procedures[0]
									}\nRecommendations\n${
										// @ts-expect-error: must be corrected properly
										content.recommendations[0]
									} References\n${
										// @ts-expect-error: must be corrected properly
										content.references.map((reference) => reference)
									}\nRelations\n${
										// @ts-expect-error: must be corrected properly
										content.relations.map((relation) => relation)
									}`
								)
							}
						>
							<IoIosCopy />
						</button>
					</div>
					{/* {voiceMessageMode === '' && (
						<div>
							<button
								className='text-foreground text-lg'
								onClick={() => handleSpeakMessage()}
							>
								<RiVoiceprintFill />
							</button>
						</div>
					)}
					{voiceMessageMode === 'speaking' && (
						<div>
							<button
								className='text-green-600 text-lg'
								onClick={() => handlePauseMessage()}
							>
								<RiVoiceprintFill />
							</button>
						</div>
					)}
					{voiceMessageMode === 'paused' && (
						<div>
							<button
								className='text-red-600 text-lg'
								onClick={() => handleResumeMessage()}
							>
								<RiVoiceprintFill />
							</button>
						</div>
					)} */}
				</div>
			</div>
		</div>
	);
};

export default ModelTextMessageCard;
