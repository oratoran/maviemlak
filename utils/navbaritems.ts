import { defineMessage } from "@formatjs/intl";

export const navbarItems = [
  {
    title: defineMessage({ id: "home", defaultMessage: "Home" }),
    url: "/",
  },
  {
    title: defineMessage({ id: "about", defaultMessage: "About" }),
    url: "/about",
  },
  {
    title: defineMessage({ id: "rent", defaultMessage: "Rent" }),
    url: "/rent",
  },
  {
    title: defineMessage({ id: "buy", defaultMessage: "Buy" }),
    url: "/buy",
  },
  {
    title: defineMessage({
      id: "testimonials",
      defaultMessage: "Testimonials",
    }),
    url: "/testimonials",
  },
  {
    title: defineMessage({ id: "contact", defaultMessage: "Contact" }),
    url: "/contact",
  },
];
