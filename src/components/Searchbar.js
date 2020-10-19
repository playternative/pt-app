import React, { useEffect, useState } from 'react'

import classnames from 'classnames'
import {
    DropdownItem,
    DropdownMenu,
    Input
} from 'reactstrap'

import useDebounce from '@/utils/useDebounce'

const renderSearchResult = (item) => {
    return (
        <div className="align-items-center d-flex-inline">
            <img
                className="mr-2"
                src={item.coverImage}
                width={36}
            />
            <span>
                {item.name}
            </span>
        </div>
    )
}

const Searchbar = ({ className, placeholder = 'Search', renderItem = renderSearchResult, onSelect, data, limit = 9 }) => {
    const [incomingData, setIncomingData] = useState([])
    const [searchString, setSearchString] = useState('')
    const debouncedSearchStr = useDebounce(searchString, 500);


    useEffect(() => {
        if (data) {
            if (searchString && incomingData) {
                const lowerCased = searchString.toLowerCase()
                const filteredData = incomingData.filter(item => {
                    if (item.name) {
                        return item.name.toLowerCase().includes(lowerCased)
                    } else {
                        return null
                    }
                })
                setIncomingData(filteredData)
            } else {
                setIncomingData(data.games)
            }
        }
    }, [debouncedSearchStr, data])

    return (
        <div className={classnames(className, 'position-relative')}>
            <Input
                className="w-100"
                onChange={({ target: { value } }) => setSearchString(value)}
                placeholder={placeholder}
                value={searchString}
            />
            {
                searchString.length && incomingData.length ?
                    <DropdownMenu className="d-block">
                        {

                            incomingData.map(item => (
                                <DropdownItem
                                    onClick={(e) => {
                                        onSelect(e, item)
                                        setSearchString('')
                                        setIncomingData([])
                                    }}
                                    style={{ cursor: 'pointer' }}
                                    toggle={false}
                                >
                                    {renderItem(item)}
                                </DropdownItem>
                            ))
                        }
                    </DropdownMenu>
                    : null
            }
        </div>
    )
}

export default Searchbar