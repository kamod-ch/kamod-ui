import { PageHeader } from "./PageHeader";
import { PageHeaderActions } from "./PageHeaderActions";
import { PageHeaderDescription } from "./PageHeaderDescription";
import { PageHeaderFooter } from "./PageHeaderFooter";
import { PageHeaderHeading } from "./PageHeaderHeading";
import { PageHeaderTitle, PageHeaderTitleVariants } from "./PageHeaderTitle";
import {
  pageHeader,
  pageHeaderActions,
  pageHeaderDescription,
  pageHeaderFooter,
  pageHeaderHeading,
  pageHeaderTitle,
} from "./page-header-variants";

const PageHeaderVariants = {
  pageHeader,
  pageHeaderHeading,
  pageHeaderTitle,
  pageHeaderDescription,
  pageHeaderActions,
  pageHeaderFooter,
};


export type { PageHeaderTitleLevel, PageHeaderTitleProps } from "./PageHeaderTitle";
export {
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderFooter,
  PageHeaderHeading,
  PageHeaderTitle,
  PageHeaderTitleVariants,
  PageHeaderVariants,
  pageHeader,
  pageHeaderActions,
  pageHeaderDescription,
  pageHeaderFooter,
  pageHeaderHeading,
  pageHeaderTitle,
};

export default {
  Root: PageHeader,
  Heading: PageHeaderHeading,
  Title: PageHeaderTitle,
  Description: PageHeaderDescription,
  Actions: PageHeaderActions,
  Footer: PageHeaderFooter,
};
