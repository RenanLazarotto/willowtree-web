import type { BankEntry, DLCSection } from '$lib/types';

export class DLCData {
	readonly Section1Id: number = 0x43211234;
	readonly Section2Id: number = 0x02151984;
	readonly Section3Id: number = 0x32235947;
	readonly Section4Id: number = 0x234ba901;

	hasSection1: boolean = $state(false);
	hasSection2: boolean = $state(false);
	hasSection3: boolean = $state(false);
	hasSection4: boolean = $state(false);

	dataSections: DLCSection[] = [];
	dlcSize: number = $state(0);

	bankSize: number = $state(0);
	bankInventory: BankEntry[] = $state([]);

	// All of these values are boolean flags. If you set them to any value except
	// 0 the game will rewrite them as 1.
	dlcUnknown1: number = $state(0); // Probably CanAccessBank
	dlcUnknown2: number = $state(0);
	dlcUnknown3: number = $state(0);
	dlcUnknown4: number = $state(0);
	dlcUnknown5: number = $state(0); // Probably CanExceedLevel50. Removing this will de-level your character to 50

	skipDlc2Intro: number = $state(0);
	secondaryPackEnabled: number = $state(0);

	numberOfItems: number = $state(0);
	itemStrings: string[][] = $state([]);
	itemValues: number[][] = $state([]);

	numberOfWeapons: number = $state(0);
	weaponStrings: string[][] = $state([]);
	weaponValues: number[][] = $state([]);

	totalItems: number = $state(0);
	itemParts: string[][] = $state([]);
	itemQuantity: number[][] = $state([]);
	itemLevel: number[][] = $state([]);
	itemQuality: number[][] = $state([]);
	itemEquipped: number[][] = $state([]);

	totalWeapons: number = $state(0);
	weaponParts: string[][] = $state([]);
	weaponAmmo: number[][] = $state([]);
	weaponLevel: number[][] = $state([]);
	weaponQuality: number[][] = $state([]);
	weaponEquippedSlot: number[][] = $state([]);
}
