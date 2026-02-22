import { Platform, SAVE_VERSION_PC, SAVE_VERSION_PS3 } from '$lib/types';

const decoder: TextDecoder = new TextDecoder();

export class PlatformDetector {
	static async detect(file: File | Uint8Array): Promise<Platform> {
		const data = file instanceof File ? new Uint8Array(await file.slice(0, 53247).arrayBuffer()) : file;

		if (this.isXbox360(data)) return Platform.Xbox;
		if (this.isPC(data)) return Platform.PC;
		if (this.isPS3(data)) return Platform.PS3;
		return Platform.Unknown;
	}

	private static isXbox360(data: Uint8Array): boolean {
		return decoder.decode(data.slice(0, 4)) === 'CON ';
	}

	private static isPC(data: Uint8Array): boolean {
		if (decoder.decode(data.slice(0, 3)) != 'WSG') {
			return false;
		}

		return new DataView(data.buffer, 3, 4).getInt32(0, true) === SAVE_VERSION_PC;
	}

	private static isPS3(data: Uint8Array): boolean {
		if (decoder.decode(data.slice(0, 3)) != 'WSG') {
			return false;
		}

		return new DataView(data.buffer, 3, 4).getInt32(0, true) === SAVE_VERSION_PS3;
	}
}
