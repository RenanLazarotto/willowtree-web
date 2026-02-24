import { ByteOrder } from '$lib/types';

export class BinaryReader {
	private view: DataView;
	private textDecoder: TextDecoder = new TextDecoder('ascii');

	constructor(private data: Uint8Array) {
		this.view = new DataView(data.buffer, data.byteOffset, data.byteLength);
	}

	getBytes(offset: number, length: number): Uint8Array {
		return this.data.slice(offset, offset + length);
	}

	getUint8(offset: number): number {
		return this.view.getUint8(offset);
	}

	getUint16(offset: number, byteOrder: ByteOrder): number {
		return this.view.getUint16(offset, Boolean(byteOrder));
	}

	getUint24(offset: number, byteOrder: ByteOrder): number {
		return this.view.getUint16(offset, Boolean(byteOrder)) | (this.view.getUint8(offset + 2) << 16);
	}

	getUInt32(offset: number, byteOrder: ByteOrder): number {
		return this.view.getUint32(offset, Boolean(byteOrder));
	}

	getUint64(offset: number, byteOrder: ByteOrder): bigint {
		const high = BigInt(this.view.getUint32(offset, Boolean(byteOrder)));
		const low = BigInt(this.view.getUint32(offset + 4, Boolean(byteOrder)));
		return (high << 32n) | low;
	}

	getString(offset: number, length: number): string {
		return this.textDecoder.decode(this.getBytes(offset, length));
	}
}
