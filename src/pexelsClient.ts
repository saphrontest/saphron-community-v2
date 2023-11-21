import { createClient } from 'pexels';

const pexel_api_key = process.env.REACT_APP_PEXEL_API_KEY ?? ""

const pexelsClient = createClient(pexel_api_key);

export const getPexelPhoto = async (query="menthal health") => {
    const response: any = await pexelsClient.photos.search({query})
    const random = Math.random()*10
    return response.photos[random.toFixed()]
}

