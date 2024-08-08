import { FaLifeRing, FaQuestion } from 'react-icons/fa';
import { FaGear, FaShield } from 'react-icons/fa6';
import { FiPaperclip } from 'react-icons/fi';
import { IoIosPaper, IoIosWarning } from 'react-icons/io';

const SETTINGS = [
	{
		name: 'Preferences',
		icon: FaGear,
	},
	{
		name: 'Privacy',
		icon: FaShield,
	},
	{
		name: 'Terms',
		icon: IoIosPaper,
	},
	{
		name: 'Conditions',
		icon: FiPaperclip,
	},
	{
		name: 'Safety',
		icon: FaLifeRing,
	},
	{
		name: 'Help',
		icon: FaQuestion,
	},
	{
		name: 'Report',
		icon: IoIosWarning,
	},
];

export default SETTINGS;
