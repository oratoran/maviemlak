import NextLink from "next/link";
import { Box, Flex, Heading, Text, Link } from "@chakra-ui/react";
import { Asset, PropertyType } from "generated/graphql";
import Image from "next/image";
import { useIntl, defineMessages } from "react-intl";
import { BathtubIcon, BedIcon, MapPinIcon } from "icons";

export interface ListingItemProps {
  title: string;
  image: Asset;
  price: string;
  address: string;
  propertyType: PropertyType;
  slug: string;
}

const propertyTypeLocales = defineMessages({
  forRent: {
    defaultMessage: "For Rent",
    id: "forRent",
  },
  forSale: {
    defaultMessage: "For Sale",
    id: "forSale",
  },
});

export const ListingItem: React.FC<ListingItemProps> = ({
  title,
  image,
  price,
  address,
  propertyType,
  slug,
}) => {
  const intl = useIntl();

  return (
    <NextLink href={`/listings/${slug}`} passHref>
      <Link
        _hover={{
          textDecoration: "none",
          shadow: "xl",
        }}
        role="group"
        display="flex"
        flexDirection="column"
        borderRadius="sm"
        w="33%"
        position="relative"
        shadow="md"
        mt="4"
      >
        <Image
          src={image.url}
          alt={title}
          layout="responsive"
          width={image.width || 400}
          height={image.height || 300}
        />
        <Box p="3" pb="4">
          <Heading
            as="h3"
            fontSize="lg"
            color="gray.700"
            _groupHover={{
              color: "blue.500",
            }}
          >
            {title}
          </Heading>
          <Flex mt="4" alignItems="center">
            <Text fontSize="md" fontWeight="semibold" color="gray.700" mr="4">
              {price} TRY
            </Text>
            <Box
              borderRadius="lg"
              display="inline-block"
              alignSelf="flex-start"
              py="1"
              px="4"
              bg={
                propertyType === PropertyType.Rent ? "yellow.200" : "green.200"
              }
            >
              <Text
                fontSize="sm"
                textTransform="uppercase"
                color="gray.900"
                fontWeight="semibold"
              >
                {propertyType === PropertyType.Rent
                  ? intl.formatMessage(propertyTypeLocales.forRent)
                  : intl.formatMessage(propertyTypeLocales.forSale)}
              </Text>
            </Box>
          </Flex>
          <Flex mt="4" bg="gray.50" borderRadius="md" p="2">
            <Box
              w="6"
              h="6"
              color="gray.900"
              mr="4"
              p="1"
              bg="gray.100"
              borderRadius="md"
            >
              <MapPinIcon width="100%" height="100%" />
            </Box>
            <Text>{address}</Text>
          </Flex>
          <Flex mt="4" justifyContent="space-between">
            <Flex
              w="49%"
              bg="purple.50"
              borderRadius="lg"
              alignItems="center"
              p="2"
            >
              <Box
                w="6"
                h="6"
                p="1"
                color="purple.900"
                mr="2"
                borderRadius="md"
                bg="purple.100"
              >
                <BedIcon width="100%" height="100%" />
              </Box>
              <Text>2 Bedrooms</Text>
            </Flex>
            <Flex
              w="49%"
              bg="blue.50"
              borderRadius="lg"
              alignItems="center"
              p="2"
            >
              <Box
                w="6"
                h="6"
                p="1"
                color="blue.900"
                mr="2"
                borderRadius="md"
                bg="blue.100"
              >
                <BathtubIcon width="100%" height="100%" />
              </Box>
              <Text>2 Bathrooms</Text>
            </Flex>
          </Flex>
        </Box>
      </Link>
    </NextLink>
  );
};
