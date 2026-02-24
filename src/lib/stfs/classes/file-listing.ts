export class FileListing {
	filename: string = '';
	isDirectory: boolean = false;
	numBlocks: number = 0;
	firstBlock: number = 0;
	pathIndex: number = 0;
	size: number = 0;
	udate: number = 0;
	utime: number = 0;
	adate: number = 0;
	atime: number = 0;

	constructor(data: Uint8Array) {
		const decoder = new TextDecoder('ascii');

		this.filename = decoder.decode(data.slice(0, 0x28)).replace(/\0/g, '');
		if (!this.filename) {
			throw new Error('FileListing has empty filename');
		}

		let view: DataView = new DataView(data.buffer);

		this.isDirectory = (0x80 & view.getUint8(0x28)) === 0x80;
		this.numBlocks = view.getUint32(0x29, true) & 0xffffff;
		this.firstBlock = view.getUint32(0x2f, true) & 0xffffff;
		this.pathIndex = view.getInt16(0x32, false);
		this.size = view.getUint32(0x34, false);
		this.udate = view.getUint16(0x38, false);
		this.utime = view.getUint16(0x3a, false);
		this.adate = view.getUint16(0x3c, false);
		this.atime = view.getUint16(0x3e, false);
	}
}
