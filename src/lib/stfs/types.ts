export enum STFSMagic {
	CON = 'CON ',
	PIRS = 'PIRS',
	LIVE = 'LIVE',
}

export enum ContentType {
	SavedGame = 0x00020000,
	MarketplaceContent = 0x00040000,
	Publisher = 0x00050000,
	Xbox360Title = 0x00070000,
	Xbox360TitleDemo = 0x00080000,
	ArcadeTitle = 0x00090000,
	CommunityGame = 0x000a0000,
	Video = 0x000b0000,
	TV = 0x000c0000,
	AvatarItem = 0x000e0000,
	Profile = 0x000f0000,
	GamerPicture = 0x00100000,
	Theme = 0x00110000,
	Cache = 0x00120000,
	StorageDownload = 0x00130000,
	XboxSavedGame = 0x00150000,
	XboxDownload = 0x00160000,
	GameDemo = 0x00170000,
	VideoDownload = 0x00180000,
	GameTrailer = 0x00190000,
	ArcadeDownload = 0x001a0000,
	GameDownload = 0x001b0000,
	XboxOriginalGame = 0x001c0000,
	XboxOriginalDemo = 0x001d0000,
	PodcastVideo = 0x001e0000,
	InstalledGame = 0x00200000,
	InstalledGameDemux = 0x00210000,
	SystemOblivious = 0x00220000,
	OnDemandGame = 0x00230000,
	OnDemandGameDemux = 0x00240000,
	Xbox360Software = 0x00250000,
	Xbox360SoftwareDemux = 0x00260000,
	IndieGame = 0x00300000,
	IndieGameDemux = 0x00310000,
}

export interface STFSHeader {
	magic: string;
	consoleId?: Uint8Array;
	consolePartNumber?: Uint8Array;
	consoleType?: number;
	certificateDate?: Uint8Array;
	certificateBlob: Uint8Array;
	licenseEntries?: Uint8Array;

	/** Header SHA1 hash */
	contentId: Uint8Array;
	entryId: number;
	contentType: number;
	metadataVersion: number;
	contentSize: bigint;
	mediaId: number;
	version: number;
	baseVersion: number;
	titleId: number;
	platform: number;
	executableType: number;
	discNumber: number;
	discInSet: number;
	saveGameId: number;
	profileId: Uint8Array;

	volumeDescriptorSize: number;
	blockSeperation: number;
	filetableBlockcount: number;
	filetableBlocknumber: number;
	tophashtableHash: Uint8Array;
	allocatedCount: number;
	unallocatedCount: number;
	datafileCount: number;
	datafileSize: bigint;
	deviceId: Uint8Array;

	displayName: string;
	displayNameBlob: string;
	displayDescription: string;
	displayDescriptionBlob: string;
	publisherName: string;
	titleName: string;
	transferFlags: Uint8Array;
	thumbnailSize: number;
	titleimageSize: number;
	thumbnail: Uint8Array;
	titleimage: Uint8Array;

	seriesId?: Uint8Array;
	seasonId?: Uint8Array;
	seasonNumber?: number;
	episodeNumber?: number;
	additionalDisplayNames?: string;
	additionalDisplayDescriptions?: string;

	// Calculado
	tableSizeShift: number;
}

export enum STFSHashInfo {
	Unused = 0x00,
	Freed = 0x40,
	Old = 0x80,
	Current = 0xc0,
}

export interface BlockHashRecord {
	blockNum: number;
	hash: Uint8Array;
	info: number;
	nextBlock: number;
	table?: number;
	record?: number;
}

export interface TableSpacing {
	level1: number;
	level2: number;
	level3: number;
}
