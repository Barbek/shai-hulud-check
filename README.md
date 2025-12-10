# Shai Hulud Check

The check will run against a public CSV file on https://github.com/wiz-sec-public/wiz-research-iocs/blob/main/reports/shai-hulud-2-packages.csv and can be overwritten with the CSV_URL environment variable.

```bash
#install
npm install
#build
npm run build
#execute
npx shai-hulud-check <path-to-package-lock.json>
```

Using another URL for the CSV

```bash
#execute
CSV_URL=<url_to_another_csv> npx shai-hulud-check <path-to-package-lock.json>
```