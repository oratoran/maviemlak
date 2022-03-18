import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Link,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";
import { Layout } from "components/Layout";
import {
  ListingPageDocument,
  ListingPageQuery,
  ListingPathDocument,
  ListingPathQuery,
} from "generated/graphql";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import { client } from "utils/apollo-client";
import { createCustomUrlIdIndex, getUrlCache } from "utils/urlidcache";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useIntl } from "react-intl";
import { propertyTypeLocales } from "components/ListingItem";
import { ListingProperty } from "components/ListingProperty";
import {
  BathtubIcon,
  ClipboardIcon,
  DoorOpenIcon,
  GlobeIcon,
  MapIcon,
  MapPinIcon,
} from "icons";
import { defineMessages } from "@formatjs/intl";
import { PostContainer } from "components/Post";
import { makeSlug } from "utils/makeSlug";
import NextLink from "next/link";

const listingPropertyTitles = defineMessages({
  address: {
    defaultMessage: "Address",
  },
  facilities: {
    defaultMessage: "Facilities",
  },
  rooms: {
    defaultMessage: "Rooms",
  },
  bathrooms: {
    defaultMessage: "Bathrooms",
  },
  area: {
    defaultMessage: "Area",
  },
});

const ListingPage: NextPage<{
  data: ListingPageQuery;
}> = ({ data }) => {
  const intl = useIntl();
  const listing = data.listing;

  if (!listing) return null;

  return (
    <Layout title={listing.title as string} description="desc">
      <Container w="100%" maxW={"container.xl"} mt="28">
        <Flex>
          <Box w="50%">
            <Carousel>
              {listing.propertyImages?.map((image, i) => (
                <Flex key={i} align="center" h="100%" bg="gray.100">
                  <Box w="100%">
                    <Image
                      src={image?.sourceUrl as string}
                      layout="responsive"
                      width={image?.mediaDetails?.width || 600}
                      height={600}
                      placeholder={image?.blurredPreview ? "blur" : "empty"}
                      blurDataURL={image?.blurredPreview as string}
                      alt=""
                    />
                  </Box>
                </Flex>
              ))}
            </Carousel>
          </Box>
          <Box w="50%" px="6">
            <Heading as="h1">{listing.title}</Heading>
            <HStack spacing="4" mt="4">
              <Heading as="h2" fontSize="xl" color="gray.800">
                {listing.acf?.price} TRY
              </Heading>
              <Tag
                size="lg"
                colorScheme={
                  listing.acf?.propertytype === "RENT" ? "yellow" : "green"
                }
                variant="subtle"
              >
                {listing.acf?.propertytype === "RENT"
                  ? intl.formatMessage(propertyTypeLocales.forRent)
                  : intl.formatMessage(propertyTypeLocales.forSale)}
              </Tag>
              <Tag size="lg" ml="2">
                {listing.acf?.buildingType}
              </Tag>
            </HStack>
            {listing.acf?.location?.slug && (
              <Box my="3">
                <NextLink
                  passHref
                  href={`/locations/${listing.acf?.location?.slug}`}
                >
                  <Link display="flex" color="blue.600" alignItems="center">
                    <GlobeIcon />
                    <Text ml="3">{listing.acf.location.title}</Text>
                  </Link>
                </NextLink>
              </Box>
            )}
            <Text mt="4" fontSize="md">
              {listing.acf?.description}
            </Text>
          </Box>
        </Flex>
        <Flex mt="12">
          <PostContainer w="60%" pr="4">
            <div
              dangerouslySetInnerHTML={{ __html: listing.content as string }}
            />
          </PostContainer>
          <Box w="40%">
            <ListingProperty
              icon={<MapPinIcon />}
              title={intl.formatMessage(listingPropertyTitles.address)}
              value={listing.acf?.address}
            />
            <ListingProperty
              icon={<ClipboardIcon />}
              title={intl.formatMessage(listingPropertyTitles.facilities)}
              value={listing.acf?.facilities}
            />
            <ListingProperty
              icon={<DoorOpenIcon />}
              title={intl.formatMessage(listingPropertyTitles.rooms)}
              value={listing.acf?.rooms}
            />
            <ListingProperty
              icon={<BathtubIcon width="24" height="24" />}
              title={intl.formatMessage(listingPropertyTitles.bathrooms)}
              value={listing.acf?.bathrooms}
            />
            <ListingProperty
              icon={<MapIcon width="24" height="24" />}
              title={intl.formatMessage(listingPropertyTitles.area)}
              value={listing.acf?.area}
            />
            {listing?.otherProperties && listing.otherProperties.length > 0 && (
              <Table my="6">
                <Tbody border="1px" borderColor="gray.100">
                  {listing.otherProperties.map((item, i) => (
                    <Tr key={`${item?.key}-${i}`}>
                      <Td borderRight="1px" borderRightColor="gray.100">
                        {item?.key}
                      </Td>
                      <Td>{item?.value}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
            {(() => {
              if (listing.acf?.agent) {
                const agentData = listing.acf.agent;
                return (
                  <Flex
                    direction="column"
                    align="center"
                    my="8"
                    py="8"
                    bg="gray.50"
                  >
                    <Box
                      rounded="full"
                      overflow="hidden"
                      sx={{
                        "& > span": {
                          display: "block !important",
                        },
                      }}
                    >
                      <Image
                        width="180px"
                        height="180px"
                        alt=""
                        src={agentData.agentsAcf?.picture?.sourceUrl as string}
                        placeholder={
                          agentData.agentsAcf?.picture?.blurredPreview
                            ? "blur"
                            : "empty"
                        }
                        blurDataURL={
                          agentData.agentsAcf?.picture?.blurredPreview as string
                        }
                      />
                    </Box>
                    <Heading as="h4" fontSize="2xl" mt="6">
                      {agentData.title}
                    </Heading>
                    <Text color="blue.700" mt="1" mb="3" fontWeight="semibold">
                      {agentData.agentsAcf?.position}
                    </Text>
                    {agentData.agentsAcf?.email && (
                      <Link href={`mailto:${agentData.agentsAcf.email}`} mb="3">
                        {agentData.agentsAcf.email}
                      </Link>
                    )}
                    {agentData.agentsAcf?.phoneNumber1 && (
                      <Link href={`tel:${agentData.agentsAcf.phoneNumber1}`}>
                        {agentData.agentsAcf.phoneNumber1}
                      </Link>
                    )}
                    {agentData.agentsAcf?.phoneNumber2 && (
                      <Link href={`tel:${agentData.agentsAcf.phoneNumber2}`}>
                        {agentData.agentsAcf.phoneNumber2}
                      </Link>
                    )}
                  </Flex>
                );
              }
            })()}
          </Box>
        </Flex>
      </Container>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const urlCache = await getUrlCache("listings");
  if (!urlCache) throw new Error("Invalid URL Cache");

  const { data } = await client.query({
    query: ListingPageDocument,
    variables: {
      id: urlCache[`${makeSlug(params?.slug as string)}--${locale}`],
    },
  });

  return {
    props: {
      data,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await client.query<ListingPathQuery>({
    query: ListingPathDocument,
  });

  const paths =
    data.allListing?.nodes?.map((item) => ({
      params: {
        slug: makeSlug(item?.slug as string),
        id: item?.id as string,
      },
      locale: item?.language?.code?.toLowerCase(),
    })) || [];

  const urlCache =
    data.allListing?.nodes?.reduce<{ [x: string]: string }>((acc, curr) => {
      acc[
        `${makeSlug(
          curr?.slug as string
        )}--${curr?.language?.code?.toLowerCase()}`
      ] = curr?.id as string;
      return acc;
    }, {}) || {};

  await createCustomUrlIdIndex("listings", urlCache);

  return { paths, fallback: false };
};

export default ListingPage;
