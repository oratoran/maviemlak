import type { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import { Layout } from "components/Layout";
import { client } from "utils/apollo-client";
import { IndexPageDocument, IndexPageQuery } from "generated/graphql";
import { Carousel } from "react-responsive-carousel";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Link,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { ListingItem } from "components/ListingItem";
import { FormattedMessage } from "react-intl";
import { makeSlug } from "utils/makeSlug";
import { ModalForm } from "components/ModalForm";

const Home: NextPage<{
  data: IndexPageQuery;
}> = ({ data }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Layout title="Mavi Emlak" description="Description">
      <Carousel>
        {data.siteSetting?.settingsPage?.featuredListings?.map((item) => (
          <Box key={item?.id} h="xl" position="relative">
            <Image
              src={item?.acf?.bannerImage?.sourceUrl as string}
              layout="fill"
              alt=""
            />
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
              <NextLink
                href={`/listings/${makeSlug(item?.slug as string)}`}
                passHref
              >
                <Link
                  maxW="60%"
                  textAlign="right"
                  _hover={{
                    textDecoration: "none",
                  }}
                >
                  <Heading as="h2" color="white">
                    {item?.title}
                  </Heading>
                </Link>
              </NextLink>
            </Box>
          </Box>
        ))}
      </Carousel>
      <Container maxW="container.xl" py="8">
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
        <Flex flexWrap="wrap" ml="-4" mr="-4">
          {data.allListing?.nodes?.map((item) => (
            <ListingItem
              key={item?.id}
              address={item?.acf?.address as string}
              image={{
                url: item?.acf?.displayImage?.sourceUrl as string,
                ...item?.acf?.displayImage?.mediaDetails,
                placeholder: item?.acf?.displayImage?.blurredPreview,
                mimeType: item?.acf?.displayImage?.mimeType as string,
              }}
              price={item?.acf?.price as string}
              propertyType={item?.acf?.propertytype as string}
              title={item?.title as string}
              slug={item?.slug as string}
              buildingType={item?.acf?.buildingType as string}
              bathrooms={`${item?.acf?.bathrooms ?? 0}`}
              bedrooms={`${item?.acf?.rooms ?? 0}`}
            />
          ))}
        </Flex>
      </Container>
      <Container maxW="container.xl" py="8" mt="12">
        <Flex h="400px">
          <Box pr="8" position="relative" w="50%" display="flex">
            <NextLink href="/rent" passHref>
              <Link
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/for-rent.jpg'), linear-gradient(#222, #222)"
                backgroundSize="auto 100%"
                backgroundPosition="50% 50%"
                transition="background-size 0.35s ease-in"
                w="100%"
                _hover={{
                  textDecoration: "none",
                  backgroundSize: "auto 110%",
                }}
              >
                <Heading as="h2" color="white">
                  <FormattedMessage defaultMessage="For Rent" id="forRent" />
                </Heading>
              </Link>
            </NextLink>
          </Box>
          <Box pl="8" position="relative" w="50%" display="flex">
            <NextLink href="/buy" passHref>
              <Link
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/for-sale.jpg'), linear-gradient(#222, #222)"
                backgroundSize="auto 100%"
                backgroundPosition="50% 50%"
                transition="background-size 0.35s ease-in"
                w="100%"
                _hover={{
                  textDecoration: "none",
                  backgroundSize: "auto 110%",
                }}
              >
                <Heading as="h2" color="white">
                  <FormattedMessage defaultMessage="For Sale" id="forSale" />
                </Heading>
              </Link>
            </NextLink>
          </Box>
        </Flex>
      </Container>
      <Container maxW="container.xl" py="8" my="12">
        <Flex
          alignItems="center"
          bg="blue.900"
          color="white"
          p="6"
          rounded="sm"
          justifyContent="space-between"
        >
          <Text>
            <FormattedMessage
              id="sendInquiryDescription"
              defaultMessage="Do you want to sell, rent or just to get quota for your property?"
            />
          </Text>
          <Button
            variant="primary"
            bg="white"
            color="blue.900"
            onClick={onOpen}
          >
            <FormattedMessage
              id="sendInquiryBtn"
              defaultMessage="Send Inquiry"
            />
          </Button>
        </Flex>
        <ModalForm onClose={onClose} isOpen={isOpen} />
      </Container>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const { data } = await client.query({
    query: IndexPageDocument,
    variables: {
      language: locale?.toUpperCase(),
    },
  });

  return {
    props: {
      data,
    },
  };
};

export default Home;
