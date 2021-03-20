export const { IS_TESTNET } = process.env;

export const TEST_MODE = process.env.NODE_ENV !== 'production' || process.env.CI;

export const LIKER_LAND_URL = IS_TESTNET ? 'https://rinkeby.liker.land' : 'https://liker.land';

export const LIKECOIN_API_BASE = IS_TESTNET ? 'https://api.rinkeby.like.co' : 'https://api.like.co';

export const LIKER_LAND_API_BASE = IS_TESTNET ? 'https://rinkeby.liker.land/api' : 'https://liker.land/api';

export const AUTH_COOKIE_NAME = '__session';
