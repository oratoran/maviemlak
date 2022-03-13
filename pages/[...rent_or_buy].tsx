import { Container, Flex, Heading } from "@chakra-ui/react";
import { defineMessages } from "@formatjs/intl";
import { Layout } from "components/Layout";
import { ListingItem } from "components/ListingItem";
import { PostContainer } from "components/Post";
import { RentOrSaleDocument, RentOrSaleQuery } from "generated/graphql";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useIntl } from "react-intl";
import { client } from "utils/apollo-client";
import { getUrlCache } from "utils/urlidcache";

const translations = defineMessages({
  rent: {
    defaultMessage: "Rent",
    id: "rent",
  },
  buy: {
    defaultMessage: "Buy",
    id: "buy",
  },
});

const RentOrBuy: NextPage<{
  data: RentOrSaleQuery;
  propertyType: "RENT" | "SALE";
}> = ({ data, propertyType }) => {

  const intl = useIntl();
  const allListing = data.allListing;

  if (!allListing) return null;

  return (
    <Layout
      title={intl.formatMessage(
        propertyType === "RENT" ? translations.rent : translations.buy
      )}
      description="desc"
    >
      <Container w="100%" maxW={"container.xl"} my="28" minH="60vh">
        <Heading as="h1" fontSize="5xl" textAlign="center">
          {intl.formatMessage(
            propertyType === "RENT" ? translations.rent : translations.buy
          )}
        </Heading>
        <Flex>
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
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!Array.isArray(params?.rent_or_buy)) {
    throw new Error("Rent or sale");
  }

  const propertyType = params?.rent_or_buy[0] === "rent" ? "RENT" : "SALE";

  const { data } = await client.query({
    query: RentOrSaleDocument,
    variables: {
      propertyType,
    },
  });

  return {
    props: {
      data,
      propertyType,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {
        params: {
          rent_or_buy: ["rent"],
        },
      },
      {
        params: {
          rent_or_buy: ["buy"],
        },
      },
    ],
    fallback: false,
  };
};

export default RentOrBuy;
