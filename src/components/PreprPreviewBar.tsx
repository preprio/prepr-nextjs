'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

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
import { FaCaretDown, FaCheck } from 'react-icons/fa6'
import InfoPopover from './InfoPopover'
import { clsx } from 'clsx'
import { PreprSegment } from '../shared/types'

export function PreprPreviewBar(props: {
    activeSegment?: string | null
    activeVariant?: string | null
    data?: PreprSegment[]
}) {
    const { activeSegment, activeVariant, data } = props
    const [isIframe, setIsIframe] = useState<boolean>(false)

    if (!data) {
        console.error(
            'No data provided, make sure you are using your Prepr GraphQL URL')
        return null
    }

    const [segmentList, setSegmentList] = useState<PreprSegment[]>([
        {
            _id: 'all_other_users',
            name: 'All other users',
        },
        ...data,
    ])
    const [isToggled, setIsToggled] = useState<boolean>(false)
    const searchParams = useSearchParams()

    if (searchParams.get('prepr_hide_bar') === 'true') {
        return null
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        const key = event.key.toLowerCase();

        // Check for the blocked shortcuts
        const isSaveShortcut = (event.ctrlKey || event.metaKey) && key === 's';
        const isPrintShortcut = (event.ctrlKey || event.metaKey) && key === 'p';
        const isAddressBarShortcut = (event.ctrlKey || event.metaKey) && key === 'l';

        if (isSaveShortcut || isPrintShortcut || isAddressBarShortcut) {
            event.preventDefault(); // Prevent the browser's default action
        }
    };


    useEffect(() => {
        const isIframe = typeof window !== 'undefined' && window?.parent !== window.self;
        // Hide the preview bar if not on the client or if the page is in an iframe
        if (isIframe) {
            setIsIframe(true)

            const previewBarMessage = {
                name: 'prepr_preview_bar',
                event: 'loaded',
            }
            window.parent.postMessage(previewBarMessage, '*')

            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            if (isIframe) {
                window.removeEventListener('keydown', handleKeyDown);
            }
        };
    }, [])


    const emptyVariant = 'A'
    const emptySegment: PreprSegment = {
        name: 'Choose segment',
        _id: 'null',
    }

    useEffect(() => {
        if (!typeof window) {
            return
        }

        if (window.localStorage.getItem('isToggled')) {
            setIsToggled(window.localStorage.getItem('isToggled') === 'true')
        }
    })

    const [selectedSegment, setSelectedSegment] = useState<PreprSegment>(
        (segmentList &&
            segmentList.filter(
                (segmentData: PreprSegment) =>
                    segmentData._id === activeSegment
            )[0]) ||
            emptySegment
    )

    const [selectedVariant, setSelectedVariant] = useState<string | null>(
        activeVariant || 'A'
    )

    const router = useRouter()
    const pathname = usePathname()

    const handleSearchParams = (key: string, value: any) => {
        const params = new URLSearchParams(window.location.search)

        if (key === 'prepr_preview_ab') {
            setSelectedVariant(value)
            params.set(key, value as string)
        }
        if (key === 'prepr_preview_segment' && value) {
            setSelectedSegment(value)
            params.set(key, value._id as string)
        }

        router.push(`${pathname}?${params.toString()}`, {
            scroll: false,
        })
        router.refresh()
    }

    const handleToggle = () => {
        setIsToggled(!isToggled)
        window.localStorage.setItem('isToggled', String(!isToggled))
    }

    const handleReset = () => {
        setSelectedSegment(emptySegment)
        setSelectedVariant(emptyVariant)

        const params = new URLSearchParams({})
        params.append('prepr_preview_segment', 'null')
        params.append('prepr_preview_ab', 'null')

        router.push(`${pathname}?${params.toString()}`, {
            scroll: false,
        })
        router.refresh()

        // Remove parameters with value "null"
        params.delete('prepr_preview_segment')
        params.delete('prepr_preview_ab')
        router.push(`${pathname}?${params.toString()}`, {
            scroll: false,
        })
        router.refresh()
    }

    if (isIframe) {
        return null
    }

    return (
        <div className="prp-z-[999] prp-isolate prp-flex prp-base prp-w-full prp-sticky prp-top-0">
            <div
                className={clsx(
                    'prp-py-4 prp-px-5 prp-bg-purple-900 prp-w-full prp-overflow-hidden',
                    isToggled ? 'prp-sticky prp-top-0' : 'prp-hidden'
                )}
            >
                <div className="prp-flex prp-max-w-7xl prp-mx-auto prp-gap-y-4 prp-h-full prp-gap-x-6 prp-flex-col sm:prp-flex-row prp-flex-wrap">
                    <div className="prp-flex prp-gap-6 prp-items-center">
                        <div className="prp-h-full prp-flex prp-justify-center prp-items-center">
                            <PreprLogo />
                        </div>
                        <div className="prp-hidden lg:prp-block prp-pb-0.5 prp-text-white prp-text-lg prp-text-bold">
                            Adaptive Preview
                        </div>
                    </div>

                    <div className="prp-flex prp-flex-wrap prp-gap-2 md:prp-gap-4 prp-ml-0 sm:prp-ml-auto md:prp-items-center">
                        <div className="prp-flex prp-flex-col md:prp-flex-row prp-gap-2 md:prp-gap-4 prp-flex-1">
                            <div className="prp-regular-text prp-text-white prp-items-center prp-gap-2 prp-hidden lg:prp-flex">
                                <span className="prp-pb-0.5 prp-text-xs md:prp-text-base prp-block md:prp-hidden xl:prp-block">
                                    Apply segment
                                </span>
                                <InfoPopover
                                    title={'Adaptive Preview'}
                                    text={
                                        "Choose a segment to see how it's displayed."
                                    }
                                />
                            </div>

                            <Listbox
                                value={selectedSegment._id}
                                onChange={(value: any) =>
                                    handleSearchParams(
                                        'prepr_preview_segment',
                                        value
                                    )
                                }
                            >
                                <ListboxButton
                                    disabled={
                                        !(segmentList && segmentList.length > 0)
                                    }
                                    className="disabled:prp-cursor-not-allowed disabled:prp-text-gray-400 disabled:prp-bg-gray-200 prp-h-10 prp-flex prp-gap-2 prp-w-full md:prp-w-48 prp-flex-nowrap prp-text-nowrap prp-overflow-hidden prp-text-ellipsis prp-rounded-lg data-[open]:prp-border-b-white prp-border prp-border-gray-300 prp-items-center prp-bg-white prp-px-2 md:prp-px-4 prp-regular-text prp-text-gray-500"
                                >
                                    <div
                                        style={{
                                            textWrap: 'nowrap',
                                            textOverflow: 'ellipsis',
                                            textAlign: 'left',
                                        }}
                                        className="prp-w-full prp-overflow-hidden prp-mr-auto"
                                    >
                                        {segmentList.length > 0
                                            ? selectedSegment.name
                                            : 'No segments'}
                                    </div>
                                    <div className="prp-text-gray-400">
                                        <FaCaretDown className="prp-w-3" />
                                    </div>
                                </ListboxButton>
                                <ListboxOptions
                                    anchor="top start"
                                    className="prp-z-[9999] prp-rounded-md !prp-max-h-[300px] prp-bg-white prp-mt-2 prp-shadow-xl"
                                >
                                    {segmentList?.map(
                                        (segment: PreprSegment) => (
                                            <ListboxOption
                                                key={segment._id}
                                                value={segment}
                                                className={clsx(
                                                    'prp-flex prp-items-center prp-p-2  prp-regular-text prp-z-[100] hover:prp-cursor-pointer prp-w-full prp-pr-4',
                                                    segment._id ===
                                                        selectedSegment._id
                                                        ? 'prp-bg-indigo-50 prp-text-indigo-700'
                                                        : 'hover:prp-bg-gray-100 prp-bg-white prp-text-gray-900'
                                                )}
                                            >
                                                <FaCheck
                                                    className={clsx(
                                                        'prp-size-3 prp-shrink-0 prp-mr-1',
                                                        segment._id ===
                                                            selectedSegment._id
                                                            ? 'prp-visible'
                                                            : 'prp-invisible'
                                                    )}
                                                />
                                                <div
                                                    style={{
                                                        textWrap: 'nowrap',
                                                        textOverflow:
                                                            'ellipsis',
                                                        textAlign: 'left',
                                                    }}
                                                    className="prp-w-full prp-overflow-hidden prp-mr-auto"
                                                >
                                                    {segment.name}
                                                </div>
                                            </ListboxOption>
                                        )
                                    )}
                                </ListboxOptions>
                            </Listbox>
                        </div>

                        <div className="prp-flex prp-flex-initial prp-flex-col md:prp-flex-row prp-gap-2 md:prp-gap-4">
                            <div className="prp-regular-text prp-text-white prp-items-center prp-gap-2 prp-hidden lg:prp-flex">
                                <span className="prp-pb-0.5 prp-text-xs md:prp-text-base prp-block md:prp-hidden xl:prp-block">
                                    Show A/B variant
                                </span>
                                <InfoPopover
                                    title={'A/B Testing'}
                                    text={
                                        'Choose between two different versions of a page to see which one performs better.'
                                    }
                                />
                            </div>

                            <RadioGroup
                                className="prp-rounded-lg prp-p-1 prp-mr-auto prp-border prp-border-gray-300 prp-bg-white prp-flex prp-gap-1 prp-h-10 prp-items-center"
                                value={selectedVariant}
                                onChange={(value: any) =>
                                    handleSearchParams(
                                        'prepr_preview_ab',
                                        value
                                    )
                                }
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

                        <div className="prp-flex prp-flex-initial prp-mt-auto md:prp-h-full">
                            <ResetButton
                                handleClick={handleReset}
                                enabled={
                                    selectedSegment._id !== 'null' ||
                                    selectedVariant !== 'A'
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div
                className={clsx(
                    'prp-w-full prp-flex',
                    isToggled
                        ? '-prp-bottom-6 prp-absolute'
                        : 'prp-top-0 prp-fixed'
                )}
            >
                <div
                    className={clsx(
                        'prp-w-auto prp-mx-auto prp-flex prp-items-center prp-border-t-2 prp-border-purple-900'
                    )}
                >
                    <div
                        className={`prp-relative prp-z-[100] prp-mx-auto prp-bg-purple-900 prp-regular-text prp-text-white prp-px-2 prp-py-0.5 prp-rounded-b-lg prp-flex prp-items-center prp-cursor-pointer`}
                        onClick={handleToggle}
                    >
                        Adaptive Preview
                        {isToggled ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                                className="prp-size-3 prp-fill-white prp-ml-2"
                            >
                                <path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                                className="prp-size-3 prp-fill-white prp-ml-2"
                            >
                                <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                            </svg>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
