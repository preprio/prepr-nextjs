'use client'

import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'

import '../main.css'
import PreprLogo from './PreprLogo'
import ResetButton from './ResetButton'
import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
    Radio,
    RadioGroup,
} from '@headlessui/react'
import { FaCaretDown } from 'react-icons/fa6'
import InfoPopover from './InfoPopover'

export function PreprPreviewBar(props: {
    activeSegment?: string | null
    activeVariant?: string | null
    data?: any
}) {
    const { activeSegment, activeVariant, data } = props

    if (
        data?.items &&
        data?.items[data?.items.length - 1].reference_id !== 'null'
    ) {
        data.items
        data.items.unshift({
            reference_id: 'null',
            body: 'All other users',
        })
    }

    const emptyVariant = 'A'
    const emptySegment = {
        body: 'Choose segment',
    }
    const [selectedSegment, setSelectedSegment] = useState(
        (data.items &&
            data.items.filter(
                (segmentData: any) => segmentData === activeSegment
            )[0]) ||
            emptySegment
    )

    const [selectedVariant, setSelectedVariant] = useState<string | null>(
        activeVariant || 'A'
    )

    const router = useRouter()
    const pathname = usePathname()

    const handleUpdateVariant = (variant: any) => {
        setSelectedVariant(variant)

        const params = new URLSearchParams({})

        params.append('a-b-testing', variant as string)

        router.push(`${pathname}?${params.toString()}`, {
            scroll: false,
        })
        router.refresh()
    }

    const handleUpdateSegment = (value: any) => {
        setSelectedSegment(value)

        const segment = value.reference_id

        if (!segment) {
            return
        }

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
        setSelectedSegment(emptySegment)
        setSelectedVariant(emptyVariant)

        const params = new URLSearchParams({})
        params.append('segments', 'null')
        params.append('a-b-testing', 'null')

        router.push(`${pathname}?${params.toString()}`, {
            scroll: false,
        })
        router.refresh()
    }

    return (
        <div className="prp-py-4 prp-px-5 md:prp-px-19.5 prp-bg-indigo-default prp-sticky prp-top-0 prp-z-[1000] prp-base">
            <div className="prp-flex prp-gap-y-4 prp-gap-x-6 prp-flex-wrap prp-justify-between">
                {/* Logo & Text */}
                <div className="prp-flex prp-gap-6 prp-items-center">
                    <div className="prp-h-full prp-flex prp-justify-center prp-items-center">
                        <PreprLogo />
                    </div>
                    <div className="prp-hidden lg:prp-block prp-pb-0.5 prp-text-white prp-text-lg prp-text-bold prp-mr-10">
                        Adaptive Preview
                    </div>
                </div>

                <div className="prp-flex prp-w-full md:prp-w-auto prp-gap-4 lg:prp-gap-6 prp-items-center">
                    <div className="prp-flex prp-gap-4">
                        <div className="prp-regular-text prp-text-white 2xl:prp-flex prp-items-center prp-gap-2 prp-hidden">
                            <span className="prp-pb-0.5">Apply segment</span>
                            <InfoPopover
                                title={'Adaptive Preview'}
                                text={
                                    "Choose a segment to see how it's displayed."
                                }
                            />
                        </div>
                        <Listbox
                            value={selectedSegment.slug}
                            onChange={handleUpdateSegment}
                        >
                            <ListboxButton className="prp-h-10 prp-flex-initial prp-w-[13rem] md:prp-w-[15rem] prp-max-w-[15rem] prp-rounded-md data-[open]:prp-rounded-b-none data-[open]:prp-border-b-white prp-border prp-border-gray-300 prp-items-center prp-bg-white prp-justify-center prp-px-4 prp-regular-text prp-text-gray-500">
                                <span className="prp-flex prp-items-center prp-justify-between">
                                    <span>{selectedSegment.body}</span>
                                    <span className="prp-text-gray-900">
                                        <FaCaretDown className="prp-w-3" />
                                    </span>
                                </span>
                            </ListboxButton>
                            <ListboxOptions
                                anchor="bottom"
                                className="prp-z-[9999] prp-w-[var(--button-width)] prp-pb-2 prp-rounded-b-md prp-bg-white"
                            >
                                {data?.items?.map((segment: any) => (
                                    <ListboxOption
                                        className="prp-px-4 prp-py-2 hover:prp-bg-gray-100 prp-bg-white prp-text-gray-900 prp-regular-text prp-z-[100] hover:prp-cursor-pointer prp-w-full"
                                        key={segment.reference_id}
                                        value={segment}
                                    >
                                        {segment.body}
                                    </ListboxOption>
                                ))}
                            </ListboxOptions>
                        </Listbox>
                    </div>

                    <div className="prp-flex prp-gap-4">
                        <div className="prp-regular-text prp-text-white 2xl:prp-flex prp-items-center prp-gap-2 prp-hidden">
                            <span className="prp-pb-0.5">Show A/B variant</span>
                            <InfoPopover
                                title={'A/B Testing'}
                                text={
                                    'Choose between two different versions of a page to see which one performs better.'
                                }
                            />
                        </div>

                        <RadioGroup
                            className="prp-rounded-lg prp-p-1 prp-border prp-border-gray-300 prp-bg-white prp-flex prp-gap-1 prp-h-10 prp-items-center"
                            value={selectedVariant}
                            onChange={handleUpdateVariant}
                        >
                            <Radio
                                value={'A'}
                                className="prp-py-2 prp-px-3 prp-rounded-md prp-text-gray-900 prp-regular-text data-[checked]:prp-dropshadow
                                    data-[checked]:prp-bg-indigo-600 data-[checked]:prp-text-white prp-h-8 prp-text-center prp-flex prp-items-center hover:prp-cursor-pointer
                                "
                            >
                                <span className="prp-hidden md:prp-inline prp-mr-1">
                                    Variant{' '}
                                </span>
                                A
                            </Radio>
                            <Radio
                                value={'B'}
                                className="prp-py-2 prp-px-3 prp-rounded-md prp-text-gray-900 prp-regular-text data-[checked]:prp-dropshadow
                                    data-[checked]:prp-bg-indigo-600 data-[checked]:prp-text-white prp-h-8 prp-text-center prp-flex prp-items-center hover:prp-cursor-pointer
                                "
                            >
                                <span className="prp-hidden md:prp-inline prp-mr-1">
                                    Variant{' '}
                                </span>
                                B
                            </Radio>
                        </RadioGroup>
                    </div>

                    <ResetButton
                        handleClick={handleReset}
                        enabled={
                            selectedSegment.reference_id ||
                            selectedVariant !== 'A'
                        }
                    />
                </div>
            </div>
        </div>
    )
}
