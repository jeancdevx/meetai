import { createLoader, parseAsInteger, parseAsString } from 'nuqs/server'

import { DEFAULT_PAGE } from '@/constants'

export const filterSearchParams = {
  page: parseAsInteger
    .withDefault(DEFAULT_PAGE)
    .withOptions({ clearOnDefault: true }),
  search: parseAsString.withDefault('').withOptions({ clearOnDefault: true })
}

export const loadSearchParams = createLoader(filterSearchParams)
