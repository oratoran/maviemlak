import { Container, Flex, Heading } from "@chakra-ui/react";
import { Layout } from "components/Layout";
import { ListingItem } from "components/ListingItem";
import {
  AllListingsDocument,
  AllListingsQuery,
} from "generated/graphql";
import { GetStaticProps, NextPage } from "next";
import { useIntl } from "react-intl";
import { client } from "utils/apollo-client";

const Page: NextPage<{
  data: AllListingsQuery;
}> = ({ data }) => {
  const intl = useIntl();
  const allListing = data.allListing;

  if (!allListing) return null;

  return (
    <Layout
      title={intl.formatMessage({ id: 'listing', defaultMessage: 'Listing'})}
      description={""}
    >
      <Container w="100%" maxW={"container.xl"} mt="28" minH="60vh" pb="16">
        <Heading as="h1" fontSize="5xl" textAlign="center" mb="6">
          {intl.formatMessage({ id: 'listing', defaultMessage: 'Listing'})}
        </Heading>
        <Flex flexWrap="wrap" ml="-4" mr="-4">
          {allListing?.nodes?.map((item) => (
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
  const { data } = await client.query({
    query: AllListingsDocument,
    variables: {
      language: locale?.toUpperCase()
    },
  });

  return {
    props: {
      data,
    },
  };
};


export default Page;
