import type { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import { Layout } from "components/Layout";
import { client } from "utils/apollo-client";
import { IndexPageDocument, IndexPageQuery } from "generated/graphql";
import { Carousel } from "react-responsive-carousel";
import { Box } from "@chakra-ui/react";

const Home: NextPage<{
  data: IndexPageQuery;
}> = ({ data }) => {
  console.log(data);
  return (
    <Layout title="Mavi Emlak" description="Description">
      <Carousel>
        {data.listings.map((item) => (
          <Box key={item.id} h="xl">
            <Image src={item.bannerImage?.url as string} layout="fill" alt="" />
          </Box>
        ))}
      </Carousel>
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
