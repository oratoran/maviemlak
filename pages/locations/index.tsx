import type { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import { Layout } from "components/Layout";
import { client } from "utils/apollo-client";
import { AllLocationsDocument, AllLocationsQuery } from "generated/graphql";
import { Box, Container, Flex, Heading, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { makeBlurDataUri } from "utils/makeBlurDataUri";
import { FormattedMessage } from "react-intl";

const Locations: NextPage<{
  data: AllLocationsQuery;
}> = ({ data }) => {
  const list = data.allLocations?.nodes?.map((node) => {
    return (
      <LocationCard
        key={node?.id}
        slug={node?.slug as string}
        image={{
          sourceUrl: node?.locationsAcf?.image?.sourceUrl as string,
          blurredPreview: node?.locationsAcf?.image?.blurredPreview,
          mimeType: node?.locationsAcf?.image?.mimeType,
        }}
        title={node?.title as string}
      />
    );
  });

  return (
    <Layout title="Locations | Mavi Emlak" description="Description">
      <Container maxW="container.xl" py="8">
        <Heading as="h1" mb="7" textAlign="center">
          <FormattedMessage id="locations" defaultMessage="Locations" />
        </Heading>
        <Flex mt="8" ml="-6" mr="-6" flexWrap="wrap">
          {list}
        </Flex>
      </Container>
    </Layout>
  );
};

const LocationCard = ({
  slug,
  title,
  image,
}: {
  slug: string;
  title: string;
  image: {
    mimeType?: string | null;
    blurredPreview?: string | null;
    sourceUrl: string;
  };
}) => {
  return (
    <Box w="33%" p="6">
      <NextLink href={`/locations/${slug}`} passHref>
        <Link display="block">
          <Box position="relative" h="400px">
            <Image
              src={image.sourceUrl}
              placeholder={image.blurredPreview ? "blur" : "empty"}
              blurDataURL={makeBlurDataUri(
                image.mimeType as string,
                image.blurredPreview as string
              )}
              layout="fill"
              alt=""
            />
          </Box>
          <Heading as="h2" fontSize="3xl" mt="2">{title}</Heading>
        </Link>
      </NextLink>
    </Box>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await client.query({
    query: AllLocationsDocument,
  });

  return {
    props: {
      data,
    },
  };
};

export default Locations;
