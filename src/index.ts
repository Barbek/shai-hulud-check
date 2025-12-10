import { Command } from 'commander';
import { Checker } from './checker';
const fs = require('fs');

const CSV_URL = process.env.CSV_URL || 'https://raw.githubusercontent.com/wiz-sec-public/wiz-research-iocs/refs/heads/main/reports/shai-hulud-2-packages.csv';

const program = new Command();

program
    .name('shai-hulud-check')
    .description('Check package-lock.json for compromised packages')
    .argument('<file>', 'path to package-lock.json file')
    .action((file: string) => {
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
                mismatches.forEach(m => {
                    console.log(`✅: Package ${m.package} - CSV Version: ${m.csvVersion}, Lockfile Version: ${m.lockfileVersion}`);
                });
                nearlyMatches.forEach(m => {
                    console.log(`⚠️: Package ${m.package} - CSV Version: ${m.csvVersion}, Lockfile Version: ${m.lockfileVersion}`);
                });
                matches.forEach(m => {
                    console.log(`❌: Package ${m.package} - Version: ${m.csvVersion}`);
                });
                console.log(`\nSummary: ${mismatches.length} ✅, ${nearlyMatches.length} ⚠️, ${matches.length} ❌.`);
            })
            .catch(error => {
                console.error('Error fetching CSV:', error);
                process.exit(1);
            });
    });

program.parse();