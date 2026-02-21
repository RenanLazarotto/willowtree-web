import type { ByteOrder, ChallengeDataEntry, Platform, VehicleType } from "$lib/types";

export class WillowSaveGame {
    byteOrder: ByteOrder = 'little';
    platform: Platform = 'pc';
    openedWsg: string = '';
    containsRawData: boolean = false;

    // General info
    magicHeader: string = "";
    versionNumber: number = 0;
    plyr: string = "";
    revisionNumber: number = 0;
    class: string = "";
    level: number = 0;
    experience: number = 0;
    skillPoints: number = 0;
    unknown1: number = 0;
    cash: number = 0;
    finishedPlaythrough1: number = 0;

    // Skills
    NumberOfSkills: number = 0;
    skillNames: string[] = [];
    skillsLevels: number[] =[];
    skillsExperience: number[] = [];
    inUse: number[] = [];

    // Vehicle
    firstVehicleColor: string = "";
    firstVehicleType: VehicleType = 0;
    secondVehicleColor: string = "";
    secondVehicleType: VehicleType = 0;

    // Ammo
    numberOfPools: number = 0
    resourcePools: string[] = []
    ammoPools: string[] = []
    remainingPools: number[] = []
    poolLevels: number[] = []

    // Items
    numberOfItems: number = 0
    itemStrings: string[][] = []
    itemValues: number[][] = []

    // Backpack
    backpackSize: number = 0
    equipSlots: number = 0

    // Weapons
    numberOfWeapons: number = 0
    weaponStrings: string[][] = []
    weaponValues: number[][] = []

    // Challenges
    challengeDataBlockLength: number = 0
    challengeDataBlockId: number = 0
    challengeDataLength: number = 0 
    challengeDataEntries: number = 0
    challenges: ChallengeDataEntry[] = []
    challengeData: Uint8Array = new Uint8Array()

    // Location
    totalLocations: number = 0
    locationStrings: string[] = []
    currentLocation: string = ""

    // Save
    saveInfo1to5: number[] = [0,0,0,0,0]
    saveInfo7to10: number[] = [0,0,0,0]
    saveNumber: number = 0

    // Quest
    currentQuest: string = "None"
    totalPlaythrough1Quests: number = 0
    playthrough1Strings: string[] =[]
}   
