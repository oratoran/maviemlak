import type { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import { Layout } from "components/Layout";
import { client } from "utils/apollo-client";
import { Asset, IndexPageDocument, IndexPageQuery } from "generated/graphql";
import { Carousel } from "react-responsive-carousel";
import { Box, Container, Flex, Heading, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { ListingItem } from "components/ListingItem";
import { FormattedMessage } from "react-intl";

const Home: NextPage<{
  data: IndexPageQuery;
}> = ({ data }) => {
  console.log(data);
  return (
    <Layout title="Mavi Emlak" description="Description">
      <Carousel>
        {data.siteSetting?.featuredListings.map((item) => (
          <Box key={item.id} h="xl" position="relative">
            <Image src={item.bannerImage?.url as string} layout="fill" alt="" />
            <Box
              position="absolute"
              right={0}
              bottom={0}
              bgGradient="linear(to-b, transparent, blackAlpha.800)"
              zIndex={2}
              w="100%"
              h="50%"
              display="flex"
              alignItems="flex-end"
              justifyContent="flex-end"
              p="12"
              pb="20"
            >
              <NextLink href={`/listings/${item.slug}`} passHref>
                <Link
                  maxW="60%"
                  textAlign="right"
                  _hover={{
                    textDecoration: "none",
                  }}
                >
                  <Heading as="h2" color="white">
                    {item.title}
                  </Heading>
                </Link>
              </NextLink>
            </Box>
          </Box>
        ))}
      </Carousel>
      <Container maxW="container.lg" py="8">
        <Flex justifyContent="space-between" mb="4">
          <Heading as="h2">
            <FormattedMessage defaultMessage="Listings" id="listings" />
          </Heading>
          <NextLink href="/listings" passHref>
            <Link>
              <FormattedMessage defaultMessage="View All" id="viewAll" />
            </Link>
          </NextLink>
        </Flex>
        <Flex>
          {data.listings.map((item) => (
            <ListingItem
              key={item.id}
              address={item.address}
              image={item.images[0] as Asset}
              price={item.price as string}
              propertyType={item.propertyType}
              title={item.title}
              slug={item.slug}
              buildingType={item.buildingType}
            />
          ))}
        </Flex>
      </Container>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await client.query({
    query: IndexPageDocument,
  });

  return {
    props: {
      data,
    },
  };
};

export default Home;
