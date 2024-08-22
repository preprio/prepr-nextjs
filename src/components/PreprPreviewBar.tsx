'use client'

import {usePathname, useRouter} from 'next/navigation'
import React, {useState} from 'react'

export default function PreprPreviewBar(props: {
    activeSegment?: string | null
    activeVariant?: string | null
    data?: any
}) {
    const {activeSegment, activeVariant, data} = props
    const [selectedSegment, setSelectedSegment] = useState(activeSegment)
    const [selectedVariant, setSelectedVariant] = useState<string | null>(
        activeVariant === 'LAST_VERSION' ? 'A' : 'B'
    )

    const router = useRouter()
    const pathname = usePathname()

    const handleUpdateVariant = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const variant = e.target.value
        setSelectedVariant(variant)

        const params = new URLSearchParams({})

        if (variant !== 'Choose variant') {
            params.append('a-b-testing', variant as string)
        } else {
            params.append('a-b-testing', 'null')
        }

        router.push(`${pathname}?${params.toString()}`, {
            scroll: false,
        })
        router.refresh()
    }

    const handleUpdateSegment = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const segment = e.target.value
        setSelectedSegment(segment)

        const params = new URLSearchParams({})

        if (segment !== 'Choose segment') {
            params.append('segments', segment as string)
        } else {
            params.append('segments', 'null')
        }

        router.push(`${pathname}?${params.toString()}`, {
            scroll: false,
        })
        router.refresh()
    }

    const handleReset = () => {
        setSelectedSegment(null)
        setSelectedVariant(null)

        const params = new URLSearchParams({})
        params.append('segments', 'null')
        params.append('a-b-testing', 'null')

        router.push(`${pathname}?${params.toString()}`, {
            scroll: false,
        })
    }

    return (
        <div className={"preprPreviewBar"}>
            <div className={"preprPreviewBarWrapper"}>
                {/* Dropdowns */}
                <div className={"preprPreviewDropdownWrapper"}>
                    <select
                        value={selectedSegment || 'Choose segment'}
                        onChange={handleUpdateSegment}
                        id='segments'
                        name='segments'
                        className={"preprPreviewDropdown"}>
                        <option>Choose segment</option>
                        {data?.items?.map((segment: any) => (
                            <option
                                key={segment.reference_id}
                                value={segment.reference_id}>
                                {segment.body}
                            </option>
                        ))}
                    </select>
                    <select
                        value={selectedVariant || 'Choose variant'}
                        onChange={handleUpdateVariant}
                        id='variant'
                        name='variant'
                        className={"preprPreviewDropdown"}>
                        <option>Choose variant</option>
                        <option value='A'>Variant A</option>
                        <option value='B'>Variant B</option>
                    </select>
                </div>

                <button onClick={handleReset} className={"preprPreviewReset"}>
                    Reset
                </button>
            </div>
        </div>
    )
}
