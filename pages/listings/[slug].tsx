import { Box, Container, Flex, Heading, HStack, Tag, Text } from "@chakra-ui/react";
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
import { MapPinIcon } from "icons";
import { defineMessages } from "@formatjs/intl";

const listingPropertyTitles = defineMessages({
  address: {
    defaultMessage: 'Address',
  }
})

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
                      placeholder={image?.blurredPreview ? 'blur' : 'empty'}
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
                  listing.acf?.propertytype ==='RENT'
                    ? "yellow"
                    : "green"
                }
                variant="subtle"
              >
                {listing.acf?.propertytype === 'RENT'
                  ? intl.formatMessage(propertyTypeLocales.forRent)
                  : intl.formatMessage(propertyTypeLocales.forSale)}
              </Tag>
              <Tag size="lg" ml="2">
                {listing.acf?.buildingType}
              </Tag>
            </HStack>
            <Text mt="4">
              {listing.acf?.description}
            </Text>
          </Box>
        </Flex>
        <Flex mt="12">
          <Box w="60%" pr="4">
            <div dangerouslySetInnerHTML={{ __html: listing.content as string }} />
          </Box>
          <Box w="40%">
            <ListingProperty icon={<MapPinIcon />} title={intl.formatMessage(listingPropertyTitles.address)} value={listing.acf?.address as string}  />
          </Box>
        </Flex>
      </Container>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const urlCache = await getUrlCache("listings");
  if (!urlCache) throw new Error("Invalid URL Cache");

  const { data } = await client.query({
    query: ListingPageDocument,
    variables: {
      id: urlCache[params?.slug as string],
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

  const paths = data.allListing?.nodes?.map((item) => ({
    params: {
      slug: item?.slug as string,
      id: item?.id as string,
    },
  })) || [];

  const urlCache = data.allListing?.nodes?.reduce<{ [x: string]: string }>(
    (acc, curr) => {
      acc[(curr?.slug as string)] = curr?.id as string;
      return acc;
    },
    {}
  ) || {};

  await createCustomUrlIdIndex("listings", urlCache);

  return { paths, fallback: false };
};

export default ListingPage;
