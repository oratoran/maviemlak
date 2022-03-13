import { Box, Flex, Image, Link, List, ListItem, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { useIntl } from "react-intl";
import { navbarItems } from "utils/navbaritems";

export const Footer = () => {
  const intl = useIntl();

  return (
    <Flex bg="gray.100" py="14" align="center" direction="column">
      <NextLink href="/" passHref>
        <Link>
          <Image src="/logo.png" alt="Mavi Emlak" w="40" />
        </Link>
      </NextLink>
      <Box my="4" fontSize="md">
        <List display="flex">
          {navbarItems.map((item) => (
            <ListItem key={item.url} mx="2">
              <NextLink href={item.url} passHref>
                <Link textTransform="uppercase" fontWeight="semibold">
                  {intl.formatMessage(item.title)}
                </Link>
              </NextLink>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box>
        <Text>Copyright &copy; maviemlak</Text>
      </Box>
    </Flex>
  );
};
