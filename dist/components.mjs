"use client";
import "./chunk-IQXHJV5O.mjs";

// src/components/PreprPreviewBar.tsx
import { usePathname, useRouter } from "next/navigation";
import React4, { useState } from "react";

// src/components/PreprLogo.tsx
import React from "react";
function PreprLogo() {
  return /* @__PURE__ */ React.createElement("svg", { width: "75", height: "20", viewBox: "0 0 75 20", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M28.8527 1.56704C28.8588 1.55728 28.8647 1.54752 28.8701 1.53728L28.872 1.53392C28.872 1.53392 28.8719 1.53376 28.8718 1.5337C28.9044 1.47094 28.9231 1.4001 28.9231 1.32481C28.9231 1.15609 28.8307 1.00899 28.6932 0.928662C28.6918 0.927198 28.6902 0.924705 28.6888 0.923892C25.7969 -0.628737 21.9356 -0.26169 19.3787 2.32725C17.9433 3.78059 17.2104 5.64985 17.1726 7.52828H17.1702V14.903C17.1702 14.9031 17.1702 14.9031 17.1702 14.9031C17.1702 15.1575 17.3798 15.3639 17.6384 15.3639H19.8237C20.0823 15.3639 20.292 15.1575 20.292 14.9031C20.292 14.9031 20.292 14.9031 20.292 14.903V7.68194H20.2932C20.2931 6.52406 20.7324 5.36498 21.617 4.4692C23.1961 2.8704 25.5272 2.75034 27.1344 3.59213C27.1394 3.59484 27.1446 3.59728 27.1496 3.59988C27.1532 3.60178 27.1569 3.60346 27.1605 3.60541L27.161 3.6053C27.2219 3.63376 27.2898 3.65018 27.3617 3.65018C27.5444 3.65018 27.7024 3.54676 27.7796 3.39641L28.8527 1.56704Z",
      fill: "white"
    }
  ), /* @__PURE__ */ React.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M7.80452 0C3.49433 0 0 3.43924 0 7.68195V19.5124C0 19.7667 0.209581 19.9732 0.468282 19.9732H2.65358C2.65363 19.9732 2.65363 19.9732 2.65363 19.9732C2.91222 19.9732 3.12186 19.7667 3.12186 19.5124V13.8279C4.42627 14.7924 6.04758 15.364 7.80457 15.364C12.1147 15.364 15.6094 11.9247 15.6094 7.68206C15.6094 3.4393 12.1147 0 7.80452 0ZM7.80457 12.2912C5.21845 12.2912 3.12186 10.2275 3.12186 7.68195C3.12186 5.13631 5.21845 3.07279 7.80457 3.07279C10.3906 3.07279 12.4874 5.13631 12.4874 7.68195C12.4874 10.2275 10.3906 12.2912 7.80457 12.2912Z",
      fill: "white"
    }
  ), /* @__PURE__ */ React.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M53.8288 0C49.5187 0 46.0243 3.43924 46.0243 7.68195V19.5124C46.0243 19.7667 46.2339 19.9731 46.4926 19.9732H48.6779C48.9365 19.9732 49.1462 19.7667 49.1462 19.5124V13.828C50.4506 14.7924 52.0719 15.364 53.8289 15.364C58.139 15.364 61.6337 11.9247 61.6337 7.68211C61.6337 3.4393 58.139 0 53.8288 0ZM53.8289 12.2912C51.2427 12.2912 49.1462 10.2276 49.1462 7.68195C49.1462 5.13631 51.2427 3.07279 53.8289 3.07279C56.4149 3.07279 58.5117 5.13631 58.5117 7.68195C58.5117 10.2276 56.4149 12.2912 53.8289 12.2912Z",
      fill: "white"
    }
  ), /* @__PURE__ */ React.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M44.4094 7.83561C44.4094 3.59285 40.9148 0 36.6046 0C32.2944 0 28.8 3.4393 28.8 7.68206C28.8 11.9247 32.2944 15.364 36.6046 15.364C39.0444 15.364 41.0568 14.2635 42.3189 12.9136C42.3191 12.9135 42.3193 12.9133 42.3194 12.9132C42.3204 12.9121 42.3214 12.9112 42.3224 12.9101V12.91C42.4051 12.8268 42.4563 12.7131 42.4563 12.5876C42.4563 12.4549 42.3989 12.3357 42.3077 12.2515V12.2509L42.3012 12.2456C42.2893 12.2351 42.2769 12.2251 42.2639 12.2158L40.5942 10.8782C40.5118 10.8069 40.4041 10.7634 40.2857 10.7634C40.1386 10.7634 40.0075 10.8302 39.9217 10.9346C39.1801 11.6777 38.0073 12.2911 36.6047 12.2911C34.0186 12.2911 31.922 10.2275 31.922 7.68184C31.922 5.13621 34.0186 3.07268 36.6047 3.07268C38.6433 3.07268 40.377 4.3555 41.02 6.14547H36.9949C36.7362 6.14553 36.5266 6.35187 36.5266 6.6064L36.5265 8.75734C36.5265 9.01182 36.7361 9.21827 36.9949 9.21827H43.7851C43.7978 9.21827 43.8104 9.21734 43.823 9.21637C43.8356 9.2174 43.8481 9.21827 43.8608 9.21827C44.0687 9.21827 44.2449 9.08466 44.3059 8.90011L44.3113 8.90098C44.314 8.88434 44.3166 8.86829 44.3192 8.85219C44.3225 8.83653 44.325 8.8206 44.3268 8.80434C44.3809 8.46076 44.4094 8.21572 44.4094 7.83561Z",
      fill: "white"
    }
  ), /* @__PURE__ */ React.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M74.8943 1.53668L74.8963 1.53332C74.8963 1.53332 74.8962 1.53316 74.8961 1.53311C74.9287 1.47034 74.9474 1.3995 74.9474 1.32422C74.9474 1.15549 74.855 1.00839 74.7175 0.928067C74.7161 0.926603 74.7145 0.92411 74.7131 0.923297C71.8212 -0.629332 67.9599 -0.26234 65.403 2.32666C63.9676 3.77999 63.2347 5.64926 63.1969 7.52769H63.1945V14.9024C63.1945 14.9025 63.1945 14.9025 63.1945 14.9025C63.1945 15.1569 63.4041 15.3634 63.6627 15.3634H65.8481C66.1066 15.3634 66.3164 15.1569 66.3164 14.9025C66.3164 14.9025 66.3164 14.9025 66.3164 14.9024V7.68135H66.3175C66.3174 6.52346 66.7567 5.36438 67.6414 4.46861C69.2204 2.8698 71.5515 2.74975 73.1587 3.59154C73.1637 3.59425 73.1689 3.59668 73.174 3.59929C73.1776 3.60118 73.1813 3.60286 73.1849 3.60481L73.1854 3.60471C73.2462 3.63316 73.3141 3.64958 73.386 3.64958C73.5688 3.64958 73.7268 3.54617 73.8039 3.39582L74.8769 1.56644C74.8831 1.55668 74.889 1.54687 74.8943 1.53668Z",
      fill: "white"
    }
  ));
}

