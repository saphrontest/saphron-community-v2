import { createClient } from 'pexels';

const pexel_api_key = process.env.REACT_APP_PEXEL_API_KEY ?? ""

const pexelsClient = createClient(pexel_api_key);

export const getPexelPhoto = async () => {
    const response: any = await pexelsClient.photos.search({query: "menthal health"})
    const random = Math.random()*10
    return response.photos[random.toFixed()]
}
