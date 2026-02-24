import { BinaryReader } from '$lib/helpers/binary-reader';
import { ByteOrder } from '$lib/types';
import { STFSMagic, type BlockHashRecord, type STFSHeader, type TableSpacing } from '../types';
import { FileListing } from './file-listing';

export class STFSParser {
	private binaryReader: BinaryReader;
	private magic: string;

	private readonly FILETABLE_OFFSET = 0x37a;

	private readonly spacing: TableSpacing[] = [
		{ level1: 0xab, level2: 0x718f, level3: 0xfe7da },
		{ level1: 0xac, level2: 0x723a, level3: 0xfd00b },
	];

	constructor(private data: Uint8Array) {
		if (data.length >= 0x971a) {
			throw new Error('STFS data too short');
		}

		this.data = data;
		this.binaryReader = new BinaryReader(this.data);

		const magic = this.binaryReader.getString(0, 4);
		if (!Object.values(STFSMagic).includes(magic as STFSMagic)) {
			throw new Error(`STFS Magic not found: ${magic}`);
		}

		this.magic = magic;
	}

	parseHeader(): STFSHeader {
		let magic = this.magic;
		const header: Partial<STFSHeader> = {
			magic,
			certificateBlob: new Uint8Array(),
		};

		if (magic === STFSMagic.CON) {
			header.consoleId = this.binaryReader.getBytes(0x6, 5);
			header.consolePartNumber = this.binaryReader.getBytes(0xb, 9);
			header.consoleType = this.binaryReader.getUint8(0x1f);
			header.certificateDate = this.binaryReader.getBytes(0x20, 8);
			header.certificateBlob = this.binaryReader.getBytes(0x28, 0x1ac + 0x80);
		} else {
			header.certificateBlob = this.binaryReader.getBytes(0x4, 0x100);
		}

		header.licenseEntries = this.binaryReader.getBytes(0x22c, 0x100);
		header.contentId = this.binaryReader.getBytes(0x32c, 0x14);

		header.entryId = this.binaryReader.getUInt32(0x340, ByteOrder.BigEndian);
		header.contentType = this.binaryReader.getUInt32(0x344, ByteOrder.BigEndian);
		header.metadataVersion = this.binaryReader.getUInt32(0x348, ByteOrder.BigEndian);
		header.contentSize = this.binaryReader.getUint64(0x34c, ByteOrder.BigEndian);
		header.mediaId = this.binaryReader.getUInt32(0x354, ByteOrder.BigEndian);
		header.version = this.binaryReader.getUInt32(0x358, ByteOrder.BigEndian);
		header.baseVersion = this.binaryReader.getUInt32(0x35c, ByteOrder.BigEndian);
		header.titleId = this.binaryReader.getUInt32(0x360, ByteOrder.BigEndian);

		header.platform = this.binaryReader.getUint8(0x364);
		header.executableType = this.binaryReader.getUint8(0x365);
		header.discNumber = this.binaryReader.getUint8(0x366);
		header.discInSet = this.binaryReader.getUint8(0x367);
		header.saveGameId = this.binaryReader.getUInt32(0x368, ByteOrder.BigEndian);

		if (magic !== STFSMagic.CON) {
			header.consoleId = this.binaryReader.getBytes(0x36c, 5);
		}
		header.profileId = this.binaryReader.getBytes(0x371, 5);

		header.volumeDescriptorSize = this.binaryReader.getUint8(0x379);
		header.blockSeperation = this.binaryReader.getUint8(0x37b);
		header.filetableBlockcount = this.binaryReader.getUint16(this.FILETABLE_OFFSET + 2, ByteOrder.LittleEndian);
		header.filetableBlocknumber = this.binaryReader.getUint24(this.FILETABLE_OFFSET + 4, ByteOrder.LittleEndian);
		header.tophashtableHash = this.binaryReader.getBytes(this.FILETABLE_OFFSET + 7, 0x14);
		header.allocatedCount = this.binaryReader.getUInt32(this.FILETABLE_OFFSET + 0x1b, ByteOrder.BigEndian);
		header.unallocatedCount = this.binaryReader.getUInt32(this.FILETABLE_OFFSET + 0x1f, ByteOrder.BigEndian);
		header.datafileCount = this.binaryReader.getUInt32(0x39d, ByteOrder.BigEndian);
		header.datafileSize = this.binaryReader.getUint64(0x3a1, ByteOrder.BigEndian);

		header.deviceId = this.binaryReader.getBytes(0x3fd, 0x14);

		header.displayName = this.binaryReader.getString(0x411, 0x80);
		header.displayNameBlob = this.binaryReader.getString(0x411, 0x900);
		header.displayDescription = this.binaryReader.getString(0xd11, 0x80);
		header.displayDescriptionBlob = this.binaryReader.getString(0xd11, 0x900);
		header.publisherName = this.binaryReader.getString(0x1611, 0x80);
		header.titleName = this.binaryReader.getString(0x1691, 0x80);

		header.transferFlags = this.binaryReader.getBytes(0x1711, 1);
		header.thumbnailSize = this.binaryReader.getUInt32(0x1712, ByteOrder.BigEndian);
		header.titleimageSize = this.binaryReader.getUInt32(0x1716, ByteOrder.BigEndian);

		if (header.thumbnailSize > 0) {
			header.thumbnail = this.binaryReader.getBytes(0x171a, header.thumbnailSize);
		}

		if (header.titleimageSize > 0) {
			header.titleimage = this.binaryReader.getBytes(0x571a, header.titleimageSize);
		}

		if (header.metadataVersion === 2) {
			header.seriesId = this.binaryReader.getBytes(0x3b1, 0x10);
			header.seasonId = this.binaryReader.getBytes(0x3c1, 0x10);
			header.seasonNumber = this.binaryReader.getUint16(0x3d1, ByteOrder.BigEndian);
			header.episodeNumber = this.binaryReader.getUint16(0x3d3, ByteOrder.BigEndian);
			header.additionalDisplayNames = this.binaryReader.getString(0x541a, 0x300);
			header.additionalDisplayDescriptions = this.binaryReader.getString(0x941a, 0x300);
		}

		header.tableSizeShift = this.calculateTableSizeShift(header.entryId);

		return header as STFSHeader;
	}

