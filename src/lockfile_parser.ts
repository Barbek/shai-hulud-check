export class LockfileParser {

    private data: string;

    constructor(lockfileData: string) {
        this.data = lockfileData;
    }

    parse(): Map<string, string> {
        const lockfile = JSON.parse(this.data);
        const result = new Map<string, string>();

        if (lockfile.packages) {
            for (const [packagePath, packageInfo] of Object.entries(lockfile.packages)) {
                if (packagePath && packageInfo && typeof packageInfo === 'object') {
                    const version = (packageInfo as any).version;
                    if (version) {
                        // Remove leading node_modules/ or empty string for root
                        const packageName = packagePath.replace(/^node_modules\//, '') || lockfile.name;
                        if (packageName) {
                            result.set(packageName, version);
                        }
                    }
                }
            }
        }

        return result;
    }
}