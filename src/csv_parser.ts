export class CsvParser {

    private data: string;

    constructor(csvData: string) {
        this.data = csvData;
    }

    parse(): Map<string, string[]> {
        const lines = this.data.split('\n');
        const result = new Map<string, string[]>();
        for (const line of lines) {
            if (line.startsWith('Package') || line.trim() === '') continue;
            const [packageName, version] = line.split(',');
            if (packageName && version) {
                const versions = version.split('||').map(v => v.replace(/=/, '').trim());
                const trimmedPackageName = packageName.trim();
                const existingVersions = result.get(trimmedPackageName) || [];
                result.set(trimmedPackageName, [...existingVersions, ...versions]);
            }
        }
        return result;
    }
}
