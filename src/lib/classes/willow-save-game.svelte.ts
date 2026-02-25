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
	private readonly decoder: TextDecoder = new TextDecoder('ascii');
	data: Uint8Array = $state(new Uint8Array());
	binaryReader: BinaryReader = $state(new BinaryReader(this.data));

	byteOrder: ByteOrder = $state(ByteOrder.LittleEndian);
	platform: Platform = $state(Platform.Unknown);
	openedWsg: string = $state('');
	containsRawData: boolean = $state(false);

	// General info
	magicHeader: string = $state('');
	versionNumber: number = $state(0);
	plyr: string = $state('');
	revisionNumber: number = $state(0);
	class: string = $state('');
	level: number = $state(0);
	experience: number = $state(0);
	skillPoints: number = $state(0);
	unknown1: number = $state(0);
	cash: number = $state(0);
	finishedPlaythrough1: number = $state(0);

	// Skills
	numberOfSkills: number = $state(0);
	skillNames: string[] = $state([]);
	skillsLevels: number[] = $state([]);
	skillsExperience: number[] = $state([]);
	inUse: number[] = $state([]);

	// Vehicle
	firstVehicleColor: number = $state(0);
	firstVehicleType: VehicleType = $state(0);
	secondVehicleColor: number = $state(0);
	secondVehicleType: VehicleType = $state(0);

	// Ammo
	numberOfPools: number = $state(0);
	resourcePools: string[] = $state([]);
	ammoPools: string[] = $state([]);
	remainingPools: number[] = $state([]);
	poolLevels: number[] = $state([]);

	// Items
	numberOfItems: number = $state(0);
	itemStrings: string[][] = $state([]);
	itemValues: number[][] = $state([]);

	// Backpack
	backpackSize: number = $state(0);
	equipSlots: number = $state(0);

	// Weapons
	numberOfWeapons: number = $state(0);
	weaponStrings: string[][] = $state([]);
	weaponValues: number[][] = $state([]);

	// Challenges
	challengeDataBlockLength: number = $state(0);
	challengeDataBlockId: number = $state(0);
	challengeDataLength: number = $state(0);
	challengeDataEntries: number = $state(0);
	challenges: ChallengeDataEntry[] = $state([]);
	challengeData: Uint8Array = $state(new Uint8Array());

	// Location
	totalLocations: number = $state(0);
	locationStrings: string[] = $state([]);
	currentLocation: string = $state('');

	// Save
	saveInfo1to5: number[] = $state([0, 0, 0, 0, 0]);
	saveInfo7to10: number[] = $state([0, 0, 0, 0]);
	saveNumber: number = $state(0);

	// Quests / Playthroughs
	currentQuest: string = $state('None');
	totalPlaythrough1Quests: number = $state(0);
	playthrough1Strings: string[] = $state([]);
	playthrough1Values: number[] = $state([]);
	playthrough1Subfolders: string[] = $state([]);
	unknownPlaythrough1QuestValue: number = $state(0);

	// Second
	secondaryQuest: string = $state('None');
	totalPlaythrough2Quests: number = $state(0);
	playthrough2Strings: string[] = $state([]);
	playthrough2Values: number[] = $state([]);
	playthrough2Subfolders: string[] = $state([]);
	unknownPlaythrough2QuestValue: number = $state(0);

	// Playtime
	totalPlaytime: number = $state(0);
	lastPlayedDate: string = $state('');

	// Character
	characterName: string = $state('');
	color1: number = $state(0);
	color2: number = $state(0);
	color3: number = $state(0);
	unknown2: number = $state(0);

	// Promo codes
	promoCodesUsed: number[] = $state([]);
	PromoCodesRequiringNotification: string[] = $state([]);

	// Echo
	numberOfEchoLists: number = $state(0);
	echoIndex0: number = $state(0);
	numberOfEchos: number = $state(0);
	echoStrings: string[] = $state([]);
	echoValues: number[] = $state([]);
	echoIndex1: number = $state(0);
	numberOfEchosPlaythrough2: number = $state(0);
	echoStringsPlaythrough2: string[] = $state([]);
	echoValuesPlaythrough2: number[] = $state([]);

	// Temporary lists used for primary pack data when the inventory is split
	ItemStrings1: string[][] = $state([]);
	ItemStrings2: string[][] = $state([]);
	ItemValues1: number[][] = $state([]);
	ItemValues2: number[][] = $state([]);
	WeaponStrings1: string[][] = $state([]);
	WeaponStrings2: string[][] = $state([]);
	WeaponValues1: number[][] = $state([]);
	WeaponValues2: number[][] = $state([]);

	// DLC
	dlcData: DLCData = $state(new DLCData());

	// Xbox-only
	profileID: number = $state(0);
	deviceID: Uint8Array = new Uint8Array();
	conImage: Uint8Array = new Uint8Array();
	titleDisplay: string = $state('');
	titlePackage: string = $state('');
	titleID: number = 1414793191;

	async openSave(save: File | Uint8Array): Promise<void> {
		this.platform = await PlatformDetector.detect(save);
		let data: Uint8Array;
		if (save instanceof File) {
			this.openedWsg = save.name;
			data = new Uint8Array(await save.arrayBuffer());
		} else {
			data = save;
			this.openedWsg = 'memory';
		}
		this.data = data;
		this.binaryReader = new BinaryReader(this.data);
		this.readSave();
	}

	readSave(): void {
		this.magicHeader = this.decoder.decode(this.binaryReader.readBytes(3));

		const version = this.binaryReader.readInt32();

		if (version == SAVE_VERSION_PC) {
			this.byteOrder = ByteOrder.LittleEndian;
			this.versionNumber = 2;
		} else if (version == SAVE_VERSION_PS3) {
			this.byteOrder = ByteOrder.BigEndian;
			this.versionNumber = 2;
		} else {
			throw new Error(`unknown version: ${version}`);
		}

		this.plyr = this.decoder.decode(this.binaryReader.readBytes(4));
		if (this.plyr !== 'PLYR') {
			throw new Error('Invalid PLYR header');
		}
		this.revisionNumber = this.binaryReader.readInt32();
		this.class = this.binaryReader.readString();
		this.level = this.binaryReader.readInt32();
		this.experience = this.binaryReader.readInt32();
		this.skillPoints = this.binaryReader.readInt32();
		this.unknown1 = this.binaryReader.readInt32();
		this.cash = this.binaryReader.readInt32();
		this.finishedPlaythrough1 = this.binaryReader.readInt32();
		this.numberOfSkills = this.binaryReader.readInt32();

		this.readSkills();

		this.firstVehicleColor = this.binaryReader.readInt32();
		this.secondVehicleColor = this.binaryReader.readInt32();
		this.firstVehicleType = this.binaryReader.readInt32();
		this.secondVehicleType = this.binaryReader.readInt32();

		this.numberOfPools = this.binaryReader.readInt32();
	}

	private readSkills(): void {
		this.skillNames = [];
		this.skillsLevels = [];
		this.skillsExperience = [];
		this.inUse = [];

		for (let i = 0; i < this.numberOfSkills; i++) {
			this.skillNames.push(this.binaryReader.readString());
			this.skillsLevels.push(this.binaryReader.readInt32());
			this.skillsExperience.push(this.binaryReader.readInt32());
			this.inUse.push(this.binaryReader.readInt32());
		}
	}
}
