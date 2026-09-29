import { DescriptionList } from "./DescriptionList";
import { DescriptionListDetails } from "./DescriptionListDetails";
import { DescriptionListItem } from "./DescriptionListItem";
import { DescriptionListTerm } from "./DescriptionListTerm";
import {
  descriptionList,
  descriptionListDetails,
  descriptionListItem,
  descriptionListTerm,
} from "./description-list-variants";

const DescriptionListVariants = {
  descriptionList,
  descriptionListItem,
  descriptionListTerm,
  descriptionListDetails,
};


export type {
  DescriptionListColumns,
  DescriptionListLayout,
  DescriptionListProps,
} from "./DescriptionList";
export type { DescriptionListDetailsProps } from "./DescriptionListDetails";
export type { DescriptionListItemProps } from "./DescriptionListItem";
export type { DescriptionListTermProps } from "./DescriptionListTerm";
export {
  DescriptionList,
  DescriptionListDetails,
  DescriptionListItem,
  DescriptionListTerm,
  DescriptionListVariants,
  descriptionList,
  descriptionListDetails,
  descriptionListItem,
  descriptionListTerm,
};

export default {
  Root: DescriptionList,
  Item: DescriptionListItem,
  Term: DescriptionListTerm,
  Details: DescriptionListDetails,
};
