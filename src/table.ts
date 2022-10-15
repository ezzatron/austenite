import { EOL } from "os";

const segmenter = new Intl.Segmenter("en");

export function createTable(padding: number) {
  const pad = " ".repeat(padding);
  const rows: string[][] = [];
  const widths: number[] = [];

  return {
    addRow(row: string[]) {
      rows.push(row);

      for (const [index, cell] of Object.entries(row)) {
        const i = Number(index);
        widths[i] = Math.max(widths[i] ?? 0, graphemeCount(cell));
      }
    },

    render() {
      const lines = [];

      for (const row of rows) {
        const cells = [];

        for (let i = 0; i < row.length; ++i) {
          const cell = row[i];
          cells.push(i < row.length - 1 ? cell.padEnd(widths[i]) : cell);
        }

        lines.push(cells.join(pad));
      }

      return lines.join(EOL);
    },
  };
}

function graphemeCount(string: string) {
  return [...segmenter.segment(string)].length;
}
