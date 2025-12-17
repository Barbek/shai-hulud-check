import { Command } from 'commander';
import { Checker } from './checker';
import fs from "fs";

const CSV_URL = process.env.CSV_URL || 'https://raw.githubusercontent.com/wiz-sec-public/wiz-research-iocs/refs/heads/main/reports/shai-hulud-2-packages.csv';
const LOG_FILE = process.env.LOG_FILE || 'shai-hulud-log.log';

function logMessage(message: string, logStream: fs.WriteStream | null) {
    console.log(message);
    if (logStream) {
        logStream.write(message + '\n');
    }
}

const program = new Command();

program
    .name('shai-hulud-check')
    .description('Check package-lock.json for compromised packages')
    .argument('<file>', 'path to package-lock.json file')
    .option('-l, --log [file]', 'enable logging to file (optional, can also set by environment variable LOG_FILE)', false)
    .action((file: string, options: { log?: string | boolean }) => {
        if (!file.endsWith('package-lock.json')) {
            console.error('Error: File must be a package-lock.json');
            process.exit(1);
        }
        const fileContent = fs.readFileSync(file, 'utf-8');
        fetch(CSV_URL)
            .then(response => response.text())
            .then(csvData => {
            const checker = new Checker(csvData, fileContent);
            const { matches, nearlyMatches, mismatches } = checker.check();

            let logStream: fs.WriteStream | null = null;
            if (options.log) {
                const logFile = typeof options.log === 'string' ? options.log : LOG_FILE;
                logStream = fs.createWriteStream(logFile, { flags: 'a' });
                const timestamp = new Date().toISOString();
                logStream.write(`\n=== Check run at ${timestamp} ===\n`);
            }

            mismatches.forEach(m => {
                logMessage(`✅: Package ${m.package} - CSV Version: ${m.csvVersion}, Lockfile Version: ${m.lockfileVersion}`, logStream);
            });
            nearlyMatches.forEach(m => {
                logMessage(`⚠️: Package ${m.package} - CSV Version: ${m.csvVersion}, Lockfile Version: ${m.lockfileVersion}`, logStream);
            });
            matches.forEach(m => {
                logMessage(`❌: Package ${m.package} - Version: ${m.csvVersion}`, logStream);
            });
            logMessage(`\nSummary: ${mismatches.length} ✅, ${nearlyMatches.length} ⚠️, ${matches.length} ❌.`, logStream);
            if (logStream) {
                logStream.end();
            }
            })
            .catch(error => {
            console.error('Error fetching CSV:', error);
            process.exit(1);
            });
    });

program.parse();