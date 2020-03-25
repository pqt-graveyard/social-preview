import React, { Fragment, useState } from "react"
import { Layout } from "../components/Layout/Layout"
import { Preview } from "../components/Preview/Preview"

export default () => {
  const [owner, setOwner] = useState("")
  const [repo, setRepo] = useState("")

  const handleOwner = event => {
    setOwner(event.currentTarget.value)
  }
  const handleRepo = event => {
    setRepo(event.currentTarget.value)
  }

  return (
    <Fragment>
      <Layout>
        <div className="flex flex-col-reverse lg:flex-row">
          <div className="p-4 lg:pl-8 lg:w-1/4">
            <div>
              <div>
                <fieldset>
                  <legend className="block text-sm font-medium leading-5 text-gray-700">
                    GitHub Repository
                  </legend>
                  <div className="mt-1 bg-white rounded-md shadow-sm">
                    <div className="flex">
                      <div className="flex-1 w-1/2 min-w-0">
                        <input
                          aria-label="Repository Owner"
                          className="relative block w-full transition duration-150 ease-in-out bg-transparent rounded-none form-input rounded-l-md focus:z-10 sm:text-sm sm:leading-5"
                          placeholder="Owner"
                          onChange={handleOwner}
                          value={owner}
                        />
                      </div>
                      <div className="flex-1 min-w-0 -ml-px">
                        <input
                          aria-label="Repository Name"
                          className="relative block w-full transition duration-150 ease-in-out bg-transparent rounded-none form-input rounded-r-md focus:z-10 sm:text-sm sm:leading-5"
                          placeholder="Name"
                          onChange={handleRepo}
                          value={repo}
                        />
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
              <div className="mt-6 bg-white">
                <fieldset hidden>
                  <legend className="block text-sm font-medium leading-5 text-gray-700">
                    Customizations
                  </legend>
                  <div className="mt-1 rounded-md shadow-sm">
                    <div>
                      <select
                        aria-label="Icon"
                        className="relative block w-full transition duration-150 ease-in-out bg-transparent rounded-none form-select rounded-t-md focus:z-10 sm:text-sm sm:leading-5"
                      >
                        <option>Chevron</option>
                        <option>Code</option>
                        <option>Plus</option>
                      </select>
                    </div>
                    <div className="-mt-px">
                      <input
                        aria-label="Footnote"
                        className="relative block w-full transition duration-150 ease-in-out bg-transparent rounded-none form-input rounded-b-md focus:z-10 sm:text-sm sm:leading-5"
                        placeholder="Footnote"
                      />
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
          <div className="flex-1 p-4">
            <Preview owner={owner} repo={repo} />
          </div>
        </div>
      </Layout>
    </Fragment>
  )
}
