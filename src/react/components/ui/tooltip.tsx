import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'bottom';
  wrapperClassName?: string;
}

export default function Tooltip({
  content,
  children,
  side = 'top',
  wrapperClassName,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const [arrowX, setArrowX] = useState<number | null>(null);
  const id = useId();
  const tipRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLSpanElement | null>(null);

  // Position the fixed tooltip relative to the trigger and viewport
  useEffect(() => {
    if (!open) return;
    const position = () => {
      const el = tipRef.current;
      const trigger = triggerRef.current;
      if (!el || !trigger) return;
      // Let the tooltip size to content before measuring
      el.style.top = '0px';
      el.style.left = '0px';
      el.style.visibility = 'hidden';
      requestAnimationFrame(() => {
        const tip = el.getBoundingClientRect();
        const tri = trigger.getBoundingClientRect();
        const padding = 8;
        const centerX = tri.left + tri.width / 2;
        const spaceAbove = tri.top - padding;
        const spaceBelow = window.innerHeight - tri.bottom - padding;
        const placeTop =
          (side === 'top' && tip.height + padding <= spaceAbove) ||
          tip.height + padding > spaceBelow;
        const top = placeTop ? tri.top - tip.height - 8 : tri.bottom + 8;
        let left = centerX - tip.width / 2;
        if (left < padding) left = padding;
        if (left + tip.width > window.innerWidth - padding)
          left = window.innerWidth - padding - tip.width;
        const arrow = Math.max(10, Math.min(centerX - left, tip.width - 10));
        // Apply
        el.style.top = `${top}px`;
        el.style.left = `${left}px`;
        el.style.visibility = '';
        setArrowX(arrow);
      });
    };
    position();
    window.addEventListener('resize', position);
    return () => window.removeEventListener('resize', position);
  }, [open, side]);

  return (
    <span
      className={'p-relative p-flex p-items-center ' + (wrapperClassName || '')}
      ref={triggerRef}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open &&
        createPortal(
          <div
            role="tooltip"
            id={id}
            ref={tipRef}
            className="p-fixed p-z-[10002] p-w-auto p-break-words p-rounded-md p-bg-gray-900 p-px-3 p-py-2 p-text-xs p-font-medium p-text-white p-shadow-xl"
            style={{
              top: side === 'top' ? '0px' : '0px', // positioned after measure in effect below
              left: '0px',
              maxWidth: 'min(420px, calc(100vw - 16px))',
            }}
          >
            {content}
            <span
              className="p-absolute p-h-0 p-w-0"
              style={{
                top: '100%',
                left: `${arrowX ?? 0}px`,
                transform: 'translateX(-50%)',
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid #111827',
              }}
            />
          </div>,
          document.body
        )}
    </span>
  );
}
