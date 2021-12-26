import { Box, Container, Flex, Heading, HStack, Tag } from "@chakra-ui/react";
import { Layout } from "components/Layout";
import {
  ListingPageDocument,
  ListingPageQuery,
  ListingPathDocument,
  ListingPathQuery,
  PropertyType,
} from "generated/graphql";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import { client } from "utils/apollo-client";
import { createCustomUrlIdIndex, getUrlCache } from "utils/urlidcache";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useIntl } from "react-intl";
import { propertyTypeLocales } from "components/ListingItem";

const ListingPage: NextPage<{
  data: ListingPageQuery;
}> = ({ data }) => {
  const intl = useIntl();
  const listing = data.listing;

  if (!listing) return null;

  return (
    <Layout title={listing.title} description="desc">
      <Container w="100%" maxW={"container.xl"} mt="28">
        <Flex>
          <Box w="50%">
            <Carousel>
              {listing.images.map((image, i) => (
                <Flex key={i} align="center" h="100%" bg="gray.100">
                  <Box w="100%">
                    <Image
                      src={image.url}
                      layout="responsive"
                      width={image.width || 400}
                      height={400}
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
                {listing.price} TRY
              </Heading>
              <Tag
                size="lg"
                colorScheme={
                  listing.propertyType === PropertyType.Rent
                    ? "yellow"
                    : "green"
                }
                variant="subtle"
              >
                {listing.propertyType === PropertyType.Rent
                  ? intl.formatMessage(propertyTypeLocales.forRent)
                  : intl.formatMessage(propertyTypeLocales.forSale)}
              </Tag>
              <Tag size="lg" ml="2">
                {listing.buildingType}
              </Tag>
            </HStack>
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

  const paths = data.listings.map((item) => ({
    params: {
      slug: item.slug,
      id: item.id,
    },
  }));

  const urlCache = data.listings.reduce<{ [x: string]: string }>(
    (acc, curr) => {
      acc[curr.slug] = curr.id;
      return acc;
    },
    {}
  );

  await createCustomUrlIdIndex("listings", urlCache);

  return { paths, fallback: false };
};

export default ListingPage;
