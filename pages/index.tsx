import classNames from 'classnames';
import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { FieldError, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Layout } from '../components/Layout';
import { defaultPreview } from '../data/defaultPreview';
import { Spinner } from '../components/loaders/Spinner';

export default function IndexPage(): ReactElement {
  const [owner, setOwner] = useState('pqt');
  const [repo, setRepo] = useState('social-preview');
  const [token, setToken] = useState('');
  const [repoId, setRepoId] = useState('');
  const [preview, setPreview] = useState(defaultPreview);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    if (preview === '') {
      setPreview(defaultPreview);
    }
  }, [preview]);

  const validationSchema = yup.object().shape({
    owner: yup.string().required('Owner (or Organization) is required'),
    repo: yup.string().required('Repository is required'),
    token: yup.string(),
  });

  const {
    errors,
    formState: { isSubmitting, isValid },
    handleSubmit,
    register,
  } = useForm({ mode: 'onChange', validationSchema });

  const handleOwnerChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setOwner(event.currentTarget.value);
  };
  const handleRepoChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setRepo(event.currentTarget.value);
  };
  const handleTokenChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setToken(event.currentTarget.value);
  };

  const onSubmit = handleSubmit(async ({ owner, repo, token }) => {
    let endpoint = `/api/github/${owner}/${repo}`;

    if (token) {
      endpoint = endpoint.concat(`?token=${token}`);
    }

    const response = await fetch(endpoint.toString());
    const { data } = await response.json();

    setShowNotification(false);
    setNotificationMessage('');

    if (!data.error) {
      setPreview(data.image);
      setRepoId(data.id);
    } else {
      setNotificationMessage(data.error);
      setShowNotification(true);
    }
  });

  const Preview = () => (
    <div
      className={classNames(
        'relative inline-flex shadow-sm rounded border border-gray-300 bg-gray-100 p-1 md:p-2 lg:p-3 overflow-hidden transition-opacity items-center',
        isSubmitting && 'opacity-50'
      )}
    >
      <img src={preview} className="w-full rounded border bg-gray-300" />
      {isSubmitting && (
        <div className="absolute inset-0 flex justify-center items-center">
          <Spinner size={60} />
        </div>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="fixed top-0 left-0 w-1/2 h-full bg-white"></div>
      <div className="fixed top-0 right-0 w-1/2 h-full bg-gray-50"></div>
      <div className="relative min-h-screen flex flex-col">
        {/* <!-- 3 column wrapper --> */}
        <div className="flex-grow w-full max-w-7xl mx-auto xl:px-8 lg:flex">
          {/* <!-- Left sidebar & main wrapper --> */}
          <div className="flex-1 min-w-0 bg-white xl:flex">
            {/* <!-- Account profile --> */}
            <div className="xl:flex-shrink-0 xl:w-64 xl:border-r xl:border-gray-200 bg-white">
              <div className="hidden pl-4 pr-6 py-6 sm:pl-6 lg:pl-8 xl:pl-0">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-8">
                    <div className="space-y-8 sm:space-y-0 sm:flex sm:justify-between sm:items-center xl:block xl:space-y-8">
                      {/* <!-- Profile --> */}
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-full"
                            src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&h=256&q=80"
                            alt=""
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm leading-5 font-medium text-gray-900">Debbie Lewis</div>
                          <a href="#" className="group flex items-center space-x-2.5">
                            <svg
                              className="w-5 h-5 text-gray-400 group-hover:text-gray-500"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M8.99917 0C4.02996 0 0 4.02545 0 8.99143C0 12.9639 2.57853 16.3336 6.15489 17.5225C6.60518 17.6053 6.76927 17.3277 6.76927 17.0892C6.76927 16.8762 6.76153 16.3104 6.75711 15.5603C4.25372 16.1034 3.72553 14.3548 3.72553 14.3548C3.31612 13.316 2.72605 13.0395 2.72605 13.0395C1.9089 12.482 2.78793 12.4931 2.78793 12.4931C3.69127 12.5565 4.16643 13.4198 4.16643 13.4198C4.96921 14.7936 6.27312 14.3968 6.78584 14.1666C6.86761 13.5859 7.10022 13.1896 7.35713 12.965C5.35873 12.7381 3.25756 11.9665 3.25756 8.52116C3.25756 7.53978 3.6084 6.73667 4.18411 6.10854C4.09129 5.88114 3.78244 4.96654 4.27251 3.72904C4.27251 3.72904 5.02778 3.48728 6.74717 4.65082C7.46487 4.45101 8.23506 4.35165 9.00028 4.34779C9.76494 4.35165 10.5346 4.45101 11.2534 4.65082C12.9717 3.48728 13.7258 3.72904 13.7258 3.72904C14.217 4.96654 13.9082 5.88114 13.8159 6.10854C14.3927 6.73667 14.7408 7.53978 14.7408 8.52116C14.7408 11.9753 12.6363 12.7354 10.6318 12.9578C10.9545 13.2355 11.2423 13.7841 11.2423 14.6231C11.2423 15.8247 11.2313 16.7945 11.2313 17.0892C11.2313 17.3299 11.3937 17.6097 11.8501 17.522C15.4237 16.3303 18 12.9628 18 8.99143C18 4.02545 13.97 0 8.99917 0Z"
                                fill="currentcolor"
                              />
                            </svg>
                            <div className="text-sm leading-5 text-gray-500 group-hover:text-gray-900 font-medium">
                              debbielewis
                            </div>
                          </a>
                        </div>
                      </div>
                      {/* <!-- Action buttons --> */}
                      <div className="flex flex-col space-y-3 sm:space-y-0 sm:space-x-3 sm:flex-row xl:flex-col xl:space-x-0 xl:space-y-3">
                        <span className="inline-flex rounded-md shadow-sm">
                          <button
                            type="button"
                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
                          >
                            New Project
                          </button>
                        </span>
                        <span className="inline-flex rounded-md shadow-sm">
                          <button
                            type="button"
                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
                          >
                            Invite Team
                          </button>
                        </span>
                      </div>
                    </div>
                    {/* <!-- Meta info --> */}
                    <div className="flex flex-col space-y-6 sm:flex-row sm:space-y-0 sm:space-x-8 xl:flex-col xl:space-x-0 xl:space-y-6">
                      <div className="flex items-center space-x-2">
                        {/* <!-- Heroicon name: badge-check --> */}
                        <svg
                          className="h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <span className="text-sm text-gray-500 leading-5 font-medium">Pro Member</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {/* <!-- Heroicon name: collection --> */}
                        <svg
                          className="h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                        </svg>
                        <span className="text-sm text-gray-500 leading-5 font-medium">8 Projects</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- Projects List --> */}
            <div className="bg-white lg:min-w-0 lg:flex-1">
              <div className="pl-4 pr-6 pt-4 pb-4 border-t border-gray-200 sm:pl-6 lg:pl-8 xl:pl-6 xl:pt-6 xl:border-t-0">
                <Preview />
                <form className="divide-y divide-gray-200 lg:col-span-9" action="#" method="POST">
                  {/* <!-- Profile section --> */}
                  <div className="py-6 px-1 space-y-6 lg:pb-8">
                    <div className="grid grid-cols-12 gap-6">
                      <div className="col-span-12 sm:col-span-6">
                        <label for="first_name" className="block text-sm font-medium leading-5 text-gray-700">
                          Owner / Organization
                        </label>
                        <input
                          id="first_name"
                          className="form-input mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                        />
                      </div>

                      <div className="col-span-12 sm:col-span-6">
                        <label for="last_name" className="block text-sm font-medium leading-5 text-gray-700">
                          Repository
                        </label>
                        <input
                          id="last_name"
                          className="form-input mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="py-4 flex justify-end space-x-5">
                    <div className="inline-flex rounded-md shadow-sm">
                      <button
                        type="button"
                        className="bg-white border border-gray-300 rounded-md py-2 px-4 inline-flex justify-center text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition duration-150 ease-in-out"
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="inline-flex rounded-md shadow-sm">
                      <button
                        type="submit"
                        className="bg-blue-700 border border-transparent rounded-md py-2 px-4 inline-flex justify-center text-sm leading-5 font-medium text-white hover:bg-blue-600 focus:outline-none focus:border-blue-800 focus:shadow-outline-blue active:bg-blue-800 transition duration-150 ease-in-out"
                      >
                        Save
                      </button>
                    </div>
                  </div>

                  {/* <!-- Privacy section --> */}
                  <div className="pt-6 space-y-4 divide-y divide-gray-200">
                    <div className="px-4 space-y-2 sm:px-6">
                      <div>
                        <h2 className="text-lg leading-6 font-medium text-gray-900">Display</h2>
                        <p className="mt-1 text-sm leading-5 text-gray-500">Modifications</p>
                      </div>
                      <ul className="divide-y divide-gray-200">
                        <li className="py-4 flex items-center justify-between space-x-4">
                          <div className="flex flex-col">
                            <p id="privacy-option-label-1" className="text-sm leading-5 font-medium text-gray-900">
                              Squares
                            </p>
                            <p id="privacy-option-description-1" className="text-sm leading-5 text-gray-500">
                              Use squares instead of circles in the dynamic texture
                            </p>
                          </div>
                          {/* <!-- On: "bg-teal-500", Off: "bg-gray-200" --> */}
                          <span
                            role="checkbox"
                            tabindex="0"
                            aria-checked="true"
                            aria-labelledby="privacy-option-label-1"
                            aria-describedby="privacy-option-description-1"
                            className="bg-gray-200 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:shadow-outline"
                          >
                            {/* <!-- On: "translate-x-5", Off: "translate-x-0" --> */}
                            <span
                              aria-hidden="true"
                              className="translate-x-0 inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200"
                            ></span>
                          </span>
                        </li>
                        <li className="py-4 flex items-center justify-between space-x-4">
                          <div className="flex flex-col">
                            <p id="privacy-option-label-2" className="text-sm leading-5 font-medium text-gray-900">
                              Repository Colors
                            </p>
                            <p id="privacy-option-description-2" className="text-sm leading-5 text-gray-500">
                              Use the repository language colors assigned by GitHub. If turned off a provided set of
                              colors will be used instead.
                            </p>
                          </div>
                          {/* <!-- On: "bg-teal-500", Off: "bg-gray-200" --> */}
                          <span
                            role="checkbox"
                            tabindex="0"
                            aria-checked="false"
                            aria-labelledby="privacy-option-label-2"
                            aria-describedby="privacy-option-description-2"
                            className="bg-gray-200 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:shadow-outline"
                          >
                            {/* <!-- On: "translate-x-5", Off: "translate-x-0" --> */}
                            <span
                              aria-hidden="true"
                              className="translate-x-0 inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200"
                            ></span>
                          </span>
                        </li>
                        <li className="py-4 space-y-4">
                          <div className="flex items-center justify-between space-x-4">
                            <div className="flex flex-col">
                              <p id="privacy-option-label-3" className="text-sm leading-5 font-medium text-gray-900">
                                Provide access token
                              </p>
                              <p id="privacy-option-description-3" className="text-sm leading-5 text-gray-500">
                                Provide your own personal access token so you can generate a social preview image for a
                                repository that is not public.
                              </p>
                            </div>
                            {/* <!-- On: "bg-teal-500", Off: "bg-gray-200" --> */}
                            <span
                              role="checkbox"
                              tabindex="0"
                              aria-checked="true"
                              aria-labelledby="privacy-option-label-3"
                              aria-describedby="privacy-option-description-3"
                              className="bg-gray-200 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:shadow-outline"
                            >
                              {/* <!-- On: "translate-x-5", Off: "translate-x-0" --> */}
                              <span
                                aria-hidden="true"
                                className="translate-x-0 inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200"
                              ></span>
                            </span>
                          </div>
                          <div className="col-span-12">
                            <div className="flex justify-between">
                              <label for="url" className="block text-sm font-medium leading-5 text-gray-700">
                                Personal Access Token
                              </label>
                              <span className="text-sm leading-5 text-gray-500" id="email-optional">
                                Optional
                              </span>
                            </div>
                            <input
                              id="url"
                              className="form-input mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                            />
                          </div>
                        </li>
                        <li className="py-4 flex items-center justify-between space-x-4">
                          <div className="flex flex-col">
                            <p id="privacy-option-label-4" className="text-sm leading-5 font-medium text-gray-900">
                              Darkmode
                            </p>
                            <p id="privacy-option-description-4" className="text-sm leading-5 text-gray-500">
                              Invert the design. Use dark texturing and light text.
                            </p>
                          </div>
                          {/* <!-- On: "bg-teal-500", Off: "bg-gray-200" --> */}
                          <span
                            role="checkbox"
                            tabindex="0"
                            aria-checked="true"
                            aria-labelledby="privacy-option-label-4"
                            aria-describedby="privacy-option-description-4"
                            className="bg-gray-200 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:shadow-outline"
                          >
                            {/* <!-- On: "translate-x-5", Off: "translate-x-0" --> */}
                            <span
                              aria-hidden="true"
                              className="translate-x-0 inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200"
                            ></span>
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </form>
                <div className="flex items-center">
                  <div className="hidden">
                    <h1 className="flex-1 text-lg leading-7 font-medium">Projects</h1>
                    <div className="relative">
                      <span className="rounded-md shadow-sm">
                        <button
                          id="sort-menu"
                          type="button"
                          className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          {/* <!-- Heroicon name: sort-ascending --> */}
                          <svg
                            className="mr-3 h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z" />
                          </svg>
                          Sort
                          {/* <!-- Heroicon name: chevron-down --> */}
                          <svg
                            className="ml-2.5 -mr-1.5 h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </button>
                      </span>
                      <div className="origin-top-right z-10 absolute right-0 mt-2 w-56 rounded-md shadow-lg">
                        <div className="rounded-md bg-white shadow-xs">
                          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="sort-menu">
                            <a
                              href="#"
                              className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                              role="menuitem"
                            >
                              Name
                            </a>
                            <a
                              href="#"
                              className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                              role="menuitem"
                            >
                              Date modified
                            </a>
                            <a
                              href="#"
                              className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                              role="menuitem"
                            >
                              Date created
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <ul className="hidden relative z-0 divide-y divide-gray-200">
                <li className="relative pl-4 pr-6 py-5 hover:bg-gray-50 sm:py-6 sm:pl-6 lg:pl-8 xl:pl-6">
                  <div className="flex items-center justify-between space-x-4">
                    {/* <!-- Repo name and link --> */}
                    <div className="min-w-0 space-y-3">
                      <div className="flex items-center space-x-3">
                        <span
                          aria-label="Running"
                          className="h-4 w-4 bg-green-100 rounded-full flex items-center justify-center"
                        >
                          <span className="h-2 w-2 bg-green-400 rounded-full"></span>
                        </span>

                        <span className="block">
                          <h2 className="text-sm font-medium leading-5">
                            <a href="#">
                              <span className="absolute inset-0"></span>
                              Workcation
                            </a>
                          </h2>
                        </span>
                      </div>
                      <a href="#" className="relative group flex items-center space-x-2.5">
                        <svg
                          className="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-gray-500"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M8.99917 0C4.02996 0 0 4.02545 0 8.99143C0 12.9639 2.57853 16.3336 6.15489 17.5225C6.60518 17.6053 6.76927 17.3277 6.76927 17.0892C6.76927 16.8762 6.76153 16.3104 6.75711 15.5603C4.25372 16.1034 3.72553 14.3548 3.72553 14.3548C3.31612 13.316 2.72605 13.0395 2.72605 13.0395C1.9089 12.482 2.78793 12.4931 2.78793 12.4931C3.69127 12.5565 4.16643 13.4198 4.16643 13.4198C4.96921 14.7936 6.27312 14.3968 6.78584 14.1666C6.86761 13.5859 7.10022 13.1896 7.35713 12.965C5.35873 12.7381 3.25756 11.9665 3.25756 8.52116C3.25756 7.53978 3.6084 6.73667 4.18411 6.10854C4.09129 5.88114 3.78244 4.96654 4.27251 3.72904C4.27251 3.72904 5.02778 3.48728 6.74717 4.65082C7.46487 4.45101 8.23506 4.35165 9.00028 4.34779C9.76494 4.35165 10.5346 4.45101 11.2534 4.65082C12.9717 3.48728 13.7258 3.72904 13.7258 3.72904C14.217 4.96654 13.9082 5.88114 13.8159 6.10854C14.3927 6.73667 14.7408 7.53978 14.7408 8.52116C14.7408 11.9753 12.6363 12.7354 10.6318 12.9578C10.9545 13.2355 11.2423 13.7841 11.2423 14.6231C11.2423 15.8247 11.2313 16.7945 11.2313 17.0892C11.2313 17.3299 11.3937 17.6097 11.8501 17.522C15.4237 16.3303 18 12.9628 18 8.99143C18 4.02545 13.97 0 8.99917 0Z"
                            fill="currentcolor"
                          />
                        </svg>
                        <div className="text-sm leading-5 text-gray-500 group-hover:text-gray-900 font-medium truncate">
                          debbielewis/workcation
                        </div>
                      </a>
                    </div>
                    <div className="sm:hidden">
                      {/* <!-- Heroicon name: chevron-right --> */}
                      <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                    {/* <!-- Repo meta info --> */}
                    <div className="hidden sm:flex flex-col flex-shrink-0 items-end space-y-3">
                      <p className="flex items-center space-x-4">
                        <a
                          href="#"
                          className="relative text-sm leading-5 text-gray-500 hover:text-gray-900 font-medium"
                        >
                          Visit site
                        </a>
                        <button className="relative" type="button">
                          {/* <!-- Heroicon name: star --> */}
                          <svg
                            className="h-5 w-5 text-yellow-300 hover:text-yellow-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      </p>
                      <p className="flex text-gray-500 text-sm leading-5 space-x-2">
                        <span>Laravel</span>
                        <span>&middot;</span>
                        <span>Last deploy 3h ago</span>
                        <span>&middot;</span>
                        <span>United states</span>
                      </p>
                    </div>
                  </div>
                </li>

                {/* <!-- More items... --> */}
              </ul>
            </div>
          </div>
          {/* <!-- Activity feed --> */}
          <div className="bg-gray-50 pr-4 sm:pr-6 lg:pr-8 lg:flex-shrink-0 lg:border-l lg:border-gray-200 xl:pr-0">
            <div className="invisible pl-6 lg:w-80">
              <div className="pt-6 pb-2">
                <h2 className="text-sm leading-5 font-semibold">Activity</h2>
              </div>
              <div>
                <ul className="divide-y divide-gray-200">
                  <li className="py-4">
                    <div className="flex space-x-3">
                      <img
                        className="h-6 w-6 rounded-full"
                        src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&h=256&q=80"
                        alt=""
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium leading-5">You</h3>
                          <p className="text-sm leading-5 text-gray-500">1h</p>
                        </div>
                        <p className="text-sm leading-5 text-gray-500">
                          Deployed Workcation (2d89f0c8 in master) to production
                        </p>
                      </div>
                    </div>
                  </li>

                  {/* <!-- More items... --> */}
                </ul>
                <div className="py-4 text-sm leading-5 border-t border-gray-200">
                  <a href="#" className="text-indigo-600 font-semibold hover:text-indigo-900">
                    View all activity &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
