import { BinaryReader } from '$lib/helpers/binary-reader';
import { PlatformDetector } from '$lib/helpers/platform-detector';
import {
	ByteOrder,
	Platform,
	SAVE_VERSION_PC,
	SAVE_VERSION_PS3,
	type ChallengeDataEntry,
	type VehicleType,
} from '$lib/types';
import { DLCData } from './dlc-data';

export class WillowSaveGame {
	private readonly decoder: TextDecoder = new TextDecoder();
	data: Uint8Array = new Uint8Array();
	binaryReader: BinaryReader = new BinaryReader(new Uint8Array());

	byteOrder: ByteOrder = ByteOrder.LittleEndian;
	platform: Platform = Platform.Unknown;
	openedWsg: string = '';
	containsRawData: boolean = false;

	// General info
	magicHeader: string = '';
	versionNumber: number = 0;
	plyr: string = '';
	revisionNumber: number = 0;
	class: string = '';
	level: number = 0;
	experience: number = 0;
	skillPoints: number = 0;
	unknown1: number = 0;
	cash: number = 0;
	finishedPlaythrough1: number = 0;

	// Skills
	NumberOfSkills: number = 0;
	skillNames: string[] = [];
	skillsLevels: number[] = [];
	skillsExperience: number[] = [];
	inUse: number[] = [];

	// Vehicle
	firstVehicleColor: string = '';
	firstVehicleType: VehicleType = 0;
	secondVehicleColor: string = '';
	secondVehicleType: VehicleType = 0;

	// Ammo
	numberOfPools: number = 0;
	resourcePools: string[] = [];
	ammoPools: string[] = [];
	remainingPools: number[] = [];
	poolLevels: number[] = [];

	// Items
	numberOfItems: number = 0;
	itemStrings: string[][] = [];
	itemValues: number[][] = [];

	// Backpack
	backpackSize: number = 0;
	equipSlots: number = 0;

	// Weapons
	numberOfWeapons: number = 0;
	weaponStrings: string[][] = [];
	weaponValues: number[][] = [];

	// Challenges
	challengeDataBlockLength: number = 0;
	challengeDataBlockId: number = 0;
	challengeDataLength: number = 0;
	challengeDataEntries: number = 0;
	challenges: ChallengeDataEntry[] = [];
	challengeData: Uint8Array = new Uint8Array();

	// Location
	totalLocations: number = 0;
	locationStrings: string[] = [];
	currentLocation: string = '';

	// Save
	saveInfo1to5: number[] = [0, 0, 0, 0, 0];
	saveInfo7to10: number[] = [0, 0, 0, 0];
	saveNumber: number = 0;

	// Quests / Playthroughs
	currentQuest: string = 'None';
	totalPlaythrough1Quests: number = 0;
	playthrough1Strings: string[] = [];
	playthrough1Values: number[] = [];
	playthrough1Subfolders: string[] = [];
	unknownPlaythrough1QuestValue: number = 0;

	// Second
	secondaryQuest: string = 'None';
	totalPlaythrough2Quests: number = 0;
	playthrough2Strings: string[] = [];
	playthrough2Values: number[] = [];
	playthrough2Subfolders: string[] = [];
	unknownPlaythrough2QuestValue: number = 0;

	// Playtime
	totalPlaytime: number = 0;
	lastPlayedDate: string = '';

	// Character
	characterName: string = '';
	color1: number = 0;
	color2: number = 0;
	color3: number = 0;
	unknown2: number = 0;

	// Promo codes
	promoCodesUsed: number[] = [];
	PromoCodesRequiringNotification: string[] = [];

	// Echo
	numberOfEchoLists: number = 0;
	echoIndex0: number = 0;
	numberOfEchos: number = 0;
	echoStrings: string[] = [];
	echoValues: number[] = [];
	echoIndex1: number = 0;
	numberOfEchosPlaythrough2: number = 0;
	echoStringsPlaythrough2: string[] = [];
	echoValuesPlaythrough2: number[] = [];

	// Temporary lists used for primary pack data when the inventory is split
	ItemStrings1: string[][] = [];
	ItemStrings2: string[][] = [];
	ItemValues1: number[][] = [];
	ItemValues2: number[][] = [];
	WeaponStrings1: string[][] = [];
	WeaponStrings2: string[][] = [];
	WeaponValues1: number[][] = [];
	WeaponValues2: number[][] = [];

	// DLC
	dlcData: DLCData = new DLCData();

	// Xbox-only
	profileID: number = 0;
	deviceID: Uint8Array = new Uint8Array();
	conImage: Uint8Array = new Uint8Array();
	titleDisplay: string = '';
	titlePackage: string = '';
	titleID: number = 1414793191;

	async openSave(save: File | Uint8Array): Promise<void> {
		this.platform = await PlatformDetector.detect(save);

		let data: Uint8Array;
		if (save instanceof File) {
			this.openedWsg = save.name;
			data = new Uint8Array(await save.arrayBuffer());

			// TODO: extract from STFS
		} else {
			data = save;
			this.openedWsg = 'memory';
		}
		this.data = data;
		this.binaryReader = new BinaryReader(this.data);

		this.readSave();
	}

	readSave(): void {
		this.magicHeader = this.decoder.decode(this.binaryReader.getBytes(0, 3));

		const version = this.binaryReader.getUInt32(3, ByteOrder.LittleEndian);

		if (version == SAVE_VERSION_PC) {
			this.byteOrder = ByteOrder.LittleEndian;
			this.versionNumber = 2;
		} else if (version == SAVE_VERSION_PS3) {
			this.byteOrder = ByteOrder.BigEndian;
			this.versionNumber = 2;
		} else {
			throw new Error(`unknown version: ${version}`);
		}

		this.plyr = this.decoder.decode(this.binaryReader.getBytes(3, 4));
		if (this.plyr !== 'PLYR') {
			throw new Error('Invalid PLYR header');
		}
	}
}
