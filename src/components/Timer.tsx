import { useState, useRef } from 'react';
import endSound from '../../public/ring.mp3';
import startSound from '../../public/start.wav';

export default function Timer() {
	const [time, setTime] = useState<string>('25:00');
	const [isRunning, setIsRunning] = useState<boolean>(false);
	const currentTime = useRef<NodeJS.Timeout | null>(null);
	const endAudioRef = useRef<HTMLAudioElement>(new Audio(endSound));
	const startAudioRef = useRef<HTMLAudioElement>(new Audio(startSound));

	function handleStart() {
		setIsRunning(true);
		startAudioRef.current.play();

		const intervalId = setInterval(() => {
			setTime((prevTime: string) => calculateTime(prevTime));
		}, 1000);

		currentTime.current = intervalId;
	}

	function calculateTime(prevTime: string): string {
		const [minutesStr, secondsStr] = prevTime.split(':');
		let minutes: number = parseInt(minutesStr, 10);
		let seconds: number = parseInt(secondsStr, 10) - 1;

		if (seconds < 0) {
			if (minutes === 0) {
				setIsRunning(false);
				clearInterval(currentTime.current as NodeJS.Timeout);
				return '25:00';
			}

			seconds = 59;
			minutes -= 1;
		}

		if (minutes === 0 && seconds === 6) {
			endAudioRef.current.play();
		}

		return `${minutes.toString().padStart(2, '0')}:${seconds
			.toString()
			.padStart(2, '0')}`;
	}

	function handleStop() {
		setIsRunning(false);
		clearInterval(currentTime.current as NodeJS.Timeout);
		currentTime.current = null;
	}

	function handleCreateToStudy() {
		const toStudyElement = document.getElementById('tostudy');

		if (toStudyElement) {
			toStudyElement.scrollIntoView({ behavior: 'smooth' });
		}
	}

	return (
		<>
			<div
				className='grid grid-rows-4 grid-cols-4 place-items-center bg-[background-img] bg-contain h-screen'
				id='container'
			>
				<div className='flex flex-col items-center justify-evenly row-start-2 row-end-4 col-start-2 col-end-4 text-center bg-opacity-50 backdrop-blur-sm bg-white rounded-lg shadow-xl backdrop-filter backdrop-blur-6 border-1 border-opacity-30 w-64 md:w-full lg:w-full md:h-full lg:h-full max-h-96 p-10'>
					<div className='text-6xl md:text-8xl lg:text-8xl font-bold font-oswald text-red-600 p-5'>
						{time}
					</div>
					<button
						onClick={isRunning ? handleStop : handleStart}
						className='uppercase font-oswald text-white border-none bg-zinc-800 bg-opacity-90 transition-all hover:bg-opacity-100 shadow-lg rounded-md py-3 px-8'
					>
						{isRunning ? 'stop' : 'start'}
					</button>
				</div>
				<button
					className='row-start-4 row-end-5 col-start-2 col-end-4 uppercase font-oswald text-white text-1.6rem rounded-12 p-4 bg-zinc-800 bg-opacity-80 transition-all hover:bg-opacity-100 shadow-lg rounded-md'
					onClick={handleCreateToStudy}
				>
					create a new toStudy
				</button>
			</div>
		</>
	);
}