'use client';

import { convertTo24HourTimeFormat, copy } from '@/utilities/functions';
import { Message } from '@prisma/client';
import { useEffect, useState } from 'react';
import { IoIosCopy } from 'react-icons/io';
import { RiVoiceprintFill } from 'react-icons/ri';
import { useTextToVoice } from 'react-speakup';

const ModelStaticTextMessageCard = ({ message }: { message: Message }) => {
	const [voiceMessageMode, setVoiceMessageMode] = useState('');
	const [isPaused, setIsPaused] = useState(false);
	const [utterance, setUtterance] = useState<SpeechSynthesisUtterance>();
	const [voice, setVoice] = useState(null);
	const [pitch, setPitch] = useState(1);
	const [rate, setRate] = useState(1);
	const [volume, setVolume] = useState(1);

	const handleSpeakMessage = () => {
		const synth = window.speechSynthesis;

		if (isPaused) {
			synth.resume();
		} else {
			if (utterance) {
				utterance.voice = voice;
				utterance.pitch = pitch;
				utterance.rate = rate;
				utterance.volume = volume;
				synth.speak(utterance);
			}
		}

		setIsPaused(false);
		setVoiceMessageMode('speaking');
	};

	const handlePauseMessage = () => {
		const synth = window.speechSynthesis;

		setIsPaused(true);
		synth.pause();
		setVoiceMessageMode('paused');
	};

	const handleResumeMessage = () => {
		const synth = window.speechSynthesis;

		setIsPaused(false);
		synth.cancel();
		setVoiceMessageMode('resumed');
	};

	useEffect(() => {
		const synth = window.speechSynthesis;
		const u = new SpeechSynthesisUtterance('Mamba');

		setUtterance(u);

		// Add an event listener to the speechSynthesis object to listen for the voiceschanged event
		synth.addEventListener('voiceschanged', () => {
			const voices = synth.getVoices();
			setVoice(voices[0]);
		});

		return () => {
			synth.cancel();
			synth.removeEventListener('voiceschanged', () => {
				setVoice(null);
			});
		};
	}, [message]);

	return (
		<div className='flex flex-col space-y-2'>
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
