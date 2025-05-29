import Head from "next/head";
import {
  capitalizeFirstLetter,
  getHeaderTitle,
} from "@/helpers/functionHelpers";

export const HeadTitle = ({ title }) => {
  const title2 = capitalizeFirstLetter(title);
  return (
    <Head>
      <title>{getHeaderTitle(title2)}</title>
    </Head>
  );
};
