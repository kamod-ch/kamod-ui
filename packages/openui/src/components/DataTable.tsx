import { DataTable } from "@kamod-ch/ui/data-table";
import { defineComponent } from "@openuidev/react-lang";
import { renderTableTree, tablePropsSchema } from "./Table";

export const dataTableComponent = defineComponent({
  name: "DataTable",
  description:
    "Table with bordered chrome. Same args as Table: columns, rows, optional caption. Prefer for denser datasets.",
  props: tablePropsSchema,
  component: ({ props }) => <DataTable chrome>{renderTableTree(props)}</DataTable>,
});
