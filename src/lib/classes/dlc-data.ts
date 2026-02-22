import type { BankEntry, DLCSection } from '$lib/types';

export class DLCData {
	readonly Section1Id: number = 0x43211234;
	readonly Section2Id: number = 0x02151984;
	readonly Section3Id: number = 0x32235947;
	readonly Section4Id: number = 0x234ba901;

	hasSection1: boolean = false;
	hasSection2: boolean = false;
	hasSection3: boolean = false;
	hasSection4: boolean = false;

	dataSections: DLCSection[] = [];
	dlcSize: number = 0;

	bankSize: number = 0;
	bankInventory: BankEntry[] = [];

	// All of these values are boolean flags. If you set them to any value except
	// 0 the game will rewrite them as 1.
	dlcUnknown1: number = 0; // Probably CanAccessBank
	dlcUnknown2: number = 0;
	dlcUnknown3: number = 0;
	dlcUnknown4: number = 0;
	dlcUnknown5: number = 0; // Probably CanExceedLevel50. Removing this will de-level your character to 50

	skipDlc2Intro: number = 0;
	secondaryPackEnabled: number = 0;

	numberOfItems: number = 0;
	itemStrings: string[][] = [];
	itemValues: number[][] = [];

	numberOfWeapons: number = 0;
	weaponStrings: string[][] = [];
	weaponValues: number[][] = [];

	totalItems: number = 0;
	itemParts: string[][] = [];
	itemQuantity: number[] = [];
	itemLevel: number[] = [];
	itemQuality: number[] = [];
	itemEquipped: number[] = [];

	totalWeapons: number = 0;
	weaponParts: string[][] = [];
	weaponAmmo: number[] = [];
	weaponLevel: number[] = [];
	weaponQuality: number[] = [];
	weaponEquippedSlot: number[] = [];
}
