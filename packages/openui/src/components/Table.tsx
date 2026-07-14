import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@kamod-ch/ui/table";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { MAX_LABEL_LENGTH, MAX_NAME_LENGTH, MAX_STRING_LENGTH } from "../constants";

const columnSchema = z.object({
  id: z.string().min(1).max(MAX_NAME_LENGTH),
  header: z.string().min(1).max(MAX_LABEL_LENGTH),
});

export const tablePropsSchema = z
  .object({
    columns: z.array(columnSchema).min(1).max(20),
    rows: z
      .array(z.array(z.string().max(MAX_STRING_LENGTH)).max(20))
      .max(100)
      .default([]),
    caption: z.string().max(MAX_LABEL_LENGTH).optional(),
  })
  .superRefine((data, ctx) => {
    const width = data.columns.length;
    data.rows.forEach((row, index) => {
      if (row.length !== width) {
        ctx.addIssue({
          code: "custom",
          message: `Row ${index} length (${row.length}) must match columns (${width})`,
          path: ["rows", index],
        });
      }
    });
  });

export function renderTableTree(props: z.infer<typeof tablePropsSchema>) {
  return (
    <>
      {props.caption ? <TableCaption>{props.caption}</TableCaption> : null}
      <TableHeader>
        <TableRow>
          {props.columns.map((column) => (
            <TableHead key={column.id}>{column.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.rows.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <TableCell key={`${rowIndex}-${props.columns[cellIndex]?.id ?? cellIndex}`}>
                {cell}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </>
  );
}

export const tableComponent = defineComponent({
  name: "Table",
  description:
    "Static data table. Args: columns [{id, header}], rows (string[][], each length = columns), optional caption.",
  props: tablePropsSchema,
  component: ({ props }) => <Table>{renderTableTree(props)}</Table>,
});
