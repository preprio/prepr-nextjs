import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { FaInfoCircle } from 'react-icons/fa'
import React from 'react'

interface InfoPopoverProps {
    title: string
    text: string
}

export default function InfoPopover({ title, text }: InfoPopoverProps) {
    return (
        <Popover>
            <PopoverButton className="prp-ring-0 focus:prp-ring-0 prp-font-bold prp-text-indigo-300 prp-text-xs hover:prp-text-indigo-400 prp-block">
                <FaInfoCircle />
            </PopoverButton>
            <PopoverPanel
                transition
                anchor="bottom"
                className="prp-z-[1000] prp-p-4"
            >
                <div className=" prp-bg-white rounded-lg p-6 prp-dropshadow-popover prp-space-y-3 prp-max-w-[312px]">
                    <span className="prp-text-base prp-font-bold prp-leading-tight prp-text-gray-900">
                        {title}
                    </span>
                    <div className="prp-space-y-2">
                        <span className="prp-text-sm">{text}</span>
                    </div>
                </div>
            </PopoverPanel>
        </Popover>
    )
}
