import { useDisclosure } from '@nextui-org/react';
import { FaLifeRing, FaQuestion } from 'react-icons/fa';
import { FaGear, FaShield } from 'react-icons/fa6';
import { FiPaperclip } from 'react-icons/fi';
import { IoIosPaper, IoIosWarning } from 'react-icons/io';

const {
	isOpen: isOpenPreferences,
	onOpen: onOpenPreferences,
	onOpenChange: onOpenChangePreferences,
} = useDisclosure();

const {
	isOpen: isOpenPrivacy,
	onOpen: onOpenPrivacy,
	onOpenChange: onOpenChangePrivacy,
} = useDisclosure();

const {
	isOpen: isOpenTerms,
	onOpen: onOpenTerms,
	onOpenChange: onOpenChangeTerms,
} = useDisclosure();

const {
	isOpen: isOpenConditions,
	onOpen: onOpenConditions,
	onOpenChange: onOpenChangeConditions,
} = useDisclosure();

const {
	isOpen: isOpenSafety,
	onOpen: onOpenSafety,
	onOpenChange: onOpenChangeSafety,
} = useDisclosure();

const {
	isOpen: isOpenHelp,
	onOpen: onOpenHelp,
	onOpenChange: onOpenChangeHelp,
} = useDisclosure();

const {
	isOpen: isOpenReport,
	onOpen: onOpenReport,
	onOpenChange: onOpenChangeReport,
} = useDisclosure();

const SETTINGS = [
	{
		name: 'Preferences',
		icon: FaGear,
		isOpen: isOpenPreferences,
		onOpen: onOpenPreferences,
		onOpenChange: onOpenChangePreferences,
	},
	{
		name: 'Privacy',
		icon: FaShield,
		isOpen: isOpenPrivacy,
		onOpen: onOpenPrivacy,
		onOpenChange: onOpenChangePrivacy,
	},
	{
		name: 'Terms',
		icon: IoIosPaper,
		isOpen: isOpenTerms,
		onOpen: onOpenTerms,
		onOpenChange: onOpenChangeTerms,
	},
	{
		name: 'Conditions',
		icon: FiPaperclip,
		isOpen: isOpenConditions,
		onOpen: onOpenConditions,
		onOpenChange: onOpenChangeConditions,
	},
	{
		name: 'Safety',
		icon: FaLifeRing,
		isOpen: isOpenSafety,
		onOpen: onOpenSafety,
		onOpenChange: onOpenChangeSafety,
	},
	{
		name: 'Help',
		icon: FaQuestion,
		isOpen: isOpenHelp,
		onOpen: onOpenHelp,
		onOpenChange: onOpenChangeHelp,
	},
	{
		name: 'Report',
		icon: IoIosWarning,
		isOpen: isOpenReport,
		onOpen: onOpenReport,
		onOpenChange: onOpenChangeReport,
	},
];

export default SETTINGS;