// src/components/ResetButton.tsx
import React2 from "react";
import classNames from "classnames";
import { FaRotate } from "react-icons/fa6";
function ResetButton({
  enabled = false,
  handleClick
}) {
  const classes = classNames(
    "prp-py-3 prp-px-4 prp-flex prp-gap-2 prp-items-center rounded-md prp-regular-text h-10",
    enabled && "prp-bg-orange-400 hover:prp-orange-500 prp-cursor-pointer prp-text-white",
    !enabled && "prp-bg-grey-400 prp-text-gray-500"
  );
  return /* @__PURE__ */ React2.createElement(
    "button",
    {
      onClick: handleClick,
      className: classes,
      disabled: !enabled
    },
    /* @__PURE__ */ React2.createElement(FaRotate, null),
    /* @__PURE__ */ React2.createElement("span", { className: "prp-hidden lg:prp-block" }, "Reset")
  );
}

// src/components/PreprPreviewBar.tsx
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Radio,
  RadioGroup
} from "@headlessui/react";
import { FaCaretDown } from "react-icons/fa6";

// src/components/InfoPopover.tsx
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { FaInfoCircle } from "react-icons/fa";
import React3 from "react";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
function InfoPopover({ title, text, link }) {
  return /* @__PURE__ */ React3.createElement(Popover, null, /* @__PURE__ */ React3.createElement(PopoverButton, { className: "prp-ring-0 focus:prp-ring-0 prp-font-bold prp-text-indigo-300 prp-text-xs hover:prp-text-indigo-400 prp-block" }, /* @__PURE__ */ React3.createElement(FaInfoCircle, null)), /* @__PURE__ */ React3.createElement(
    PopoverPanel,
    {
      transition: true,
      anchor: "bottom",
      className: "prp-z-[1000] prp-p-4"
    },
    /* @__PURE__ */ React3.createElement("div", { className: " prp-bg-white rounded-lg p-6 prp-dropshadow-popover prp-space-y-3 prp-max-w-[312px]" }, /* @__PURE__ */ React3.createElement("span", { className: "prp-text-base prp-font-bold prp-leading-tight prp-text-gray-900" }, title), /* @__PURE__ */ React3.createElement("div", { className: "prp-space-y-2" }, /* @__PURE__ */ React3.createElement("span", { className: "prp-text-sm" }, text), /* @__PURE__ */ React3.createElement(
      "a",
      {
        href: link,
        className: "prp-font-black prp-text-sm prp-flex prp-gap-1 prp-items-center prp-text-indigo-700"
      },
      "Learn more ",
      /* @__PURE__ */ React3.createElement(FaArrowUpRightFromSquare, null)
    )))
  ));
}

