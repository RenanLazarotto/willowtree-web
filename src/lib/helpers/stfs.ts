export class STFS {
	static extractFromCON(conData: Uint8Array) {
		// TODO
	}

	static validateCON(data: Uint8Array): boolean {
		return new TextDecoder().decode(data.slice(0, 4)) === 'CON ';
	}
}
