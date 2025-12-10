import { CsvParser } from './csv_parser';
import { LockfileParser } from './lockfile_parser';

export class Checker {
    
    private csvParser: CsvParser;
    private lockfileParser: LockfileParser;
    
    constructor(csvData: string, lockfileData: string) {
        this.csvParser = new CsvParser(csvData);
        this.lockfileParser = new LockfileParser(lockfileData);
    }

    check() {
        const csvRecords = this.csvParser.parse();
        const lockfileRecords = this.lockfileParser.parse();

        const matches: Array<{package: string, csvVersion: string, lockfileVersion: string}> = [];
        const mismatches: Array<{package: string, csvVersion: string, lockfileVersion: string}> = [];
        const nearlyMatches: Array<{package: string, csvVersion: string, lockfileVersion: string}> = [];

        for (const [packageName, lockfileVersion] of lockfileRecords) {
            const csvVersions = csvRecords.get(packageName);

            if (csvVersions) {
                if (csvVersions.includes(lockfileVersion)) {
                    matches.push({
                        package: packageName,
                        csvVersion: csvVersions.join(' || '),
                        lockfileVersion: lockfileVersion
                    });
                    continue;
                } else {
                    nearlyMatches.push({
                        package: packageName,
                        csvVersion: csvVersions.join(' || '),
                        lockfileVersion: lockfileVersion
                    });
                    continue;
                }
            }
            mismatches.push({
                package: packageName,
                csvVersion: 'N/A',
                lockfileVersion: lockfileVersion
            });
        }

        return { matches, nearlyMatches, mismatches };
    }
}