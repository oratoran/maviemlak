import NextLink from "next/link";
import { Box, Flex, Heading, Text, Link, Tag } from "@chakra-ui/react";
import { MediaDetails } from "generated/graphql";
import Image from "next/image";
import { useIntl, defineMessages, FormattedMessage } from "react-intl";
import { BathtubIcon, BedIcon, MapPinIcon } from "icons";
import { makeSlug } from "utils/makeSlug";
import { makeBlurDataUri } from "utils/makeBlurDataUri";

export interface ListingItemProps {
  title: string;
  image: MediaDetails & {
    url: string;
    placeholder?: string | null;
    mimeType: string;
  };
  price: string;
  address: string;
  propertyType: string;
  slug: string;
  buildingType: string;
  bedrooms: string;
  bathrooms: string;
}

export const propertyTypeLocales = defineMessages({
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
  buildingType,
  slug,
  bathrooms,
  bedrooms,
}) => {
  const intl = useIntl();

  return (
    <Box w="33%" p="4">
      <Flex
        _hover={{
          shadow: "xl",
        }}
        direction="column"
        borderRadius="sm"
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
          placeholder={image.placeholder ? "blur" : "empty"}
          blurDataURL={makeBlurDataUri(image.mimeType, image.placeholder as string)}
        />
        <Box p="3" pb="4">
          <Heading
            as="h3"
            fontSize="lg"
            color="gray.700"
            _hover={{
              color: "blue.500",
            }}
          >
            <NextLink href={`/listings/${makeSlug(slug)}`} passHref>
              <Link
                _hover={{
                  textDecoration: "none",
                }}
              >
                {title}
              </Link>
            </NextLink>
          </Heading>
          <Flex mt="4" alignItems="center">
            <Text fontSize="md" fontWeight="semibold" color="gray.700" mr="4">
              {price} TRY
            </Text>
            <Tag
              size="lg"
              colorScheme={propertyType === "RENT" ? "yellow" : "green"}
              variant="subtle"
            >
              {propertyType === "RENT"
                ? intl.formatMessage(propertyTypeLocales.forRent)
                : intl.formatMessage(propertyTypeLocales.forSale)}
            </Tag>
            <Tag size="lg" ml="2">
              {buildingType}
            </Tag>
          </Flex>
          <Flex mt="4" borderRadius="md" p="2">
            <Box
              w="6"
              h="6"
              color="gray.900"
              mr="4"
              p="1"
              bg="gray.50"
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
              <Text>
                <FormattedMessage
                  id="listing.bedrooms"
                  defaultMessage={`{number} Bedrooms`}
                  values={{
                    number: bedrooms,
                  }}
                />
              </Text>
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
              <Text>
                <FormattedMessage
                  id="listing.bathrooms"
                  defaultMessage={`{number} Bathrooms`}
                  values={{
                    number: bathrooms,
                  }}
                />
              </Text>
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};
