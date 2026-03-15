import { Card, card } from "./Card";
import { CardAction, cardAction } from "./CardAction";
import { CardContent, cardContent } from "./CardContent";
import { CardDescription, cardDescription } from "./CardDescription";
import { CardFooter, cardFooter } from "./CardFooter";
import { CardHeader, cardHeader } from "./CardHeader";
import { CardTitle, cardTitle } from "./CardTitle";

const CardVariants = {
  card,
  cardAction,
  cardContent,
  cardDescription,
  cardFooter,
  cardHeader,
  cardTitle
};

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardVariants
};

export default {
  Root: Card,
  Header: CardHeader,
  Footer: CardFooter,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Action: CardAction
};
