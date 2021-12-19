import Head from "next/head";
import { Navbar } from "./Navbar";

export interface LayoutProps {
  title: string;
  description: string;
  image?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  title,
  description,
  image,
  children,
}) => {
  return (
    <div className="wrapper">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        {image && <meta property="og:image" content={image} />}
      </Head>
      <Navbar />
      {children}
    </div>
  );
};
