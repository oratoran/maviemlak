import { Container, Flex, Heading } from "@chakra-ui/react";
import { Layout } from "components/Layout";
import { ListingItem } from "components/ListingItem";
import {
  AllLocationsDocument,
  AllLocationsQuery,
  ListingByLocationDocument,
  ListingByLocationQuery,
} from "generated/graphql";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useIntl } from "react-intl";
import { client } from "utils/apollo-client";
import { makeSlug } from "utils/makeSlug";
import { createCustomUrlIdIndex, getUrlCache } from "utils/urlidcache";

const Page: NextPage<{
  data: ListingByLocationQuery;
}> = ({ data }) => {
  const intl = useIntl();
  const location = data.location;
  const listings = data.listings;

  if (!location || !listings) return null;

  return (
    <Layout
      title={location.title as string}
      description={location.locationsAcf?.description as string}
    >
      <Container w="100%" maxW={"container.xl"} mt="28" minH="60vh" pb="16">
        <Heading as="h1" fontSize="5xl" textAlign="center" mb="6">
          {location.title}
        </Heading>
        <Flex flexWrap="wrap" ml="-4" mr="-4">
          {listings?.nodes?.map((item) => (
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
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const urlCache = await getUrlCache("locations");
  if (!urlCache) throw new Error("Invalid URL Cache");

  const id = urlCache[params?.location as string];

  const { data } = await client.query({
    query: ListingByLocationDocument,
    variables: {
      language: locale?.toUpperCase(),
      location: params?.location,
      locationId: id as string,
    },
  });

  return {
    props: {
      data,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await client.query<AllLocationsQuery>({
    query: AllLocationsDocument,
  });

  const paths =
    data.allLocations?.nodes?.map((item) => ({
      params: {
        location: makeSlug(item?.slug as string),
      },
    })) || [];

  const urlCache =
    data.allLocations?.nodes?.reduce<{ [x: string]: string }>((acc, curr) => {
      acc[curr?.slug as string] = curr?.id as string;
      return acc;
    }, {}) || {};

  await createCustomUrlIdIndex("locations", urlCache);

  return { paths, fallback: false };
};

export default Page;
