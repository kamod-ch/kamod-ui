import type {
  AnchorHTMLAttributes,
  AriaAttributes,
  ComponentChildren,
  ComponentType,
  JSX,
  MouseEventHandler,
} from "preact";

export type BlockLinkProps = {
  href: string;
  class?: string;
  children?: ComponentChildren;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  rel?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  "aria-current"?: AriaAttributes["aria-current"];
  "aria-label"?: string;
};

export type BlockLinkComponent = ComponentType<BlockLinkProps>;

export const NativeLink = ({ href, class: className, children, ...rest }: BlockLinkProps) => (
  <a href={href} class={className} {...rest}>
    {children}
  </a>
);

export const renderBlockLink = (
  Link: BlockLinkComponent | undefined,
  props: BlockLinkProps,
): JSX.Element => {
  const Comp = Link ?? NativeLink;
  return <Comp {...props} />;
};
