import html2canvas from "html2canvas"
import React, { Fragment, useRef } from "react"
import Image from "../../images/preview-backgrounds/codelines.inline.svg"
import "../../styles/main.css"

export const Preview = ({ owner, repo }) => {
  const previewRef = useRef()
  const download = () => {
    html2canvas(previewRef.current, { allowTaint: true }).then(canvas => {
      const png = canvas.toDataURL("image/png")
      const element = document.createElement("a")
      element.setAttribute("href", png)
      element.setAttribute(
        "download",
        `${owner || "pqt"}-${repo || "social-preview"}.png`
      )
      element.style.display = "none"
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    })
  }

  return (
    <Fragment>
      <div className="relative w-full h-0 overflow-hidden border border-gray-300 rounded-md pt-1/2">
        <div className="absolute top-0 left-0 w-full h-full select-none">
          <div
            ref={previewRef}
            className="relative flex flex-col items-center justify-center w-full h-full font-mono text-2xl text-gray-800 md:text-3xl"
          >
            <div>
              {owner || "pqt"} / {repo || "social-preview"}
            </div>

            <div className="absolute flex items-center justify-center w-full h-full text-gray-900">
              <Image />
            </div>

            <div className="pt-4 font-sans text-base text-gray-500">
              {/* {description} */}
            </div>
          </div>
        </div>
        <span className="absolute inline-flex rounded-md shadow-sm left-2 bottom-2">
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50"
            onClick={download}
          >
            <svg
              className="-ml-0.5 mr-2 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"></path>
            </svg>
            Download
          </button>
        </span>
      </div>
    </Fragment>
  )
}
