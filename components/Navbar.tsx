import { Flex, Image, Link, List, ListItem } from "@chakra-ui/react";
import NextLink from "next/link";
import { useIntl } from "react-intl";
import { navbarItems } from "../utils/navbaritems";

export interface NavbarProps {
  isFrontPage?: boolean;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const intl = useIntl();

  return (
    <Flex justify="space-between" p="4">
      <NextLink href="/" passHref>
        <Link>
          <Image src="/logo.png" alt="Mavi Emlak" w="40" />
        </Link>
      </NextLink>
      <List display="flex">
        {navbarItems.map((item) => (
          <ListItem key={item.url} mx="2">
            <NextLink href={item.url} passHref>
              <Link textTransform="uppercase" fontWeight="bold">
                {intl.formatMessage(item.title)}
              </Link>
            </NextLink>
          </ListItem>
        ))}
      </List>
    </Flex>
  );
};
