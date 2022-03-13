import { Container, Heading } from "@chakra-ui/react";
import { Layout } from "components/Layout";
import { PostContainer } from "components/Post";
import {
  PageDocument,
  PagePathsDocument,
  PagePathsQuery,
  PageQuery,
} from "generated/graphql";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useIntl } from "react-intl";
import { client } from "utils/apollo-client";
import { makeSlug } from "utils/makeSlug";
import { createCustomUrlIdIndex, getUrlCache } from "utils/urlidcache";

const Page: NextPage<{
  data: PageQuery;
}> = ({ data }) => {
  const intl = useIntl();
  const page = data.page;

  if (!page) return null;

  return (
    <Layout title={page.title as string} description="desc">
      <Container w="100%" maxW={"container.xl"} mt="28" minH="60vh">
        <Heading as="h1" fontSize="5xl" textAlign="center">{page.title}</Heading>
        <PostContainer mt="14">
          <div
            dangerouslySetInnerHTML={{
              __html: page.content as string,
            }}
          />
        </PostContainer>
      </Container>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const urlCache = await getUrlCache("pages");
  if (!urlCache) throw new Error("Invalid URL Cache");

  let id = urlCache[`${params?.slug}--${locale}`] as string;

  const { data } = await client.query({
    query: PageDocument,
    variables: {
      id,
    },
  });

  return {
    props: {
      data,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await client.query<PagePathsQuery>({
    query: PagePathsDocument,
  });

  const paths =
    data.pages?.nodes?.map((item) => ({
      params: {
        slug: makeSlug(item?.slug as string),
        id: item?.id as string,
      },
      locale: item?.language?.code?.toLowerCase()
    })) || [];

  const urlCache =
    data.pages?.nodes?.reduce<{ [x: string]: string }>((acc, curr) => {
      acc[`${makeSlug(curr?.slug as string)}--${curr?.language?.code?.toLowerCase()}`] = curr?.id as string;
      return acc;
    }, {}) || {};

  await createCustomUrlIdIndex("pages", urlCache);

  return { paths, fallback: false };
};

export default Page;