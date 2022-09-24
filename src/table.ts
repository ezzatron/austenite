import { EOL } from "os";

const segmenter = new Intl.Segmenter("en");

export type ReadOnlyTable = Pick<ReturnType<typeof createTable>, "render">;

export function createTable() {
  const rows: string[][] = [];
  const widths: number[] = [];

  return {
    addRow(row: string[]) {
      rows.push(row);

      for (let i = 0; i < row.length; ++i) {
        widths[i] = Math.max(widths[i] ?? 0, graphemeCount(row[i]));
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

        lines.push(cells.join("  "));
      }

      return lines.join(EOL);
    },
  };
}

function graphemeCount(string: string) {
  return [...segmenter.segment(string)].length;
}
