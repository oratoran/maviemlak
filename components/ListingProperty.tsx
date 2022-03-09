import { Box, Flex, Text } from "@chakra-ui/react";
import React, { ReactNode } from "react";

export const ListingProperty = ({
  icon,
  title,
  value,
}: {
  icon: ReactNode;
  title: string;
  value?: string | number | null;
}) => {
  if (!value) return null;

  return (
    <Box mb="4" rounded="md" p="4" bg="gray.50">
      <Flex mb="1">
        {icon}
        <Text ml="3" fontWeight="semibold">
          {title}
        </Text>
      </Flex>
      <Box pl="8">
        <Text whiteSpace="pre-line">{value}</Text>
      </Box>
    </Box>
  );
};
