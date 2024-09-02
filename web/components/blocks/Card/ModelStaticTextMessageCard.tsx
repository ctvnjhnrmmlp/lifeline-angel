'use client';

import { convertTo24HourTimeFormat, copy } from '@/utilities/functions';
import { Message } from '@prisma/client';
import { useState } from 'react';
import { IoIosCopy } from 'react-icons/io';
import { RiVoiceprintFill } from 'react-icons/ri';
import { useTextToVoice } from 'react-speakup';

const ModelStaticTextMessageCard = ({ message }: { message: Message }) => {
	const [voiceMessageMode, setVoiceMessageMode] = useState('');

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

	return (
		<div className='flex flex-col space-y-2'>
			<div
				key={message.id}
				className='bg-foreground rounded-2xl ml-0 mr-auto w-5/12'
			>
				<div className='cursor-pointer p-4'>
					<p
						ref={messageRef}
						className='text-lg text-background tracking-tight leading-none text-ellipsis text-justify'
					>
						{message.content}
					</p>
				</div>
			</div>
			<div className='flex items-center space-x-3'>
				<div>
					<p className='text-xs text-foreground tracking-tight text-ellipsis text-balance text-left'>
						{convertTo24HourTimeFormat(message.createdAt.toString())}
					</p>
				</div>
				<div className='flex items-center space-x-2'>
					<div>
						<button
							className='text-foreground text-lg'
							onClick={() => copy(message.content)}
						>
							<IoIosCopy />
						</button>
					</div>
					<select
						onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
							setVoice(event.target.value)
						}
					>
						{voices.map((voice) => (
							<option key={voice}>{voice}</option>
						))}
					</select>
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
			</div>
		</div>
	);
};

export default ModelStaticTextMessageCard;
