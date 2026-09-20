import redis from "../config/redis";

const invalidateCache = async (key: string) => {
    try {
        const pattern = `${key}*`;

        const keys = await redis.keys(pattern);

        if (keys.length === 0) {
            return;
        }

        await redis.del(...keys);

    } catch (err) {
        console.error("Error deleting cache:", err);
    }
};

export default invalidateCache;