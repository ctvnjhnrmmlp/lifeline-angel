'use client';

import { convertDateTo24HourTimeFormat } from '@/utilities/functions';
import { Message } from '@prisma/client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IoIosCopy } from 'react-icons/io';
import { RiVoiceprintFill } from 'react-icons/ri';
import { useTextToVoice } from 'react-speakup';

const ModelTextMessageCard = ({ message }: { message: Message }) => {
	const [voiceMessageMode, setVoiceMessageMode] = useState('');
	const [formattedProcedures, setFormattedProcedures] = useState([]);
	const [formattedEnglishMessages, setFormattedEnglishMessages] = useState([]);
	const [formattedFilipinoMessages, setFormattedFilipinoMessages] = useState(
		[]
	);

	const {
		speak: speakMessage,
		pause: pauseMessage,
		resume: resumeMessage,
		ref: messageRef,
		setVoice,
		voices,
	} = useTextToVoice<HTMLDivElement>({
		pitch: 1,
		rate: 1,
		volume: 1,
	});

	const handleSpeakMessage = () => {
		setVoiceMessageMode('speaking');
		speakMessage();
	};

	const handlePauseMessage = () => {
		setVoiceMessageMode('paused');
		pauseMessage();
	};

	const handleResumeMessage = () => {
		setVoiceMessageMode('speaking');
		resumeMessage();
	};

	useEffect(() => {
		// @ts-ignore
		const formattedProcedureArr = message.content.procedures[0]
			.split('. ')!
			// @ts-ignore
			.map((point) => point.trim())
			// @ts-ignore
			.filter((point) => point.length > 0);

		setFormattedProcedures(formattedProcedureArr);
	}, []);

	return (
		<div className='flex flex-col space-y-2'>
			<div
				key={message.id}
				className='bg-foreground rounded-3xl ml-0 mr-auto w-12/12 md:w-10/12 lg:w-8/12 xl:w-5/12'
			>
				<div className='flex flex-col space-y-6 cursor-pointer p-4'>
					<div className='space-y-2'>
						<p className='text-xl font-bold text-background tracking-tight text-ellipsis'>
							Meaning
						</p>
						<p className='text-lg text-background tracking-tight text-ellipsis'>
							{/* @ts-ignore */}
							{message.content.meaning}
						</p>
					</div>
					<div className='space-y-2'>
						<p className='text-xl font-bold text-background tracking-tight text-ellipsis'>
							Procedures
						</p>
						<div className='flex flex-col space-y-1'>
							{formattedProcedures.map((procedure) => (
								<p
									key={procedure}
									className='text-lg text-background tracking-tight text-ellipsis'
								>
									{procedure}
								</p>
							))}
						</div>
					</div>
					<div className='space-y-2'>
						<p className='text-xl font-bold text-background tracking-tight text-ellipsis'>
							References
						</p>
						<div className='flex flex-col space-y-1'>
							{/* @ts-ignore */}
							{message.content.references.map((reference) => (
								<Link
									key={reference}
									href={reference}
									target='_blank'
									className='text-lg text-background tracking-tight text-ellipsis underline'
								>
									{reference}
								</Link>
							))}
						</div>
					</div>
					<div className='space-y-2'>
						<p className='text-xl font-bold text-background tracking-tight text-ellipsis'>
							Relations
						</p>
						<div className='flex flex-col space-y-1'>
							{/* @ts-ignore */}
							{message.content.relations.map((relation) => (
								<p
									key={relation}
									className='text-lg text-background tracking-tight text-ellipsis'
								>
									{relation}
								</p>
							))}
						</div>
					</div>
				</div>
			</div>
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
							// onClick={() => copy(message.content)}
						>
							<IoIosCopy />
						</button>
					</div>
					{voiceMessageMode === '' && (
						<div>
							<button
								className='text-foreground text-lg'
								// onClick={() => handleSpeakMessage()}
							>
								<RiVoiceprintFill />
							</button>
						</div>
					)}
					{voiceMessageMode === 'speaking' && (
						<div>
							<button
								className='text-green-600 text-lg'
								// onClick={() => handlePauseMessage()}
							>
								<RiVoiceprintFill />
							</button>
						</div>
					)}
					{voiceMessageMode === 'paused' && (
						<div>
							<button
								className='text-red-600 text-lg'
								// onClick={() => handleResumeMessage()}
							>
								<RiVoiceprintFill />
							</button>
						</div>
					)}
				</div>
			</div>

			{/* <div
				key={message.id}
				className='bg-foreground rounded-2xl ml-0 mr-auto w-5/12'
			>
				<div className='flex flex-col space-y-6 cursor-pointer p-4'>
					{typeof message.content === 'string' && (
						<p className='text-lg text-background tracking-tight text-ellipsis'>
							{message.content}
						</p>
					)}
					{typeof message.content === 'object' && (
						<>
							<ul>
								{formattedEnglishMessages.map((message: string) => (
									<li
										key={message}
										className='text-lg text-background tracking-tight text-ellipsis'
									>
										{message}
									</li>
								))}
							</ul>
							<ul className='italic'>
								{formattedFilipinoMessages.map((message: string) => (
									<li
										key={message}
										className='text-lg text-background tracking-tight text-ellipsis'
									>
										{message}
									</li>
								))}
							</ul>
						</>
					)}
				</div>
			</div>
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
							// onClick={() => copy(message.content)}
						>
							<IoIosCopy />
						</button>
					</div>
					{voiceMessageMode === '' && (
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
					)}
				</div>
			</div> */}
		</div>
	);
};

export default ModelTextMessageCard;
