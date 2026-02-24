import { ByteOrder } from '$lib/types';

export class BinaryWriter {
	private chunks: Uint8Array[] = [];

	constructor(public byteOrder: ByteOrder = ByteOrder.LittleEndian) {}

	writeByte(value: number): void {
		const buffer = new Uint8Array(1);
		buffer[0] = value & 0xff;
		this.chunks.push(buffer);
	}

	writeBytes(bytes: Uint8Array): void {
		this.chunks.push(bytes);
	}

	writeInt16(value: number): void {
		const buffer = new ArrayBuffer(2);
		const view = new DataView(buffer);
		view.setInt16(0, value, Boolean(this.byteOrder));
		this.chunks.push(new Uint8Array(buffer));
	}

	writeInt32(value: number): void {
		const buffer = new ArrayBuffer(4);
		const view = new DataView(buffer);
		view.setInt32(0, value, Boolean(this.byteOrder));
		this.chunks.push(new Uint8Array(buffer));
	}

	writeFloat32(value: number): void {
		const buffer = new ArrayBuffer(4);
		const view = new DataView(buffer);
		view.setFloat32(0, value, Boolean(this.byteOrder));
		this.chunks.push(new Uint8Array(buffer));
	}

	writeString(value: string): void {
		if (!value) {
			this.writeInt32(0);
			return;
		}

		// Check if needs Unicode
		let needsUnicode = false;
		for (let i = 0; i < value.length; i++) {
			if (value.charCodeAt(i) > 255) {
				needsUnicode = true;
				break;
			}
		}

		if (!needsUnicode) {
			// ASCII
			this.writeInt32(value.length + 1);
			const encoder = new TextEncoder();
			this.writeBytes(encoder.encode(value));
			this.writeByte(0);
		} else {
			// Unicode (UTF-16)
			this.writeInt32(-1 - value.length);

			// Convert to UTF-16
			const uint16 = new Uint16Array(value.length + 1);
			for (let i = 0; i < value.length; i++) {
				uint16[i] = value.charCodeAt(i);
			}
			uint16[value.length] = 0; // Null terminator

			// Handle endianness
			if (this.byteOrder === ByteOrder.BigEndian) {
				for (let i = 0; i < uint16.length; i++) {
					uint16[i] = ((uint16[i] & 0xff) << 8) | ((uint16[i] >> 8) & 0xff);
				}
			}

			this.writeBytes(new Uint8Array(uint16.buffer));
		}
	}

	toUint8Array(): Uint8Array {
		const totalLength = this.chunks.reduce((sum, chunk) => sum + chunk.length, 0);
		const result = new Uint8Array(totalLength);
		let offset = 0;
		for (const chunk of this.chunks) {
			result.set(chunk, offset);
			offset += chunk.length;
		}
		return result;
	}
}
