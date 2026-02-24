export enum ByteOrder {
	LittleEndian = 1,
	BigEndian = 0,
}

export enum Platform {
	PC = 'PC',
	PS3 = 'PS3',
	Xbox = 'X360',
	Unknown = 'unknown',
}

export enum VehicleType {
	RocketLauncher = 0,
	MachineGun = 1,
}

export const SAVE_VERSION_PC: number = 0x00000002;
export const SAVE_VERSION_PS3: number = 0x02000000;

export interface ChallengeDataEntry {
	id: number;
	typeId: number;
	value: number;
}

export interface DLCSection {
	id: number;
	rawData: Uint8Array;
	baseData?: Uint8Array;
}

export interface BankEntry {
	typeId: number;
	parts: string[];
	ammoOrQuantity: number;
	equipped: number;
	quality: number;
	level: number;
}
