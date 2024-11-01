'use client';

import { Message } from '.pnpm/@prisma+client@5.21.1_prisma@5.21.1/node_modules/@prisma/client/default';
import {
	useEffect,
	useState,
} from '.pnpm/@types+react@18.3.12/node_modules/@types/react';
import { IoIosCopy } from '.pnpm/react-icons@5.3.0_react@19.0.0-rc-02c0e824-20241028/node_modules/react-icons/io';
import { RiVoiceprintFill } from '.pnpm/react-icons@5.3.0_react@19.0.0-rc-02c0e824-20241028/node_modules/react-icons/ri';
import { useTextToVoice } from '.pnpm/react-speakup@1.1.2_react@19.0.0-rc-02c0e824-20241028/node_modules/react-speakup/dist/esm';
import { convertDateTo24HourTimeFormat, copy } from '@/utilities/functions';

const ModelTextMessageCard = ({ message }: { message: Message }) => {
	const [voiceMessageMode, setVoiceMessageMode] = useState('');
	// const [formattedEnglishMessages, setFormattedEnglishMessages] = useState([]);
	// const [formattedFilipinoMessages, setFormattedFilipinoMessages] = useState(
	// 	[]
	// );

	// const {
	// 	speak: speakMessage,
	// 	pause: pauseMessage,
	// 	resume: resumeMessage,
	// 	ref: messageRef,
	// 	setVoice,
	// 	voices,
	// } = useTextToVoice<HTMLDivElement>({
	// 	pitch: 1,
	// 	rate: 1,
	// 	volume: 1,
	// });

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

	// useEffect(() => {
	// 	if (typeof message.content === 'object') {
	// 		// @ts-expect-error
	// 		const formattedEnglishMessages = message.content.eng
	// 			.split('.')!
	// 			// @ts-expect-error
	// 			.map((point) => point.trim())
	// 			// @ts-expect-error
	// 			.filter((point) => point.length > 0);
	// 		// @ts-expect-error
	// 		const formattedFilipinoMessages = message.content.fil
	// 			.split('.')
	// 			// @ts-expect-error
	// 			.map((point) => point.trim())
	// 			// @ts-expect-error
	// 			.filter((point) => point.length > 0);

	// 		setFormattedEnglishMessages(formattedEnglishMessages);
	// 		setFormattedFilipinoMessages(formattedFilipinoMessages);
	// 	}
	// }, []);

	useEffect(() => {
		if (typeof message.content === 'object') {
		}
	}, []);

	console.log(message);

	return (
		<div className='flex flex-col space-y-2'>
			<div
				key={message.id}
				className='bg-foreground rounded-xl ml-0 mr-auto w-5/12'
			>
				<div className='flex flex-col space-y-6 cursor-pointer p-4'>
					<div className='space-y-2'>
						<p className='text-xl font-bold text-background tracking-tight text-ellipsis'>
							Meaning
						</p>
						<p className='text-lg text-background tracking-tight text-ellipsis'>
							{/* @ts-expect-error */}
							{message.content.meaning}
						</p>
					</div>
					<div className='space-y-2'>
						<p className='text-xl font-bold text-background tracking-tight text-ellipsis'>
							Procedures
						</p>
						<div className='flex flex-col space-y-1'>
							{/* @ts-expect-error */}
							{message.content.procedures.map((procedure) => (
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
							{/* @ts-expect-error */}
							{message.content.references.map((reference) => (
								<p
									key={reference}
									className='text-lg text-background tracking-tight text-ellipsis'
								>
									{reference}
								</p>
							))}
						</div>
					</div>
					<div className='space-y-2'>
						<p className='text-xl font-bold text-background tracking-tight text-ellipsis'>
							Relations
						</p>
						<div className='flex flex-col space-y-1'>
							{/* @ts-expect-error */}
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
