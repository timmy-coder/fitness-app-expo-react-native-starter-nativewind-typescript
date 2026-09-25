import { isWeb } from "@/utils/utils";
import {createClient} from "@sanity/client";
import {createImageUrlBuilder} from "@sanity/image-url";


// Client safe config
export const config = {
    projectId: "88jzromg",
    dataset: "production",
   apiVersion: '2025-05-30',
    useCdn: true,
    // token: process.env.SANITY_API_TOKEN,
    stega: {
         enabled: !!isWeb,
      studioUrl: "http://localhost:3333/"
    }
}

export const client = createClient(config);

// Admin level client, used for backend
const adminConfig = {
    ...config,
    token: process.env.SANITY_API_TOKEN,
}

// Image URL builder
const builder = createImageUrlBuilder(config);
export const urlFor = (source: string)  => builder.image(source);