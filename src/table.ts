import { EOL } from "os";

interface Table {
  addRow: (row: string[]) => void;
  render: () => string;
}

const segmenter = new Intl.Segmenter("en");

export function createTable(): Table {
  const rows: string[][] = [];
  const widths: number[] = [];

  return {
    addRow(row) {
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
          if (i === row.length - 1) {
            cells.push(row[i]);
          } else {
            cells.push(row[i].padEnd(widths[i]));
          }
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