// src/components/PreprPreviewBar.tsx
function PreprPreviewBar(props) {
  var _a;
  const { activeSegment, activeVariant, data } = props;
  const emptyVariant = "A";
  const emptySegment = {
    body: "Choose segment"
  };
  const [selectedSegment, setSelectedSegment] = useState(
    data.items.filter(
      (segmentData) => segmentData === activeSegment
    )[0] || emptySegment
  );
  const [selectedVariant, setSelectedVariant] = useState(
    activeVariant || "A"
  );
  const router = useRouter();
  const pathname = usePathname();
  const handleUpdateVariant = (variant) => {
    setSelectedVariant(variant);
    const params = new URLSearchParams({});
    params.append("a-b-testing", variant);
    router.push(`${pathname}?${params.toString()}`, {
      scroll: false
    });
    router.refresh();
  };
  const handleUpdateSegment = (value) => {
    setSelectedSegment(value);
    const segment = value.reference_id;
    if (!segment) {
      return;
    }
    const params = new URLSearchParams({});
    if (segment !== "Choose segment") {
      params.append("segments", segment);
    } else {
      params.append("segments", "null");
    }
    router.push(`${pathname}?${params.toString()}`, {
      scroll: false
    });
    router.refresh();
  };
  const handleReset = () => {
    setSelectedSegment(emptySegment);
    setSelectedVariant(emptyVariant);
    const params = new URLSearchParams({});
    params.append("segments", "null");
    params.append("a-b-testing", "null");
    router.push(`${pathname}?${params.toString()}`, {
      scroll: false
    });
    router.refresh();
  };
  return /* @__PURE__ */ React4.createElement("div", { className: "prp-py-4 prp-px-5 md:prp-px-19.5 prp-bg-indigo-default prp-sticky prp-top-0 prp-z-[1000] prp-base" }, /* @__PURE__ */ React4.createElement("div", { className: "prp-flex prp-gap-y-4 prp-gap-x-6 prp-flex-wrap prp-justify-between" }, /* @__PURE__ */ React4.createElement("div", { className: "prp-flex prp-gap-6 prp-items-center" }, /* @__PURE__ */ React4.createElement("div", { className: "prp-h-full prp-flex prp-justify-center prp-items-center" }, /* @__PURE__ */ React4.createElement(PreprLogo, null)), /* @__PURE__ */ React4.createElement("div", { className: "prp-hidden lg:prp-block prp-pb-0.5 prp-text-white prp-text-lg prp-text-bold prp-mr-10" }, "Adaptive Preview")), /* @__PURE__ */ React4.createElement("div", { className: "prp-flex prp-w-full md:prp-w-auto prp-gap-4 lg:prp-gap-6 prp-items-center" }, /* @__PURE__ */ React4.createElement("div", { className: "prp-flex prp-gap-4" }, /* @__PURE__ */ React4.createElement("div", { className: "prp-regular-text prp-text-white 2xl:prp-flex prp-items-center prp-gap-2 prp-hidden" }, /* @__PURE__ */ React4.createElement("span", { className: "prp-pb-0.5" }, "Apply segment"), /* @__PURE__ */ React4.createElement(
    InfoPopover,
    {
      title: "Adaptive Preview",
      text: "Choose a segment to see how it's displayed.",
      link: "Learn more"
    }
  )), /* @__PURE__ */ React4.createElement(
    Listbox,
    {
      value: selectedSegment.slug,
      onChange: handleUpdateSegment
    },
    /* @__PURE__ */ React4.createElement(ListboxButton, { className: "prp-h-10 prp-flex-initial prp-w-[13rem] md:prp-w-[15rem] prp-max-w-[15rem] prp-rounded-md data-[open]:prp-rounded-b-none data-[open]:prp-border-b-white prp-border prp-border-gray-300 prp-items-center prp-bg-white prp-justify-center prp-px-4 prp-regular-text prp-text-gray-500" }, /* @__PURE__ */ React4.createElement("span", { className: "prp-flex prp-items-center prp-justify-between" }, /* @__PURE__ */ React4.createElement("span", null, selectedSegment.body), /* @__PURE__ */ React4.createElement("span", { className: "prp-text-gray-900" }, /* @__PURE__ */ React4.createElement(FaCaretDown, { className: "prp-w-3" })))),
    /* @__PURE__ */ React4.createElement(
      ListboxOptions,
      {
        anchor: "bottom",
        className: "prp-z-[9999] prp-w-[var(--button-width)] prp-pb-2 prp-rounded-b-md prp-bg-white"
      },
      (_a = data == null ? void 0 : data.items) == null ? void 0 : _a.map((segment) => /* @__PURE__ */ React4.createElement(
        ListboxOption,
        {
          className: "prp-px-4 prp-py-2 hover:prp-bg-gray-100 prp-bg-white prp-text-gray-900 prp-regular-text prp-z-[100] hover:prp-cursor-pointer prp-w-full",
          key: segment.reference_id,
          value: segment
        },
        segment.body
      ))
    )
  )), /* @__PURE__ */ React4.createElement("div", { className: "prp-flex prp-gap-4" }, /* @__PURE__ */ React4.createElement("div", { className: "prp-regular-text prp-text-white 2xl:prp-flex prp-items-center prp-gap-2 prp-hidden" }, /* @__PURE__ */ React4.createElement("span", { className: "prp-pb-0.5" }, "Show A/B variant"), /* @__PURE__ */ React4.createElement(
    InfoPopover,
    {
      title: "A/B Testing",
      text: "Choose between two different versions of a page to see which one performs better.",
      link: "Learn more"
    }
  )), /* @__PURE__ */ React4.createElement(
    RadioGroup,
    {
      className: "prp-rounded-lg prp-p-1 prp-border prp-border-gray-300 prp-bg-white prp-flex prp-gap-1 prp-h-10 prp-items-center",
      value: selectedVariant,
      onChange: handleUpdateVariant
    },
    /* @__PURE__ */ React4.createElement(
      Radio,
      {
        value: "A",
        className: "prp-py-2 prp-px-3 prp-rounded-md prp-text-gray-900 prp-regular-text data-[checked]:prp-dropshadow\n                                    data-[checked]:prp-bg-indigo-600 data-[checked]:prp-text-white prp-h-8 prp-text-center prp-flex prp-items-center hover:prp-cursor-pointer\n                                "
      },
      /* @__PURE__ */ React4.createElement("span", { className: "prp-hidden md:prp-inline prp-mr-1" }, "Variant", " "),
      "A"
    ),
    /* @__PURE__ */ React4.createElement(
      Radio,
      {
        value: "B",
        className: "prp-py-2 prp-px-3 prp-rounded-md prp-text-gray-900 prp-regular-text data-[checked]:prp-dropshadow\n                                    data-[checked]:prp-bg-indigo-600 data-[checked]:prp-text-white prp-h-8 prp-text-center prp-flex prp-items-center hover:prp-cursor-pointer\n                                "
      },
      /* @__PURE__ */ React4.createElement("span", { className: "prp-hidden md:prp-inline prp-mr-1" }, "Variant", " "),
      "B"
    )
  )), /* @__PURE__ */ React4.createElement(
    ResetButton,
    {
      handleClick: handleReset,
      enabled: selectedSegment.reference_id || selectedVariant !== "A"
    }
  ))));
}
export {
  PreprPreviewBar
};
//# sourceMappingURL=components.mjs.map