import { Box, BoxProps } from "@chakra-ui/react";
import React, { ReactNode } from "react";

export const PostContainer:React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Box
  
      sx={{
        h1: {
          fontSize: "4xl",
          mb: "6",
        },
        h2: {
          fontSize: "3xl",
          mb: "6",
        },
        h3: {
          fontSize: "2xl",
          mb: "6",
        },
        h4: {
          fontSize: "xl",
          mb: "6",
        },
        h5: {
          fontSize: "lg",
          mb: "6",
        },
        h6: {
          fontSize: "md",
          mb: "6",
        },
        img: {
          maxW: "100%",
          mb: "6",
        },
        p: {
          mb: "6",
        },
        ul: {
          ml: "6",
          mb: '6',
        },
        ol: {
          ml: "6",
          mb: "6",
        },
        blockquote: {
          mb: "6",
          bg: 'gray.50',
          p: '2'
        }
      }}
      {...props}
    >
      {children}
    </Box>
  );
};