	parseFileTable(header: STFSHeader): FileListing[] {
		const filelistings: FileListing[] = [];
		const filetableData = this.readFileTable(
			header.filetableBlocknumber,
			header.filetableBlockcount,
			header.tableSizeShift
		);

		for (let i = 0; i < filetableData.length; i += 0x40) {
			try {
				const listing = new FileListing(filetableData.slice(i, i + 0x40));
				filelistings.push(listing);
			} catch (e) {
				continue;
			}
		}

		return filelistings;
	}

	readFile(fileListing: FileListing, header: STFSHeader): Uint8Array {
		const chunks: Uint8Array[] = [];
		let remaining = fileListing.size;
		let block = fileListing.firstBlock;
		let info = 0x80;

		while (remaining > 0 && block > 0 && block < header.allocatedCount && info >= 0x80) {
			const readLen = Math.min(0x1000, remaining);
			chunks.push(this.readBlock(this.fixBlockNumber(block, header.tableSizeShift), readLen));
			remaining -= readLen;

			let blockHash = this.getBlockHash(block, header);
			if (header.tableSizeShift > 0 && blockHash.info < 0x80) {
				blockHash = this.getBlockHash(block, header, 1);
			}

			block = blockHash.nextBlock;
			info = blockHash.info;
		}

		return this.mergeChunks(chunks);
	}

	private getBlockHash(blockNum: number, header: STFSHeader, tableOffset: number = 0): BlockHashRecord {
		const record = blockNum % 0xaa;
		const spacing = this.spacing[header.tableSizeShift];
		let tableNum = Math.floor(blockNum / 0xaa) * spacing.level1;

		if (blockNum >= 0xaa) {
			tableNum += (Math.floor(blockNum / 0x70e4) + 1) << header.tableSizeShift;
			if (blockNum >= 0x70e4) {
				tableNum += 1 << header.tableSizeShift;
			}
		}

		tableNum += tableOffset - (1 << header.tableSizeShift);

		const hashData = this.readBlock(tableNum, 0x1000);
		const recordOffset = record * 0x18;

		const response: BlockHashRecord = {
			blockNum: blockNum,
			hash: hashData.slice(recordOffset, recordOffset + 0x14),
			info: hashData[recordOffset + 0x14],
			nextBlock:
				(hashData[recordOffset + 0x15] << 16) | (hashData[recordOffset + 0x16] << 8) | hashData[recordOffset + 0x17],
			record,
			table: tableNum,
		};

		return response;
	}

	private readFileTable(firstBlock: number, numBlocks: number, tableSizeShift: number): Uint8Array {
		const chunks: Uint8Array[] = [];
		let block = firstBlock;

		for (let i = 0; i < numBlocks; i++) {
			chunks.push(this.readBlock(this.fixBlockNumber(block, tableSizeShift), 0x1000));

			let blockHash = this.getBlockHash(block, { tableSizeShift } as STFSHeader);
			if (tableSizeShift > 0 && blockHash.info < 0x80) {
				blockHash = this.getBlockHash(block, { tableSizeShift } as STFSHeader, 1);
			}

			block = blockHash.nextBlock;
		}

		return this.mergeChunks(chunks);
	}

	private fixBlockNumber(blockNum: number, tableSizeShift: number): number {
		let blockAdjust = 0;

		if (blockNum >= 0xaa) {
			blockAdjust += (Math.floor(blockNum / 0xaa) + 1) << tableSizeShift;
		}
		if (blockNum >= 0x70e4) {
			blockAdjust += (Math.floor(blockNum / 0x70e4) + 1) << tableSizeShift;
		}

		return blockAdjust + blockNum;
	}

	private readBlock(blocknum: number, length: number = 0x1000): Uint8Array {
		const position = 0xc000 + blocknum * 0x1000;
		return this.data.slice(position, position + length);
	}

	private calculateTableSizeShift(entryId: number): number {
		if (((entryId + 0xfff) & 0xf000) >> 0xc === 0xb) {
			return 0;
		}
		return 1;
	}

	private mergeChunks(arrays: Uint8Array[]): Uint8Array {
		const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
		const result = new Uint8Array(totalLength);
		let offset = 0;
		for (const arr of arrays) {
			result.set(arr, offset);
			offset += arr.length;
		}
		return result;
	}
}
