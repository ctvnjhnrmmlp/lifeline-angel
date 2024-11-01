import {
	FaLifeRing,
	FaQuestion,
} from '.pnpm/react-icons@5.3.0_react@19.0.0-rc-02c0e824-20241028/node_modules/react-icons/fa';
import {
	FaGear,
	FaShield,
} from '.pnpm/react-icons@5.3.0_react@19.0.0-rc-02c0e824-20241028/node_modules/react-icons/fa6';
import { FiPaperclip } from '.pnpm/react-icons@5.3.0_react@19.0.0-rc-02c0e824-20241028/node_modules/react-icons/fi';
import {
	IoIosPaper,
	IoIosWarning,
} from '.pnpm/react-icons@5.3.0_react@19.0.0-rc-02c0e824-20241028/node_modules/react-icons/io';
import { useDisclosure } from '@nextui-org/react';

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
