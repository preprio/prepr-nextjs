import React from 'react'
import classNames from 'classnames'
import { FaRotate } from 'react-icons/fa6'

interface ResetButtonProps {
    enabled?: boolean
    handleClick?: () => void
}

export default function ResetButton({
    enabled = false,
    handleClick,
}: ResetButtonProps) {
    const classes = classNames(
        'prp-py-3 prp-px-4 prp-flex prp-gap-2 prp-items-center rounded-md prp-regular-text h-10',
        enabled &&
            'prp-bg-orange-400 hover:prp-orange-500 prp-cursor-pointer prp-text-white',
        !enabled && 'prp-bg-grey-400 prp-text-gray-500'
    )

    return (
        <button
            onClick={handleClick}
            className={classes}
            disabled={!enabled}
        >
            <FaRotate />
            <span className="prp-hidden lg:prp-block">Reset</span>
        </button>
    )
}
