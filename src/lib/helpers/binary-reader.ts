import { ByteOrder } from '$lib/types';

export class BinaryReader {
	private view: DataView;
	private offset: number = 0;

	constructor(
		private data: Uint8Array,
		private endianness: ByteOrder = ByteOrder.LittleEndian
	) {
		this.view = new DataView(data.buffer, data.byteOffset, data.byteLength);
	}

	readBytes(length: number): Uint8Array {
		const result = this.data.slice(this.offset, this.offset + length);
		this.offset += length;
		return result;
	}

	readInt32(): number {
		const value = this.view.getInt32(this.offset, Boolean(this.endianness));
		this.offset += 4;
		return value;
	}

	readInt16(): number {
		const value = this.view.getInt16(this.offset, Boolean(this.endianness));
		this.offset += 2;
		return value;
	}

	readByte(): number {
		const value = this.view.getUint8(this.offset);
		this.offset += 1;
		return value;
	}

	readString(): string {
		const length = this.readInt32();

		if (length === 0) return '';

		if (length < 0) {
			// Unicode string (UTF-16)
			const byteLength = -length * 2;
			const bytes = this.readBytes(byteLength);

			// Convert UTF-16 to string
			const uint16 = new Uint16Array(bytes.buffer, bytes.byteOffset, byteLength / 2);
			if (this.endianness === ByteOrder.BigEndian) {
				// Swap bytes if needed
				for (let i = 0; i < uint16.length; i++) {
					uint16[i] = ((uint16[i] & 0xff) << 8) | ((uint16[i] >> 8) & 0xff);
				}
			}
			return String.fromCharCode(...uint16).split('\0')[0];
		} else {
			// ASCII string
			const bytes = this.readBytes(length);
			const decoder = new TextDecoder('windows-1252');
			return decoder.decode(bytes).split('\0')[0];
		}
	}
	seek(position: number): void {
		this.offset = position;
	}

	tell(): number {
		return this.offset;
	}
}
