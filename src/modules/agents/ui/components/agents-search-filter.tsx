'use client'

import { useEffect, useMemo, useState } from 'react'

import { SearchIcon } from 'lucide-react'

import debounce from 'debounce'

import { useAgentsFilters } from '@/hooks/use-agents-filters'

import { Input } from '@/components/ui/input'

const AgentsSearchFilter = () => {
  const [filters, setFilters] = useAgentsFilters()
  const [localSearch, setLocalSearch] = useState(filters.search)

  useEffect(() => {
    setLocalSearch(filters.search)
  }, [filters.search])

  const debouncedSetSearch = useMemo(
    () =>
      debounce((searchValue: string) => {
        setFilters({ search: searchValue })
      }, 300),
    [setFilters]
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalSearch(value)
    debouncedSetSearch(value)
  }

  return (
    <div className='relative'>
      <Input
        placeholder='Search agents...'
        className='h-9 w-[200px] bg-white pl-7'
        value={localSearch}
        onChange={handleSearchChange}
      />
      <SearchIcon className='text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2' />
    </div>
  )
}

export { AgentsSearchFilter }
