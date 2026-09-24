"""Import the supplied XLSX without third-party dependencies; preserve every column."""
import argparse
import json
from pathlib import Path
import xml.etree.ElementTree as ET
import zipfile

ROOT = Path(__file__).resolve().parents[1]
NS = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}

def read_workbook(path):
    with zipfile.ZipFile(path) as archive:
        shared = []
        if 'xl/sharedStrings.xml' in archive.namelist():
            shared = [''.join(x.itertext()) for x in ET.fromstring(archive.read('xl/sharedStrings.xml')).findall('m:si', NS)]
        rows = ET.fromstring(archive.read('xl/worksheets/sheet1.xml')).findall('m:sheetData/m:row', NS)
        def values(row):
            result = {}
            for cell in row.findall('m:c', NS):
                column = ''.join(c for c in cell.attrib['r'] if c.isalpha())
                v = cell.find('m:v', NS)
                inline = cell.find('m:is', NS)
                text = v.text if v is not None and v.text else ''.join(inline.itertext()) if inline is not None else ''
                result[column] = shared[int(text)] if cell.get('t') == 's' and text else text
            return result
        headers = values(rows[0])
        if headers.get('A') != '求人ID':
            raise ValueError('先頭列は求人IDである必要があります')
        records = []
        seen = set()
        for row in rows[1:]:
            cells = values(row)
            if not any(cells.values()):
                continue
            record = {label: cells.get(col, '') for col, label in headers.items()}
            job_id = record['求人ID']
            if not job_id.isdigit() or job_id in seen or int(job_id) <= 16:
                raise ValueError(f'無効または重複した求人ID: {job_id}')
            seen.add(job_id)
            records.append(record)
        if not records:
            raise ValueError('求人がありません')
        return list(headers.values()), records

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('xlsx', type=Path)
    args = parser.parse_args()
    headers, records = read_workbook(args.xlsx)
    def write(path, content):
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(content, ensure_ascii=False, separators=(',', ':')) + '\n')
    write(ROOT / 'data/imported-jobs.json', {'headers': headers, 'records': records})
    write(ROOT / 'src/data/job-options.json', {
        'areas': sorted({r['エリア名（都道府県）'] for r in records if r['エリア名（都道府県）']}),
        'categories': sorted({r['職種'] for r in records if r['職種']})
    })
    print(f'Imported {len(records)} jobs, {len(headers)} columns')

if __name__ == '__main__':
    main()
