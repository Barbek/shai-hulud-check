# Shai Hulud Check

The check will run against a public CSV file on https://github.com/wiz-sec-public/wiz-research-iocs/blob/main/reports/shai-hulud-2-packages.csv and can be overwritten with the CSV_URL environment variable.

```bash
#install
npm install
#build
npm run build
#execute
npx shai-hulud-check <path-to-package-lock.json>
#or
node bin/check.js <path-to-package-lock.json>
```

Using another URL for the CSV

```bash
#execute
CSV_URL=<url_to_another_csv> npx shai-hulud-check <path-to-package-lock.json>
```

Log files

The default is `shai-hulud-log.log` if the parameter `-l` or `--log` is passed in.
A filename can be provided to with the logging parameter.
Or use the `LOG_FILE` environment variable.

```bash
npx shai-hulud-check -l <path-to-package-lock.json>
#or
npx shai-hulud-check --log <path-to-package-lock.json>
#or
npx shai-hulud-check -l <log_file_path> <path-to-package-lock.json>
#or
LOG_FILE=<log_file_path> npx shai-hulud-check <path-to-package-lock.json>
```