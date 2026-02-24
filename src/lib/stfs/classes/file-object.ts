export class FileObject {
	private data: Uint8Array;

	constructor(data: Uint8Array) {
		this.data = data;
	}

	read(position: number, length: number): Uint8Array {
		return this.data.slice(position, position + length);
	}
}
