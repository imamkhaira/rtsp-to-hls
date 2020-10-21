import Streamer from '@/entities/streamer';
import logger from './Logger';

export const pErr = (err: Error) => {
    if (err) {
        logger.error(err);
    }
};

export const getRandomInt = () => {
    return Math.floor(Math.random() * 1_000_000_000_000);
};

/** Convert Streamer to response data */
export const streamer_to_response_data = (streamer: Streamer) => ({
    id: streamer.id,
    url: streamer.url,
    isActive: streamer.isActive,
    public_index: streamer.public_index,
});
